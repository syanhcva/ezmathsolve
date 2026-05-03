import { useEffect, useMemo, useRef, useState } from "react";
import {
  convertRun,
  getCurrentUser,
  getHealth,
  getHistory,
  getJobStatuses,
  getRun,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  retryJob,
  solveRun,
  uploadWorksheet,
} from "./api";
import { actionState, authNoticeText, connectionMessage, currentMode, hasActiveJobs, labelsFor, noticeText, reviewCards } from "./state";
import type { AuthBusyMode, AuthMode, BusyMode, ConnectionState, HistoryItem, ReadIntentStatus, RunSource, UploadPreview, User, WorksheetRun, WorkspaceLanguage } from "./types";
import { ActionHeader } from "./components/ActionHeader";
import { AnswerReview } from "./components/AnswerReview";
import { AuthPanel } from "./components/AuthPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { NoticeBar } from "./components/NoticeBar";
import { ProblemReview } from "./components/ProblemReview";
import { UploadPanel } from "./components/UploadPanel";
import { WorksheetPreview } from "./components/WorksheetPreview";

function readableError(caught: unknown, fallback: string) {
  if (caught instanceof TypeError) return fallback;
  return caught instanceof Error ? caught.message : fallback;
}

function defaultImageWidth() {
  return Math.round(Math.min(760, Math.max(420, window.innerWidth * 0.42)));
}

function historyTimestamp(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function historyItemFromUpload(run: WorksheetRun): HistoryItem {
  const originalFilename = typeof run.metadata.original_filename === "string" ? run.metadata.original_filename : run.inputs[0]?.original_filename || "Worksheet";
  return {
    run_id: run.run_id,
    label: `${historyTimestamp()} | ${originalFilename}`,
    original_filename: originalFilename,
    has_problems: run.problems.length > 0,
    has_solutions: run.solutions.length > 0,
  };
}

const PENDING_UPLOAD_RUN_ID = "__pending_upload__";

function filesLabel(files: File[]) {
  return files.length === 1 ? files[0].name : `${files.length} worksheet files`;
}

function runWithLocalPreviews(run: WorksheetRun, files: File[]): UploadPreview {
  const byName = new Map<string, string[]>();
  const urls: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    const url = URL.createObjectURL(file);
    urls.push(url);
    byName.set(file.name, [...(byName.get(file.name) || []), url]);
  }
  return {
    run: {
      ...run,
      inputs: run.inputs.map((input) => {
        const urlsForName = byName.get(input.original_filename);
        const url = urlsForName?.shift();
        return url ? { ...input, image_url: url } : input;
      }),
    },
    urls,
  };
}

function draftRunFromFiles(files: File[]): UploadPreview {
  const urls: string[] = [];
  const inputs = files.map((file, index) => {
    const image_url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    if (image_url) urls.push(image_url);
    return {
      input_id: `local-${index}`,
      position: index + 1,
      original_filename: file.name,
      image_url,
      content_type: file.type || null,
      size_bytes: file.size,
    };
  });
  const originalFilename = filesLabel(files);
  return {
    run: {
      run_id: PENDING_UPLOAD_RUN_ID,
      source: "upload",
      state: "uploaded",
      metadata: { original_filename: originalFilename, local_upload_pending: true },
      inputs,
      problems: [],
      solutions: [],
      input_url: null,
      latest_solve: null,
      active_job: null,
      jobs: [],
      image_outcomes: [],
      problem_outcomes: [],
    },
    urls,
  };
}

