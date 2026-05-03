export type RunMode = "upload-ready" | "uploaded" | "converting" | "ready-to-solve" | "solving" | "solved" | "history-review";
export type RunSource = "upload" | "history";
export type BusyMode = "uploading" | "converting" | "solving" | "loading-history" | "loading-run" | false;
export type ReadIntentStatus = "idle" | "waiting-for-upload";
export type ConnectionState = "unknown" | "connected" | "unreachable" | "error";
export type AuthMode = "checking" | "signed-out" | "signed-in";
export type AuthBusyMode = "signing-in" | "registering" | "signing-out" | "requesting-reset" | "resetting-password" | "resending-confirmation" | "confirming-email" | false;
export type WorkspaceLanguage = "vi" | "en";
export type ReviewAnswerState = "none" | "pending" | "solved" | "failed";
export type JobStatus = "queued" | "running" | "completed" | "failed" | "canceled";
export type JobAction = "read" | "solve";

export type User = {
  user_id: string;
  account_identifier: string;
  display_name: string;
  email_confirmed: boolean;
};

export type AuthResponse = {
  user: User;
  message?: string | null;
  session_token?: string | null;
};

export type OkResponse = {
  ok: boolean;
  message?: string | null;
};

export type HistoryItem = {
  run_id: string;
  label: string;
  original_filename: string;
  has_problems: boolean;
  has_solutions: boolean;
};

export type WorksheetInput = {
  input_id: string;
  image_id?: string | null;
  position: number;
  original_filename: string;
  image_url?: string | null;
  content_type?: string | null;
  size_bytes?: number | null;
  gcs_key?: string | null;
};

export type UploadPreview = {
  run: WorksheetRun;
  urls: string[];
};

export type ProblemImageRef = {
  image_id: string;
  gcs_key?: string;
  storage_key?: string;
  content_type?: string | null;
  source?: string | null;
  size_bytes?: number | null;
  image_url?: string | null;
  name?: string | null;
};

export type ProcessingJob = {
  job_id: string;
  run_id: string;
  problem_id?: string | null;
  action: JobAction;
  status: JobStatus;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  elapsed_seconds?: number | null;
  request_context: Record<string, unknown>;
  result_summary: Record<string, unknown>;
  error_message?: string | null;
};

export type ImageExtractionOutcome = {
  outcome_id: string;
  job_id: string;
  worksheet_input_id: string;
  processing_run_id?: string | null;
  position: number;
  status: JobStatus;
  started_at?: string | null;
  finished_at?: string | null;
  elapsed_seconds?: number | null;
  markdown_path?: string | null;
  response_artifact_id?: string | null;
  error_message?: string | null;
};

export type ProblemSolveOutcome = {
  outcome_id: string;
  job_id: string;
  problem_id: string;
  solution_id?: string | null;
  processing_run_id?: string | null;
  position: number;
  status: JobStatus;
  started_at?: string | null;
  finished_at?: string | null;
  elapsed_seconds?: number | null;
  provider?: string | null;
  model?: string | null;
  usage_id?: string | null;
  error_message?: string | null;
};

export type MathProblem = {
  id?: string;
  problem_number?: string | null;
  question?: string;
  answer?: string | null;
  hints?: string | null;
  requires_visual?: boolean;
  visual_description?: string | null;
  image_files?: string[];
  images?: ProblemImageRef[];
};

export type MathSolution = {
  id?: string;
  problem_id?: string | null;
  problem_number?: string | null;
  explanation?: string;
  steps?: string[];
  final_answer?: string;
  elapsed_seconds?: number | null;
};

export type LatestSolve = {
  processing_run_id: string;
  elapsed_seconds?: number | null;
  selected_problem_ids: string[];
  provider?: string | null;
  model?: string | null;
};

