import type { BusyMode, ChromeLabels, ConnectionState, ReviewCard, RunMode, RunSource, WorkspaceLanguage, WorksheetRun } from "./types";

export const LABELS: Record<WorkspaceLanguage, ChromeLabels> = {
  vi: {
    tagline: "Trợ lý bài tập",
    recentWorksheets: "Phiên gần đây",
    noSavedRuns: "Chưa có bài tập đã lưu.",
    newWorksheet: "Bài tập mới",
    noActiveWorksheet: "Chưa có bài tập",
    runPrefix: "Phiên",
    workspaceTitle: "Bài tập",
    currentWorksheet: "Bài tập hiện tại",
    savedWorksheet: "Bài tập đã lưu",
    savedResult: "Đang xem bài đã lưu",
    readyForUpload: "Chọn bài tập",
    signOut: "Đăng xuất",
    worksheetLabel: "Tệp bài tập",
    uploadedWorksheetAlt: "Bài tập đã tải lên",
    worksheetPlaceholder: "Bài tập sẽ hiện ở đây sau khi tải lên",
    worksheetFileNotPreviewed: "Tệp này đã sẵn sàng để đọc.",
    showOriginalImage: "Hiện tệp",
    hideOriginalImage: "Thu gọn tệp",
    originalImageHidden: "Tệp bài tập đang được thu gọn.",
    readWorksheet: "Đọc bài tập →",
    uploadHeading: "Thả bài tập vào đây",
    uploadSub: "hoặc nhấn để chọn một hay nhiều file - JPG, JPEG, PNG, PDF",
    uploadProgress: "Đang lưu bài tập...",
    uploadReadQueued: "Sẽ bắt đầu đọc ngay khi lưu xong.",
    chooseFile: "Chọn tệp",
    takePhoto: "Chụp ảnh",
    selectedCount: "đã chọn",
    selectAll: "Chọn tất cả",
    clearSelection: "Bỏ chọn",
    solveSelected: "Giải bài đã chọn",
    noProblemSelected: "Chọn ít nhất một bài để giải.",
    solveTime: "Thời gian giải",
    readingLabel: "Đang đọc bài tập...",
    readingSub: "Thường mất 30-60 giây. Hãy giữ tab này mở.",
    readingWait: "Thường mất 30-60 giây. Hãy giữ tab này mở.",
    workingLabel: "Đang xử lý...",
    problemLabel: "Bài",
    answerLabel: "Đáp án",
    imageLabel: "hình ảnh đính kèm",
    imageLoadError: "Không tải được hình",
    problemUnavailable: "Không đọc được nội dung bài này.",
    finalAnswerUnavailable: "Chưa có đáp án cuối.",
    pendingAnswer: "Đang giải...",
    failedAnswer: "Chưa giải được bài này.",
    jobQueued: "Đang chờ xử lý",
    readJobRunning: "Đang đọc bài tập",
    solveJobRunning: "Đang giải bài đã chọn",
    jobFailed: "Cần thử lại",
    jobCanceled: "Đã dừng",
    retryFailed: "Thử lại",
    retryProblem: "Giải lại bài này",
    reportWrongAnswer: "Báo đáp án sai",
    reportAccepted: "Đã ghi nhận báo cáo.",
    imageStatus: "Tệp",
    convertPrompt: "Bài tập đã tải lên. Nhấn Đọc bài để trích xuất bài toán.",
    solvePrompt: "Nhấn Giải để tạo đáp án.",
    explanation: "Giải thích",
    showSteps: "Xem các bước",
    hideSteps: "Ẩn các bước",
    account: "Tài khoản",
    displayName: "Tên hiển thị",
    password: "Mật khẩu",
    confirmPassword: "Nhập lại mật khẩu",
    forgotPassword: "Quên mật khẩu?",
    resetPasswordTitle: "Đặt lại mật khẩu",
    resetToken: "Mã đặt lại",
    newPassword: "Mật khẩu mới",
    requestReset: "Gửi hướng dẫn",
    resetPassword: "Đặt lại mật khẩu",
    backToSignIn: "Quay lại đăng nhập",
    resetTokenNote: "Dùng mã nhận được để đặt mật khẩu mới.",
    passwordMismatch: "Hai mật khẩu không khớp.",
    passwordResetSent: "Nếu tài khoản tồn tại, hướng dẫn đặt lại đã được tạo.",
    passwordResetDone: "Đã đặt lại mật khẩu. Hãy đăng nhập bằng mật khẩu mới.",
    emailUnconfirmed: "Email chưa được xác nhận.",
    resendConfirmation: "Gửi lại xác nhận",
    confirmEmail: "Xác nhận email",
    emailConfirmationToken: "Mã xác nhận email",
    emailConfirmationPrompt: "Dán mã xác nhận email",
    emailConfirmed: "Email đã được xác nhận.",
    emailConfirmationSent: "Hướng dẫn xác nhận email đã được tạo.",
    createTitle: "Tạo tài khoản lưu bài tập",
    loginTitle: "Đăng nhập",
    authNote: "Lịch sử bài tập riêng cho tài khoản này.",
    createAccount: "Tạo tài khoản",
    signIn: "Đăng nhập",
    continueAsGuest: "Dùng thử không cần tài khoản",
    guestAuthNote: "Bạn có thể thử ngay. Bài làm khách chỉ là tạm thời.",
    guestWorkspaceNotice: "Bạn đang dùng chế độ khách. Tạo hoặc đăng nhập tài khoản để lưu lịch sử lâu dài.",
    alreadyHaveAccount: "Tôi đã có tài khoản",
    createNewAccount: "Tạo tài khoản mới",
  },
  en: {
    tagline: "Homework helper",
    recentWorksheets: "Recent worksheets",
    noSavedRuns: "No saved runs yet.",
    newWorksheet: "New worksheet",
    noActiveWorksheet: "No active worksheet",
    runPrefix: "Run",
    workspaceTitle: "Worksheet",
    currentWorksheet: "Current worksheet",
    savedWorksheet: "Saved worksheet",
    savedResult: "Viewing saved result",
    readyForUpload: "Choose a worksheet",
    signOut: "Sign out",
    worksheetLabel: "Worksheet file",
    uploadedWorksheetAlt: "Uploaded worksheet",
    worksheetPlaceholder: "Your worksheet will appear here after upload",
    worksheetFileNotPreviewed: "This file is ready to read.",
    showOriginalImage: "Show file",
    hideOriginalImage: "Hide file",
    originalImageHidden: "Worksheet file is minimized.",
    readWorksheet: "Read Worksheet →",
    uploadHeading: "Drop your worksheet here",
    uploadSub: "or click to choose one or more files - JPG, JPEG, PNG, PDF",
    uploadProgress: "Saving worksheet...",
    uploadReadQueued: "Reading will start as soon as saving finishes.",
    chooseFile: "Choose file",
    takePhoto: "Take photo",
    selectedCount: "selected",
    selectAll: "Select all",
    clearSelection: "Clear",
    solveSelected: "Solve selected",
    noProblemSelected: "Select at least one problem to solve.",
    solveTime: "Solve time",
    readingLabel: "Reading your worksheet...",
    readingSub: "This usually takes 30-60 seconds. You can keep this tab open.",
    readingWait: "This usually takes 30-60 seconds. You can keep this tab open.",
    workingLabel: "Working...",
    problemLabel: "Problem",
    answerLabel: "Answer",
    imageLabel: "attached image",
    imageLoadError: "Image could not be loaded",
    problemUnavailable: "Question is unavailable.",
    finalAnswerUnavailable: "Final answer unavailable",
    pendingAnswer: "Solving...",
    failedAnswer: "This problem was not solved.",
    jobQueued: "Waiting to start",
    readJobRunning: "Reading worksheet",
    solveJobRunning: "Solving selected problems",
    jobFailed: "Retry needed",
    jobCanceled: "Stopped",
    retryFailed: "Retry",
    retryProblem: "Retry this problem",
    reportWrongAnswer: "Report wrong answer",
    reportAccepted: "Report received.",
    imageStatus: "File",
    convertPrompt: "The worksheet is loaded. Use Read Worksheet to extract math problems.",
    solvePrompt: "Use Solve to get an answer.",
    explanation: "Explanation",
    showSteps: "Show steps",
    hideSteps: "Hide steps",
    account: "Account",
    displayName: "Display name",
    password: "Password",
    confirmPassword: "Confirm password",
    forgotPassword: "Forgot password?",
    resetPasswordTitle: "Reset password",
    resetToken: "Reset token",
    newPassword: "New password",
    requestReset: "Send instructions",
    resetPassword: "Reset password",
    backToSignIn: "Back to sign in",
    resetTokenNote: "Use the token from the instructions to choose a new password.",
    passwordMismatch: "Passwords do not match.",
    passwordResetSent: "If the account exists, reset instructions were generated.",
    passwordResetDone: "Password reset complete. Sign in with the new password.",
    emailUnconfirmed: "Email is not confirmed.",
    resendConfirmation: "Resend confirmation",
    confirmEmail: "Confirm email",
    emailConfirmationToken: "Email confirmation token",
    emailConfirmationPrompt: "Paste your email confirmation token",
    emailConfirmed: "Email confirmed.",
    emailConfirmationSent: "Email confirmation instructions were generated.",
    createTitle: "Create an account for your worksheets",
    loginTitle: "sign in",
    authNote: "Your worksheet history is private to this account.",
    createAccount: "Create account",
    signIn: "Sign in",
    continueAsGuest: "Continue as guest",
    guestAuthNote: "Try it now. Guest work is temporary.",
    guestWorkspaceNotice: "You are using guest mode. Create or sign in to an account for durable saved history.",
    alreadyHaveAccount: "I already have an account",
    createNewAccount: "Create a new account",
  },
};

