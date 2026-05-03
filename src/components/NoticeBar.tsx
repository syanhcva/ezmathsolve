import type { ConnectionState, RunMode } from "../types";

type Props = {
  text: string;
  error: boolean;
  mode: RunMode;
  connection: ConnectionState;
};

export function NoticeBar({ text, error, mode, connection }: Props) {
  if (!text) return null;

  const connectionClass = connection === "connected" || connection === "unknown" ? "" : "error";
  const className = `notice-bar ${error ? "error" : connectionClass} ${mode === "history-review" && !error ? "review-only" : ""}`;
  const icon = error || connectionClass ? "!" : mode === "history-review" ? "R" : "i";

  return (
    <div className={className}>
      <span className="notice-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="notice-text">{text}</span>
    </div>
  );
}