function waitForUiPaint() {
  return new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("checking");
  const [authBusy, setAuthBusy] = useState<AuthBusyMode>(false);
  const [user, setUser] = useState<User | null>(null);
  const [run, setRun] = useState<WorksheetRun | null>(null);
  const [source, setSource] = useState<RunSource>("upload");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [busy, setBusy] = useState<BusyMode>(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [connection, setConnection] = useState<ConnectionState>("unknown");
  const [language, setLanguage] = useState<WorkspaceLanguage>("vi");
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [imageCollapsed, setImageCollapsed] = useState(false);
  const [imageWidth, setImageWidth] = useState(defaultImageWidth);
  const [selectedProblemIds, setSelectedProblemIds] = useState<Set<string>>(new Set());
  const [readIntentStatus, setReadIntentStatus] = useState<ReadIntentStatus>("idle");
  const readIntentRef = useRef<ReadIntentStatus>("idle");
  const [temporaryPendingSolveIds, setTemporaryPendingSolveIds] = useState<Set<string>>(new Set());
  const [problemReports, setProblemReports] = useState<Record<string, string>>({});
  const uploadPreviewUrls = useRef<string[]>([]);

  const mode = currentMode(run, source, busy);
  const labels = labelsFor(language);
  const action = useMemo(() => actionState(run, source, busy, language), [run, source, busy, language]);
  const cards = useMemo(() => reviewCards(run, mode, temporaryPendingSolveIds), [run, mode, temporaryPendingSolveIds]);
  const failedJob = run?.jobs.find((job) => job.status === "failed" || job.status === "canceled") || null;
  const uploadPending = busy === "uploading" && Boolean(run?.metadata.local_upload_pending);
  const readQueued = readIntentStatus === "waiting-for-upload";
  const solveTimeText = run?.latest_solve?.elapsed_seconds
    ? `${labels.solveTime}: ${run.latest_solve.elapsed_seconds.toFixed(1)}s`
    : "";

  useEffect(() => {
    if (!run?.problems.length) {
      setSelectedProblemIds(new Set());
      return;
    }
    const solvedIds = new Set(run.solutions.map((solution) => solution.problem_id).filter(Boolean));
    setSelectedProblemIds(new Set(run.problems.filter((problem) => !solvedIds.has(problem.id || "")).map((problem, index) => problem.id || `${index}`)));
  }, [run?.run_id, run?.problems.length, run?.solutions.length]);

  useEffect(() => {
    if (!run?.run_id || !hasActiveJobs(run)) return;
    let canceled = false;
    const poll = async () => {
      try {
        const activeJobIds = run.jobs.filter((job) => ["queued", "running"].includes(job.status)).map((job) => job.job_id);
        if (!activeJobIds.length) {
          const data = await getRun(run.run_id);
          if (!canceled) {
            setRun(data.run);
            if (run.jobs.some((job) => job.action === "solve")) {
              syncHistoryRunState(data.run);
              await refreshHistory();
            }
          }
          return;
        }
        const statusData = await getJobStatuses(activeJobIds);
        const statuses = new Map(statusData.jobs.map((job) => [job.job_id, job]));
        const needsFullRefresh = statusData.jobs.some((job) => ["completed", "failed", "canceled"].includes(job.status));
        if (!canceled) {
          if (needsFullRefresh) {
            const data = await getRun(run.run_id);
            if (!canceled) {
              setRun(data.run);
              if (statusData.jobs.some((job) => job.action === "solve")) {
                syncHistoryRunState(data.run);
                await refreshHistory();
              }
            }
          } else {
            setRun((current) => {
              if (!current || current.run_id !== run.run_id) return current;
              return {
                ...current,
                jobs: current.jobs.map((job) => {
                  const status = statuses.get(job.job_id);
                  if (!status) return job;
                  return {
                    ...job,
                    status: status.status,
                    elapsed_seconds: status.elapsed_seconds,
                    error_message: status.error_message,
                  };
                }),
              };
            });
          }
          setConnection("connected");
        }
      } catch (caught) {
        if (!canceled) {
          setConnection(caught instanceof TypeError ? "unreachable" : "error");
          setError(readableError(caught, "Status refresh failed. Visible results are preserved."));
        }
      }
    };
    const interval = window.setInterval(() => {
      poll().catch((caught: Error) => setError(caught.message));
    }, 2500);
    return () => {
      canceled = true;
      window.clearInterval(interval);
    };
  }, [run?.run_id, run?.jobs.map((job) => `${job.job_id}:${job.status}`).join("|")]);

  function resetWorkspace() {
    clearUploadPreviewUrls();
    setRun(null);
    setHistory([]);
    setSource("upload");
    setSelectedRunId("");
    setBusy(false);
    setImageCollapsed(false);
    setSelectedProblemIds(new Set());
    setTemporaryPendingSolveIds(new Set());
    setProblemReports({});
    setReadIntent("idle");
    setNotice("");
  }

  function handleAuthRequired(message = "Please sign in to continue.") {
    setAuthMode("signed-out");
    setUser(null);
    resetWorkspace();
    setError(message);
  }

  async function refreshHistory() {
    const data = await getHistory();
    setHistory(data.runs);
    setConnection("connected");
  }

  function syncHistoryRunState(updatedRun: WorksheetRun) {
    setHistory((current) => {
      let found = false;
      const next = current.map((item) => {
        if (item.run_id !== updatedRun.run_id) return item;
        found = true;
        return {
          ...item,
          has_problems: updatedRun.problems.length > 0,
          has_solutions: updatedRun.solutions.length > 0,
        };
      });
      return found ? next : [historyItemFromUpload(updatedRun), ...next];
    });
  }

  function clearUploadPreviewUrls() {
    uploadPreviewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    uploadPreviewUrls.current = [];
  }

  function replacePreviewUrls(urls: string[]) {
    clearUploadPreviewUrls();
    uploadPreviewUrls.current = urls;
  }

  function setReadIntent(status: ReadIntentStatus) {
    readIntentRef.current = status;
    setReadIntentStatus(status);
  }

  function clearTransientWork() {
    setReadIntent("idle");
    setTemporaryPendingSolveIds(new Set());
  }

  useEffect(() => clearUploadPreviewUrls, []);

  useEffect(() => {
    async function loadStartupData() {
      try {
        setAuthMode("checking");
        setBusy("loading-history");
        await getHealth();
        setConnection("connected");
        try {
          const authData = await getCurrentUser();
          setUser(authData.user);
          setAuthMode("signed-in");
        } catch {
          setAuthMode("signed-out");
          setUser(null);
          return;
        }
        await refreshHistory();
      } catch (caught) {
        setConnection("unreachable");
        setError(readableError(caught, "Backend is unreachable. Start the backend service and refresh."));
      } finally {
        setBusy(false);
      }
    }
    loadStartupData();
  }, []);

  async function handleLogin(accountIdentifier: string, password: string) {
    setError("");
    setNotice("");
    setAuthBusy("signing-in");
    try {
      const data = await loginUser(accountIdentifier, password);
      setUser(data.user);
      setAuthMode("signed-in");
      setConnection("connected");
      await refreshHistory();
    } catch (caught) {
      setConnection(caught instanceof TypeError ? "unreachable" : "error");
      setError(readableError(caught, "Invalid sign-in details."));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleRegister(accountIdentifier: string, password: string, passwordConfirmation: string, displayName: string) {
    setError("");
    setNotice("");
    setAuthBusy("registering");
    try {
      const data = await registerUser(accountIdentifier, password, passwordConfirmation, displayName);
      setUser(data.user);
      setAuthMode("signed-in");
      setConnection("connected");
      setNotice(data.message || labels.emailConfirmationSent);
      await refreshHistory();
    } catch (caught) {
      setConnection(caught instanceof TypeError ? "unreachable" : "error");
      setError(readableError(caught, "Account registration failed."));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    setError("");
    setNotice("");
    setAuthBusy("signing-out");
    try {
      await logoutUser();
      setConnection("connected");
    } catch (caught) {
      setError(readableError(caught, "Sign out failed."));
    } finally {
      setAuthBusy(false);
      handleAuthRequired("");
    }
  }

  async function handleRequestPasswordReset(accountIdentifier: string) {
    setError("");
    setNotice("");
    setAuthBusy("requesting-reset");
    try {
      const data = await requestPasswordReset(accountIdentifier);
      setConnection("connected");
      setNotice(data.message || labels.passwordResetSent);
    } catch (caught) {
      setConnection(caught instanceof TypeError ? "unreachable" : "error");
      setError(readableError(caught, labels.passwordResetSent));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleResetPassword(token: string, password: string, passwordConfirmation: string) {
    setError("");
    setNotice("");
    setAuthBusy("resetting-password");
    try {
      const data = await resetPassword(token, password, passwordConfirmation);
      setConnection("connected");
      setNotice(data.message || labels.passwordResetDone);
    } catch (caught) {
      setConnection(caught instanceof TypeError ? "unreachable" : "error");
      setError(readableError(caught, "Password reset failed."));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleUpload(files: File[]) {
    setError("");
    setNotice("");
    clearTransientWork();
    const draftPreview = draftRunFromFiles(files);
    replacePreviewUrls(draftPreview.urls);
    setRun(draftPreview.run);
    setSource("upload");
    setSelectedRunId("");
    setImageCollapsed(false);
    setProblemReports({});
    setBusy("uploading");
    try {
      await waitForUiPaint();
      const data = await uploadWorksheet(files);
      const preview = runWithLocalPreviews(data.run, files);
      replacePreviewUrls(preview.urls);
      setConnection("connected");
      setRun(preview.run);
      setSource("upload");
      setSelectedRunId("");
      setImageCollapsed(false);
      setProblemReports({});
      setHistory((current) => [historyItemFromUpload(data.run), ...current.filter((item) => item.run_id !== data.run.run_id)]);
      if (readIntentRef.current === "waiting-for-upload") {
        setReadIntent("idle");
        setBusy("converting");
        const readData = await convertRun(data.run.run_id);
        clearUploadPreviewUrls();
        setRun(readData.run);
        await refreshHistory();
      }
    } catch (caught) {
      setConnection("error");
      setReadIntent("idle");
      clearUploadPreviewUrls();
      setRun(null);
      if (caught instanceof Error && caught.message === "Sign in required.") {
        handleAuthRequired();
        return;
      }
      setError(readableError(caught, "Upload failed because the backend is unreachable."));
    } finally {
      setBusy(false);
    }
  }

  async function handleHistorySelect(runId: string) {
    setError("");
    setNotice("");
    clearTransientWork();
    setSelectedRunId(runId);
    if (!runId) {
      clearUploadPreviewUrls();
      setRun(null);
      setSource("upload");
      return;
    }
    setBusy("loading-run");
    try {
      const data = await getRun(runId);
      clearUploadPreviewUrls();
      setConnection("connected");
      setRun(data.run);
      setSource("history");
      setImageCollapsed(false);
      setProblemReports({});
    } catch (caught) {
      setConnection("error");
      if (caught instanceof Error && caught.message === "Sign in required.") {
        handleAuthRequired();
        return;
      }
      setError(readableError(caught, "Run failed to load because the backend is unreachable."));
    } finally {
      setBusy(false);
    }
  }

  function handleNewSession() {
    clearUploadPreviewUrls();
    clearTransientWork();
    setRun(null);
    setSource("upload");
    setSelectedRunId("");
    setBusy(false);
    setError("");
    setNotice("");
    setImageCollapsed(false);
    setProblemReports({});
  }

  async function handlePrimaryAction() {
    if (!run || !action.action) return;
    if (action.action === "convert" && run.metadata.local_upload_pending) {
      setReadIntent("waiting-for-upload");
      setNotice(labels.uploadReadQueued);
      return;
    }
    if (action.action === "solve" && selectedProblemIds.size === 0) {
      setError(labels.noProblemSelected);
      return;
    }

    setError("");
    setNotice("");
    if (action.action === "solve") setTemporaryPendingSolveIds(new Set(selectedProblemIds));
    setBusy(action.action === "solve" ? "solving" : "converting");
    try {
      await waitForUiPaint();
      const wasHistoryRun = source === "history";
      const data = action.action === "solve" ? await solveRun(run.run_id, Array.from(selectedProblemIds)) : await convertRun(run.run_id);
      clearUploadPreviewUrls();
      setConnection("connected");
      setRun(data.run);
      setSource(wasHistoryRun ? "history" : "upload");
      setSelectedRunId(wasHistoryRun ? data.run.run_id : "");
      setTemporaryPendingSolveIds(new Set());
      if (action.action === "solve") syncHistoryRunState(data.run);
      await refreshHistory();
    } catch (caught) {
      setConnection("error");
      setTemporaryPendingSolveIds(new Set());
      if (caught instanceof Error && caught.message === "Sign in required.") {
        handleAuthRequired();
        return;
      }
      setError(readableError(caught, "Request failed because the backend is unreachable."));
    } finally {
      setBusy(false);
    }
  }

  async function handleRetryFailedJob() {
    if (!run || !failedJob) return;
    setError("");
    setNotice("");
    try {
      await retryJob(run.run_id, failedJob.job_id);
      const data = await getRun(run.run_id);
      setRun(data.run);
      setConnection("connected");
    } catch (caught) {
      setConnection("error");
      setError(readableError(caught, "Retry failed because the backend is unreachable."));
    }
  }

  function toggleProblem(problemId: string) {
    setSelectedProblemIds((current) => {
      const next = new Set(current);
      if (next.has(problemId)) next.delete(problemId);
      else next.add(problemId);
      return next;
    });
  }

  function selectAllProblems() {
    setSelectedProblemIds(new Set(cards.map((card) => card.id)));
  }

  function clearSelection() {
    setSelectedProblemIds(new Set());
  }

  async function handleRetryProblem(problemId: string) {
    if (!run || hasActiveJobs(run)) return;
    setError("");
    setNotice("");
    setTemporaryPendingSolveIds(new Set([problemId]));
    setBusy("solving");
    try {
      await waitForUiPaint();
      const data = await solveRun(run.run_id, [problemId]);
      setConnection("connected");
      setRun(data.run);
      setSource(source === "history" ? "history" : "upload");
      setTemporaryPendingSolveIds(new Set());
      syncHistoryRunState(data.run);
      await refreshHistory();
    } catch (caught) {
      setConnection("error");
      setTemporaryPendingSolveIds(new Set());
      if (caught instanceof Error && caught.message === "Sign in required.") {
        handleAuthRequired();
        return;
      }
      setError(readableError(caught, "Retry failed because the backend is unreachable."));
    } finally {
      setBusy(false);
    }
  }

  function handleReportWrongAnswer(problemId: string) {
    setProblemReports((current) => ({ ...current, [problemId]: labels.reportAccepted }));
  }

  if (authMode !== "signed-in" || !user) {
    return (
      <AuthPanel
        busy={authBusy}
        connection={connection}
        error={error || authNoticeText(connection, language)}
        notice={notice}
        language={language}
        labels={labels}
        onLogin={(accountIdentifier, password) => handleLogin(accountIdentifier, password).catch((caught: Error) => setError(caught.message))}
        onRegister={(accountIdentifier, password, passwordConfirmation, displayName) =>
          handleRegister(accountIdentifier, password, passwordConfirmation, displayName).catch((caught: Error) => setError(caught.message))
        }
        onRequestPasswordReset={(accountIdentifier) => handleRequestPasswordReset(accountIdentifier).catch((caught: Error) => setError(caught.message))}
        onResetPassword={(token, password, passwordConfirmation) => handleResetPassword(token, password, passwordConfirmation).catch((caught: Error) => setError(caught.message))}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <main className="app" data-mode={mode}>
      <HistoryPanel
        history={history}
        collapsed={sidebarCollapsed}
        expanded={historyExpanded}
        labels={labels}
        language={language}
        user={user}
        selectedRunId={selectedRunId}
        runId={run?.run_id}
        onSelectRun={(runId) => handleHistorySelect(runId).catch((caught: Error) => setError(caught.message))}
        onNewSession={handleNewSession}
        onLanguageChange={setLanguage}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        onToggleExpanded={() => setHistoryExpanded((value) => !value)}
        onLogout={() => handleLogout().catch((caught: Error) => setError(caught.message))}
      />

      <section className="workspace">
        <ActionHeader
          labels={labels}
          onRetryFailed={failedJob ? () => handleRetryFailedJob().catch((caught: Error) => setError(caught.message)) : undefined}
        />

        <NoticeBar text={error || notice || (!user.email_confirmed ? labels.emailUnconfirmed : "") || connectionMessage(connection) || noticeText(mode, language, run)} error={Boolean(error)} mode={mode} connection={connection} />

        <section className={`content ${run ? "" : "upload-only"} ${mode === "uploaded" ? "image-only" : ""}`}>
          {run ? (
            <WorksheetPreview
              run={run}
              labels={labels}
              collapsed={imageCollapsed}
              width={imageWidth}
              showReadAction={action.action === "convert"}
              readDisabled={readQueued || (action.disabled && !uploadPending)}
              uploadPending={uploadPending}
              readQueued={readQueued}
              onToggleCollapsed={() => setImageCollapsed((value) => !value)}
              onReadWorksheet={() => handlePrimaryAction().catch((caught: Error) => setError(caught.message))}
              onWidthChange={setImageWidth}
            />
          ) : null}

          {mode !== "uploaded" ? <section className="review">
            <UploadPanel
              hidden={mode !== "upload-ready" || Boolean(run)}
              labels={labels}
              uploading={busy === "uploading"}
              onUpload={(files) => handleUpload(files).catch((caught: Error) => setError(caught.message))}
            />
            {mode === "converting" ? (
              <div className="converting-state" role="status">
                <div className="converting-pencil" aria-hidden="true">
                  <svg className="pencil-svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <g transform="translate(40 40)">
                      <rect x="-6" y="-32" width="12" height="44" rx="3" fill="#F5A623" />
                      <polygon points="-6,12 6,12 0,24" fill="#F5E6CC" />
                      <polygon points="-2,19 2,19 0,24" fill="#2A1A0A" />
                      <rect x="-6" y="-36" width="12" height="6" rx="2" fill="#E07820" />
                      <rect x="-6" y="-40" width="12" height="5" rx="2" fill="#C8C8C8" />
                    </g>
                  </svg>
                </div>
                <div className="converting-progress-track">
                  <div className="converting-progress-fill" />
                </div>
                <span className="converting-label">{labels.readingLabel}</span>
                <span className="converting-sub">{labels.readingSub}</span>
              </div>
            ) : null}
            {mode !== "converting" && ["ready-to-solve", "solving", "solved", "history-review"].includes(mode) ? (
              mode === "solved" || (mode === "history-review" && run?.solutions.length) ? (
                <AnswerReview
                  cards={cards}
                  labels={labels}
                  reportMessages={problemReports}
                  retryDisabled={busy === "solving" || hasActiveJobs(run)}
                  runId={run?.run_id || ""}
                  onReportWrongAnswer={handleReportWrongAnswer}
                  onRetryProblem={(problemId) => handleRetryProblem(problemId).catch((caught: Error) => setError(caught.message))}
                />
              ) : (
                <ProblemReview
                  cards={cards}
                  labels={labels}
                  mode={mode}
                  reportMessages={problemReports}
                  retryDisabled={busy === "solving" || hasActiveJobs(run)}
                  runId={run?.run_id || ""}
                  selectedProblemIds={selectedProblemIds}
                  solveTimeText={solveTimeText}
                  onReportWrongAnswer={handleReportWrongAnswer}
                  onRetryProblem={(problemId) => handleRetryProblem(problemId).catch((caught: Error) => setError(caught.message))}
                  onToggleProblem={toggleProblem}
                  onSelectAll={selectAllProblems}
                  onClearSelection={clearSelection}
                  onSolveSelected={() => handlePrimaryAction().catch((caught: Error) => setError(caught.message))}
                />
              )
            ) : null}
          </section> : null}
        </section>
      </section>
    </main>
  );
}