export function labelsFor(language: WorkspaceLanguage) {
  return LABELS[language];
}

export function currentMode(run: WorksheetRun | null, source: RunSource, busy: BusyMode): RunMode {
  if (busy === "converting" || busy === "solving") return busy;
  if (!run) return "upload-ready";
  if (run.active_job?.action === "read" && ["queued", "running"].includes(run.active_job.status)) return "converting";
  if (run.active_job?.action === "solve" && ["queued", "running"].includes(run.active_job.status)) return "solving";
  if (run.solutions.length === run.problems.length && run.solutions.length > 0) return source === "history" ? "history-review" : "solved";
  if (run.problems.length) return "ready-to-solve";
  return "uploaded";
}

function activeJob(run: WorksheetRun | null) {
  const activeFromList = run?.jobs?.find((job) => ["queued", "running"].includes(job.status));
  if (activeFromList) return activeFromList;
  return run?.active_job && ["queued", "running"].includes(run.active_job.status) ? run.active_job : null;
}

export function hasActiveJobs(run: WorksheetRun | null) {
  return Boolean(activeJob(run));
}

function jobSummary(job: WorksheetRun["active_job"]) {
  if (!job?.result_summary) return "";
  const completed = Number(job.result_summary.completed || 0);
  const total = Number(job.result_summary.total || 0);
  if (!total) return "";
  return `${completed} of ${total}`;
}

