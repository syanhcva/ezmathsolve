import type { ChromeLabels } from "../types";

type Props = {
  labels: ChromeLabels;
  onRetryFailed?: () => void;
};

export function ActionHeader({ labels, onRetryFailed }: Props) {
  if (!onRetryFailed) return null;

  return (
    <header className="action-bar action-bar-retry">
      <button type="button" className="btn-secondary" onClick={onRetryFailed}>
        {labels.retryFailed}
      </button>
    </header>
  );
}
