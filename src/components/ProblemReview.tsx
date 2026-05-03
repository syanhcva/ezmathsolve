import { imageRefUrl, problemImageUrl } from "../api";
import { formatMathText } from "../text";
import type { ChromeLabels, ReviewCard, RunMode } from "../types";

type Props = {
  cards: ReviewCard[];
  labels: ChromeLabels;
  mode: RunMode;
  reportMessages: Record<string, string>;
  retryDisabled: boolean;
  runId: string;
  selectedProblemIds: Set<string>;
  solveTimeText?: string;
  onReportWrongAnswer: (problemId: string) => void;
  onRetryProblem: (problemId: string) => void;
  onToggleProblem: (problemId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSolveSelected: () => void;
};

function problemTitle(card: ReviewCard) {
  return card.problem_number;
}

export function ProblemReview({
  cards,
  labels,
  mode,
  reportMessages,
  retryDisabled,
  runId,
  selectedProblemIds,
  solveTimeText,
  onReportWrongAnswer,
  onRetryProblem,
  onToggleProblem,
  onSelectAll,
  onClearSelection,
  onSolveSelected,
}: Props) {
  if (!runId) {
    return (
      <section className="panel-empty">
        <span className="panel-empty-label">{labels.problemLabel}</span>
        <p className="panel-empty-text">{labels.worksheetPlaceholder}</p>
      </section>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="panel-empty">
        <span className="panel-empty-label">{labels.problemLabel}</span>
        <p className="panel-empty-text">{labels.convertPrompt}</p>
      </section>
    );
  }

  return (
    <section className="problem-stack">
      <div className="problem-toolbar">
        <span>{`${selectedProblemIds.size} ${labels.selectedCount}`}</span>
        {solveTimeText ? <span>{solveTimeText}</span> : null}
        <button type="button" onClick={onSelectAll}>{labels.selectAll}</button>
        <button type="button" onClick={onClearSelection}>{labels.clearSelection}</button>
        <button type="button" className="solve-selected-button" disabled={!selectedProblemIds.size || mode === "solving"} onClick={onSolveSelected}>
          {labels.solveSelected}
        </button>
      </div>
      {cards.map((card, index) => (
        <article className={`problem-card ${card.answer_state === "pending" ? "with-pending-answer" : ""}`} key={`${card.problem_number}-${card.question || index}`}>
          <label className="problem-question-row">
            <input
              type="checkbox"
              checked={selectedProblemIds.has(card.id)}
              onChange={() => onToggleProblem(card.id)}
            />
            <span className="problem-num-badge">{problemTitle(card)}</span>
            <span className="problem-text">{formatMathText(card.question) || labels.problemUnavailable}</span>
          </label>
          {card.images.length
            ? card.images.map((image) => (
              <img
                key={image.image_id}
                className="problem-img"
                src={imageRefUrl(image.image_url)}
                alt={image.name || image.image_id}
                onError={(event) => {
                  event.currentTarget.replaceWith(`${labels.imageLoadError}: ${image.name || image.image_id}`);
                }}
              />
            ))
            : card.image_files.length
              ? card.image_files.map((name) => (
              <img
                key={name}
                className="problem-img"
                src={problemImageUrl(runId, name)}
                alt={name}
                onError={(event) => {
                  event.currentTarget.replaceWith(`${labels.imageLoadError}: ${name}`);
                }}
              />
            ))
            : null}
          {card.answer_state === "pending" ? (
            <div className="sc-answer pending">
              <div className="pending-dots" aria-hidden="true">
                <span className="pending-dot" />
                <span className="pending-dot" />
                <span className="pending-dot" />
              </div>
              <span className="sc-final">{labels.pendingAnswer}</span>
            </div>
          ) : null}
          {card.answer_state === "failed" ? (
            <div className="sc-answer failed">
              <span className="sc-final">{labels.failedAnswer}</span>
            </div>
          ) : null}
          {card.answer_state === "solved" ? (
            <>
              <div className="sc-answer">
                <span className="sc-final">{formatMathText(card.final_answer) || labels.finalAnswerUnavailable}</span>
                {card.elapsed_seconds ? <span className="problem-elapsed">{`${card.elapsed_seconds.toFixed(1)}s`}</span> : null}
              </div>
              {card.steps.length || card.explanation ? (
                <details className="sc-explanation">
                  <summary>
                    <span className="sc-exp-label">
                      <span className="sc-exp-show">{labels.showSteps}</span>
                      <span className="sc-exp-hide">{labels.hideSteps}</span>
                    </span>
                    <span className="sc-exp-arrow" aria-hidden="true">
                      &gt;
                    </span>
                  </summary>
                  <div className="sc-exp-body">
                    {card.steps.length ? (
                      <ol className="sc-steps">
                        {card.steps.map((step, stepIndex) => (
                          <li className="sc-step" key={stepIndex}>
                            <span className="sc-step-num">{stepIndex + 1}</span>
                            <span className="sc-step-text">{formatMathText(step)}</span>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                    {card.explanation ? <p className="sc-exp-note">{formatMathText(card.explanation)}</p> : null}
                  </div>
                </details>
              ) : null}
            </>
          ) : null}
          {card.answer_state === "solved" ? (
            <>
              <div className="problem-card-actions">
                <button type="button" disabled={retryDisabled} onClick={() => onRetryProblem(card.id)}>
                  {labels.retryProblem}
                </button>
                <button type="button" onClick={() => onReportWrongAnswer(card.id)}>
                  {labels.reportWrongAnswer}
                </button>
              </div>
              {reportMessages[card.id] ? <p className="problem-report-note">{reportMessages[card.id]}</p> : null}
            </>
          ) : null}
        </article>
      ))}
    </section>
  );
}