export function noticeText(mode: RunMode, language: WorkspaceLanguage, run?: WorksheetRun | null) {
  const job = activeJob(run || null);
  if (job) {
    const summary = jobSummary(job);
    if (language === "vi") {
      if (job.action === "read") return summary ? `Đang đọc bài tập. ${summary} tệp đã xong.` : "Đang đọc bài tập.";
      return summary ? `Đang giải bài đã chọn. ${summary} bài đã xong.` : "Đang giải bài đã chọn.";
    }
    if (job.action === "read") return summary ? `Reading worksheet. ${summary} files complete.` : "Reading worksheet.";
    return summary ? `Solving selected problems. ${summary} complete.` : "Solving selected problems.";
  }
  const failedJob = run?.jobs?.find((item) => item.status === "failed");
  if (failedJob) {
    return language === "vi" ? "Một tác vụ chưa hoàn tất. Bạn có thể thử lại." : "A recent task did not finish. You can retry it.";
  }
  if (language === "vi") {
    if (mode === "converting") return "Đang đọc bài tập. Thường mất 30-60 giây. Hãy giữ tab này mở.";
    if (mode === "ready-to-solve") return "Các bài toán đã được trích xuất. Nhấn Giải để bắt đầu.";
    if (mode === "solving") return "Đang tạo lời giải từng bước cho từng bài toán.";
    if (mode === "solved") return "Đã giải xong. Hãy xem lại đáp án cùng học sinh.";
    if (mode === "history-review") return "Đây là bài tập đã lưu. Bạn có thể xem lại đáp án bên dưới.";
    if (run) return "";
    return "";
  }
  if (mode === "converting") return "Reading your worksheet. This usually takes 30-60 seconds. You can keep this tab open.";
  if (mode === "ready-to-solve") return "";
  if (mode === "solving") return "Generating step-by-step solutions for each problem.";
  if (mode === "solved") return "All problems are solved. Review the answers with your student.";
  if (mode === "history-review") return "This is a saved worksheet result. Review the answers below.";
  if (run) return "";
  return "";
}

export function connectionMessage(connection: ConnectionState) {
  if (connection === "connected") return "";
  if (connection === "unreachable") return "Backend is unreachable. Start the backend service and refresh.";
  if (connection === "error") return "Backend returned an error. Check the message below.";
  return "Checking backend connection...";
}

export function authNoticeText(connection: ConnectionState, language: WorkspaceLanguage) {
  if (connection === "unreachable") {
    return language === "vi" ? "Không kết nối được backend. Hãy khởi động backend và tải lại." : "Backend is unreachable. Start the backend service and refresh.";
  }
  if (connection === "unknown") return language === "vi" ? "Đang kiểm tra kết nối backend..." : "Checking backend connection...";
  return "";
}

