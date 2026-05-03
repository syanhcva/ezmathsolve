import type { ChromeLabels } from "../types";

type Props = {
  hidden: boolean;
  labels: ChromeLabels;
  uploading: boolean;
  onUpload: (files: File[]) => void;
};

export function UploadPanel({ hidden, labels, uploading, onUpload }: Props) {
  if (hidden) return null;

  function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList || []);
    if (files.length) onUpload(files);
  }

  return (
    <section className="upload-zone">
      <div className="upload-drop">
        <span className="upload-icon" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="28" fill="#FFF4E0" />
            <rect x="16" y="14" width="24" height="30" rx="3" fill="white" stroke="#F5A623" strokeWidth="1.5" />
            <line x1="20" y1="22" x2="36" y2="22" stroke="#B8D0EF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="27" x2="36" y2="27" stroke="#B8D0EF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="32" x2="30" y2="32" stroke="#B8D0EF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="36" cy="36" r="10" fill="#F5A623" />
            <path d="M36 31.5V40.5M31.5 36L36 31.5L40.5 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="upload-heading">{labels.uploadHeading}</span>
        <span className="upload-sub">{labels.uploadSub}</span>
        <span className="upload-actions">
          <label className="upload-action">
            <input
              className="visually-hidden"
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              multiple
              onChange={(event) => {
                handleFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
            {labels.chooseFile}
          </label>
          <label className="upload-action secondary">
            <input
              className="visually-hidden"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
            {labels.takePhoto}
          </label>
        </span>
        {uploading ? (
          <div className="upload-progress" role="status">
            <div className="upload-progress-track">
              <div className="upload-progress-fill" />
            </div>
            <span>{labels.uploadProgress}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