export type WorksheetRun = {
  run_id: string;
  source: string;
  state: RunMode;
  metadata: Record<string, unknown>;
  inputs: WorksheetInput[];
  problems: MathProblem[];
  solutions: MathSolution[];
  input_url?: string | null;
  latest_solve?: LatestSolve | null;
  active_job?: ProcessingJob | null;
  jobs: ProcessingJob[];
  image_outcomes: ImageExtractionOutcome[];
  problem_outcomes: ProblemSolveOutcome[];
};

export type HistoryResponse = {
  runs: HistoryItem[];
};

export type HealthResponse = {
  status: string;
};

export type RunResponse = {
  run: WorksheetRun;
  job?: ProcessingJob;
  jobs?: ProcessingJob[];
};

export type CompactJobStatus = {
  job_id: string;
  run_id: string;
  problem_id?: string | null;
  action: JobAction;
  status: JobStatus;
  solution_id?: string | null;
  elapsed_seconds?: number | null;
  error_message?: string | null;
};

export type JobStatusResponse = {
  jobs: CompactJobStatus[];
  unknown_job_ids: string[];
};

export type JobResponse = {
  job: ProcessingJob;
  stages?: unknown[];
  image_outcomes: ImageExtractionOutcome[];
  problem_outcomes: ProblemSolveOutcome[];
};

export type ErrorResponse = {
  error: string;
  detail?: unknown;
};

export type ChromeLabels = {
  tagline: string;
  recentWorksheets: string;
  noSavedRuns: string;
  newWorksheet: string;
  noActiveWorksheet: string;
  runPrefix: string;
  workspaceTitle: string;
  currentWorksheet: string;
  savedWorksheet: string;
  savedResult: string;
  readyForUpload: string;
  signOut: string;
  worksheetLabel: string;
  uploadedWorksheetAlt: string;
  worksheetPlaceholder: string;
  worksheetFileNotPreviewed: string;
  showOriginalImage: string;
  hideOriginalImage: string;
  originalImageHidden: string;
  readWorksheet: string;
  uploadHeading: string;
  uploadSub: string;
  uploadProgress: string;
  uploadReadQueued: string;
  chooseFile: string;
  takePhoto: string;
  selectedCount: string;
  selectAll: string;
  clearSelection: string;
  solveSelected: string;
  noProblemSelected: string;
  solveTime: string;
  readingLabel: string;
  readingSub: string;
  readingWait: string;
  workingLabel: string;
  problemLabel: string;
  answerLabel: string;
  imageLabel: string;
  imageLoadError: string;
  problemUnavailable: string;
  finalAnswerUnavailable: string;
  pendingAnswer: string;
  failedAnswer: string;
  jobQueued: string;
  readJobRunning: string;
  solveJobRunning: string;
  jobFailed: string;
  jobCanceled: string;
  retryFailed: string;
  retryProblem: string;
  reportWrongAnswer: string;
  reportAccepted: string;
  imageStatus: string;
  convertPrompt: string;
  solvePrompt: string;
  explanation: string;
  showSteps: string;
  hideSteps: string;
  account: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  resetPasswordTitle: string;
  resetToken: string;
  newPassword: string;
  requestReset: string;
  resetPassword: string;
  backToSignIn: string;
  resetTokenNote: string;
  passwordMismatch: string;
  passwordResetSent: string;
  passwordResetDone: string;
  emailUnconfirmed: string;
  resendConfirmation: string;
  confirmEmail: string;
  emailConfirmationToken: string;
  emailConfirmationPrompt: string;
  emailConfirmed: string;
  emailConfirmationSent: string;
  createTitle: string;
  loginTitle: string;
  authNote: string;
  createAccount: string;
  signIn: string;
  alreadyHaveAccount: string;
  createNewAccount: string;
};

export type ReviewCard = {
  id: string;
  problem_number: string;
  question: string;
  visual_description: string;
  image_files: string[];
  images: ProblemImageRef[];
  answer_state: ReviewAnswerState;
  final_answer: string;
  steps: string[];
  explanation: string;
  elapsed_seconds?: number | null;
  report_message?: string;
  read_only: boolean;
};
