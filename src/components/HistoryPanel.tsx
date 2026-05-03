import { historyStateText, historyTitle } from "../state";
import type { ChromeLabels, HistoryItem, User, WorkspaceLanguage } from "../types";

type Props = {
  history: HistoryItem[];
  collapsed: boolean;
  expanded: boolean;
  labels: ChromeLabels;
  language: WorkspaceLanguage;
  user: User;
  selectedRunId: string;
  runId?: string;
  onSelectRun: (runId: string) => void;
  onNewSession: () => void;
  onLanguageChange: (language: WorkspaceLanguage) => void;
  onToggleCollapsed: () => void;
  onToggleExpanded: () => void;
  onLogout: () => void;
};

export function HistoryPanel({
  history,
  collapsed,
  expanded,
  labels,
  language,
  user,
  selectedRunId,
  runId,
  onSelectRun,
  onNewSession,
  onLanguageChange,
  onToggleCollapsed,
  onToggleExpanded,
  onLogout,
}: Props) {
  const activeRunId = selectedRunId || runId || "";

  return (
    <aside className={`sidebar ${collapsed ? "rail" : ""}`}>
      <div className="sidebar-toggle">
        <button type="button" className="sidebar-toggle-icon toggle-expand" onClick={onToggleCollapsed} title="Mở rộng">
          &rsaquo;
        </button>
        <button type="button" className="sidebar-toggle-icon toggle-collapse" onClick={onToggleCollapsed} title="Thu gọn">
          &lsaquo;
        </button>
      </div>
      <div className="sidebar-brand">
        <span className="brand-icon" aria-hidden="true">
          &Sigma;
        </span>
        <div className="brand-text">
          <h1 className="brand-name">MathSolve</h1>
          <p className="brand-tagline">{labels.tagline}</p>
        </div>
      </div>

      <nav className="history-nav" aria-label="Recent worksheets">
        <button type="button" className="btn-new-session" onClick={onNewSession}>
          <span className="btn-new-session-icon" aria-hidden="true">
            +
          </span>
          <span className="btn-new-session-label">{labels.newWorksheet}</span>
        </button>
        <button type="button" className={`nav-toggle ${expanded ? "" : "collapsed"}`} onClick={onToggleExpanded} aria-expanded={expanded}>
          <span>{labels.recentWorksheets}</span>
          <span className="nav-toggle-arrow" aria-hidden="true">
            v
          </span>
        </button>
        <div className={`history-list-wrap ${expanded ? "" : "collapsed"}`}>
          {history.length === 0 ? (
            <p className="nav-empty">{labels.noSavedRuns}</p>
          ) : (
            <ul className="history-list">
              {history.map((run) => {
                const stateClass = run.has_solutions ? "solved" : run.has_problems ? "extracted" : "uploaded";
                const stateLabel = historyStateText(run.has_problems, run.has_solutions, language);
                const selected = activeRunId === run.run_id;

                return (
                  <li className={`history-item ${stateClass} ${selected ? "selected" : ""}`} key={run.run_id}>
                    <button type="button" onClick={() => onSelectRun(run.run_id)} aria-current={selected ? "page" : undefined}>
                      <span className="history-dot" aria-hidden="true" />
                      <span className="history-info">
                        <span className="run-label">{historyTitle(run, language)}</span>
                        <span className="run-meta">{stateLabel}</span>
                        {run.original_filename ? <span className="run-file">{run.original_filename}</span> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-account-controls">
          <div className="sidebar-lang-switcher" aria-label="Workspace language">
            <button type="button" className={`lang-btn ${language === "vi" ? "active" : ""}`} onClick={() => onLanguageChange("vi")}>
              Vi
            </button>
            <button type="button" className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => onLanguageChange("en")}>
              En
            </button>
          </div>
          <div className="sidebar-user-chip" title={user.account_identifier}>
            <span>{user.display_name}</span>
            <button type="button" onClick={onLogout}>
              {user.is_guest ? labels.signIn : labels.signOut}
            </button>
          </div>
        </div>
        <p className="run-id-chip">{runId ? `${labels.runPrefix} ${runId}` : labels.noActiveWorksheet}</p>
      </div>
    </aside>
  );
}
