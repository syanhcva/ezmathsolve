import { imageRefUrl, problemImageUrl } from "../api";
import { formatMathText } from "../text";
import type { ChromeLabels, ReviewCard } from "../types";

type Props = {
  cards: ReviewCard[];
  labels: ChromeLabels;
  reportMessages: Record<string, string>;
  retryDisabled: boolean;
  runId: string;
  onReportWrongAnswer: (problemId: string) => void;
  onRetryProblem: (problemId: string) => void;
};

export function AnswerReview({ cards, labels, reportMessages, retryDisabled, runId, onReportWrongAnswer, onRetryProblem }: Props) {
  if (!cards.length) {
    return (
      <section className="panel-empty">
        <span className="panel-empty-label">{labels.answerLabel}</span>
        <p className="panel-empty-text">{labels.solvePrompt}</p>
      </section>
    );
  }

  return (
    <section className="problem-stack">
      {cards.map((card, index) => {
        const hasDetails = card.steps.length > 0 || Boolean(card.explanation);
        return (
          <article className="solved-card" key={`${card.problem_number}-${index}`}>
            <div className="sc-question">
              <div className="sc-question-row">
                <span className="sc-num-badge">{card.problem_number}</span>
                <p className="sc-text">{formatMathText(card.question) || labels.problemUnavailable}</p>
              </div>
              {card.images.length
                ? card.images.map((image) => (
                  <img
                    key={image.image_id}
                    className="sc-img"
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
                    className="sc-img"
                    src={problemImageUrl(runId, name)}
                    alt={name}
                    onError={(event) => {
                      event.currentTarget.replaceWith(`${labels.imageLoadError}: ${name}`);
                    }}
                  />
                ))
                : null}
            </div>

            <div className="sc-answer">
              <span className="sc-check" aria-label={labels.answerLabel}>
                ✓
              </span>
              <span className="sc-final">{formatMathText(card.final_answer) || labels.finalAnswerUnavailable}</span>
              {card.elapsed_seconds ? <span className="problem-elapsed">{`${card.elapsed_seconds.toFixed(1)}s`}</span> : null}
            </div>

            {hasDetails ? (
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
            <div className="problem-card-actions solved-actions">
              <button type="button" disabled={retryDisabled} onClick={() => onRetryProblem(card.id)}>
                {labels.retryProblem}
              </button>
              <button type="button" onClick={() => onReportWrongAnswer(card.id)}>
                {labels.reportWrongAnswer}
              </button>
            </div>
            {reportMessages[card.id] ? <p className="problem-report-note solved-report-note">{reportMessages[card.id]}</p> : null}
          </article>
        );
      })}
    </section>
  );
}