export function actionState(run: WorksheetRun | null, source: RunSource, busy: BusyMode, language: WorkspaceLanguage) {
  const mode = currentMode(run, source, busy);
  const active = activeJob(run);
  const hasImage = Boolean(run && (run.input_url || run.inputs.length));
  const isPendingUpload = Boolean(run?.metadata.local_upload_pending);
  const canConvert = Boolean(hasImage && run?.problems.length === 0 && (!busy || (busy === "uploading" && isPendingUpload)) && active?.action !== "read");
  const canSolve = Boolean(run && run.problems.length > 0 && !busy && mode !== "history-review" && active?.action !== "solve");
  const labels =
    language === "vi"
      ? { convert: "Đọc bài tập →", solve: "Giải", resolve: "Giải lại", reviewOnly: "Đang xem bài đã lưu", upload: "Chọn bài tập" }
      : { convert: "Read Worksheet →", solve: "Solve", resolve: "Re-solve", reviewOnly: "Viewing saved result", upload: "Choose a worksheet" };
  return {
    disabled: !canConvert && !canSolve,
    action: canConvert ? "convert" : canSolve ? "solve" : null,
    label: canConvert
      ? labels.convert
      : canSolve
        ? run?.solutions.length
          ? labels.resolve
          : labels.solve
        : mode === "history-review"
          ? labels.reviewOnly
          : labels.upload,
  } as const;
}

export function historyStateText(hasProblems: boolean, hasSolutions: boolean, language: WorkspaceLanguage) {
  if (language === "vi") {
    if (hasSolutions) return "đã giải";
    if (hasProblems) return "đã đọc";
    return "đã tải lên";
  }
  if (hasSolutions) return "solved";
  if (hasProblems) return "extracted";
  return "uploaded";
}

export function historyTitle(run: { label: string; run_id: string }, language: WorkspaceLanguage) {
  const timestamp = run.label.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
  if (!timestamp) return language === "vi" ? `Bài tập ${run.run_id}` : `Worksheet ${run.run_id}`;

  const [, , month, day, hourText, minute] = timestamp;
  const hour = Number(hourText);
  if (language === "vi") return `Bài tập ${day}/${month}, ${hourText}:${minute}`;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const displayHour = hour % 12 || 12;
  const suffix = hour >= 12 ? "PM" : "AM";
  return `Worksheet from ${monthNames[Number(month) - 1]} ${Number(day)}, ${displayHour}:${minute} ${suffix}`;
}

export function reviewCards(run: WorksheetRun | null, mode: RunMode, temporaryPendingSolveIds = new Set<string>()): ReviewCard[] {
  if (!run?.problems.length) return [];
  const readOnly = mode === "history-review";
  const activeSolveJobs = run.jobs.filter((job) => job.action === "solve" && ["queued", "running"].includes(job.status));
  const activeSolveIds = new Set(
    activeSolveJobs.flatMap((job) =>
      Array.isArray(job.request_context.problem_ids)
        ? job.request_context.problem_ids.filter((id): id is string => typeof id === "string")
        : job.problem_id
          ? [job.problem_id]
          : [],
    ),
  );
  const solutionsByProblemId = new Map(run.solutions.map((solution) => [solution.problem_id || "", solution]));
  const outcomesByProblemId = new Map();
  for (const outcome of run.problem_outcomes) {
    if (!outcomesByProblemId.has(outcome.problem_id)) outcomesByProblemId.set(outcome.problem_id, outcome);
  }
  return run.problems.map((problem, index) => {
    const problemId = problem.id || `${index}`;
    const outcome = outcomesByProblemId.get(problemId);
    const activeOutcome = activeSolveJobs.some((job) => outcome?.job_id === job.job_id) ? outcome : null;
    const solution = solutionsByProblemId.get(problemId);
    const answerState =
      temporaryPendingSolveIds.has(problemId) || activeOutcome?.status === "running" || activeOutcome?.status === "queued" || (activeSolveIds.has(problemId) && !activeOutcome)
        ? "pending"
        : activeOutcome?.status === "failed" || outcome?.status === "failed"
          ? "failed"
          : solution
            ? "solved"
            : activeOutcome?.status === "completed" || outcome?.status === "completed"
              ? "pending"
            : "none";
    return {
      id: problemId,
      problem_number: problem.problem_number || String(index + 1),
      question: problem.question || "",
      visual_description: problem.visual_description || "",
      image_files: problem.image_files || [],
      images: problem.images || [],
      answer_state: answerState,
      final_answer: solution?.final_answer || "",
      steps: solution?.steps || [],
      explanation: solution?.explanation || "",
      elapsed_seconds: solution?.elapsed_seconds ?? outcome?.elapsed_seconds ?? null,
      read_only: readOnly,
    };
  });
}
