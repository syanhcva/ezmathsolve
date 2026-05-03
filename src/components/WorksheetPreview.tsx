import { inputImageUrl } from "../api";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { ChromeLabels, WorksheetRun } from "../types";

type Props = {
  run: WorksheetRun | null;
  labels: ChromeLabels;
  collapsed: boolean;
  width: number;
  showReadAction: boolean;
  readDisabled: boolean;
  uploadPending: boolean;
  readQueued: boolean;
  onToggleCollapsed: () => void;
  onReadWorksheet: () => void;
  onWidthChange: (width: number) => void;
};

export function WorksheetPreview({ run, labels, collapsed, width, showReadAction, readDisabled, uploadPending, readQueued, onToggleCollapsed, onReadWorksheet, onWidthChange }: Props) {
  const reviewMode = Boolean(run && (run.problems.length || run.solutions.length));
  const imageOutcomes = new Map();
  for (const outcome of run?.image_outcomes || []) {
    if (!imageOutcomes.has(outcome.worksheet_input_id)) imageOutcomes.set(outcome.worksheet_input_id, outcome);
  }

  if (!run) return null;

  function startResize(event: ReactMouseEvent<HTMLDivElement>) {
    const startX = event.clientX;
    const startWidth = width;

    function handleMove(moveEvent: MouseEvent) {
      onWidthChange(Math.max(280, Math.min(820, startWidth + moveEvent.clientX - startX)));
    }

    function stopResize() {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", stopResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    event.preventDefault();
  }

  return (
    <section className={`worksheet-panel ${reviewMode ? "review-mode" : ""} ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? undefined : width }}>
      {collapsed ? (
        <div className="worksheet-panel-rail">
          <button type="button" className="worksheet-rail-expand" onClick={onToggleCollapsed} title={labels.showOriginalImage}>
            &rsaquo;
          </button>
        </div>
      ) : null}
      {reviewMode ? <div className="worksheet-panel-header">
        {reviewMode ? (
          <button type="button" className="worksheet-toggle" onClick={onToggleCollapsed} title={labels.hideOriginalImage}>
            &lt;
          </button>
        ) : null}
      </div> : null}
      {!collapsed && showReadAction ? (
        <div className="worksheet-read-action">
          <button type="button" className="btn-read-inline" disabled={readDisabled} onClick={onReadWorksheet}>
            {labels.readWorksheet}
          </button>
        </div>
      ) : null}
      {!collapsed && (uploadPending || readQueued) ? (
        <div className="worksheet-upload-status" role="status">
          <div className="upload-progress-track">
            <div className="upload-progress-fill" />
          </div>
          <span>{readQueued ? labels.uploadReadQueued : labels.uploadProgress}</span>
        </div>
      ) : null}
      {!run.input_url && !run.inputs.length ? (
        <div className="worksheet-placeholder">
          <svg className="worksheet-placeholder-svg" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="16" y="10" width="44" height="56" rx="4" fill="#D4E8FF" stroke="#8AB2E0" strokeWidth="1.5" />
            <line x1="24" y1="26" x2="52" y2="26" stroke="#8AB2E0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="34" x2="52" y2="34" stroke="#8AB2E0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="42" x2="44" y2="42" stroke="#8AB2E0" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="24" y="50" width="12" height="8" rx="2" fill="#B8D0EF" />
            <line x1="24" y1="18" x2="36" y2="18" stroke="#3B82D4" strokeWidth="2" strokeLinecap="round" />
            <g transform="translate(44 42) rotate(-35)">
              <rect x="-3" y="-18" width="6" height="22" rx="1.5" fill="#F5A623" />
              <polygon points="-3,4 3,4 0,10" fill="#F5E6CC" />
              <polygon points="-1,8 1,8 0,10" fill="#2A1A0A" />
              <rect x="-3" y="-20" width="6" height="4" rx="1" fill="#E07820" />
              <rect x="-3" y="-22" width="6" height="3" rx="1" fill="#C0C0C0" />
            </g>
          </svg>
          <span>{labels.worksheetPlaceholder}</span>
        </div>
      ) : (
        <div className="worksheet-image-list">
          {(run.inputs.length ? run.inputs : [{ input_id: "single", position: 1, image_url: run.input_url || "", original_filename: labels.uploadedWorksheetAlt }]).map((item) => (
            <figure className="worksheet-image-item" key={item.input_id}>
              {item.image_url ? (
                <img
                  className="worksheet-image"
                  src={inputImageUrl(item.image_url)}
                  alt={item.original_filename || labels.uploadedWorksheetAlt}
                  onError={(event) => {
                    event.currentTarget.replaceWith("Worksheet image could not be loaded.");
                  }}
                />
              ) : (
                <div className="worksheet-placeholder worksheet-file-placeholder">
                  <span>{item.original_filename || labels.uploadedWorksheetAlt}</span>
                  <span>{labels.worksheetFileNotPreviewed}</span>
                </div>
              )}
              {imageOutcomes.has(item.input_id) ? (
                <figcaption className={`image-outcome ${imageOutcomes.get(item.input_id)?.status}`}>
                  {`${labels.imageStatus} ${item.position}: ${imageOutcomes.get(item.input_id)?.status}`}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      )}
      {reviewMode && !collapsed ? <div className="worksheet-resize-handle" onMouseDown={startResize} /> : null}
    </section>
  );
}
