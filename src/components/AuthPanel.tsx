import { FormEvent, useState } from "react";
import type { AuthBusyMode, ChromeLabels, ConnectionState, WorkspaceLanguage } from "../types";

type Props = {
  busy: AuthBusyMode;
  connection: ConnectionState;
  error: string;
  labels: ChromeLabels;
  language: WorkspaceLanguage;
  notice: string;
  onLogin: (accountIdentifier: string, password: string) => void;
  onRegister: (accountIdentifier: string, password: string, passwordConfirmation: string, displayName: string) => void;
  onGuest: () => void;
  onRequestPasswordReset: (accountIdentifier: string) => void;
  onResetPassword: (token: string, password: string, passwordConfirmation: string) => void;
  onLanguageChange: (language: WorkspaceLanguage) => void;
};

export function AuthPanel({ busy, connection, error, labels, language, notice, onLogin, onRegister, onGuest, onRequestPasswordReset, onResetPassword, onLanguageChange }: Props) {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [localError, setLocalError] = useState("");
  const disabled = Boolean(busy) || connection === "unreachable";
  const registering = mode === "register";
  const resetting = mode === "reset";
  const forgot = mode === "forgot";
  const title = registering ? labels.createTitle : forgot || resetting ? labels.resetPasswordTitle : labels.loginTitle;
  const shownError = localError || error;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError("");
    if (registering) {
      if (password !== passwordConfirmation) {
        setLocalError(labels.passwordMismatch);
        return;
      }
      onRegister(accountIdentifier, password, passwordConfirmation, displayName);
      return;
    }
    if (forgot) {
      onRequestPasswordReset(accountIdentifier);
      return;
    }
    if (resetting) {
      if (password !== passwordConfirmation) {
        setLocalError(labels.passwordMismatch);
        return;
      }
      onResetPassword(resetToken, password, passwordConfirmation);
      return;
    }
    onLogin(accountIdentifier, password);
  }

  function switchMode(nextMode: typeof mode) {
    setMode(nextMode);
    setLocalError("");
  }

  return (
    <main className="auth-app">
      <section className="auth-shell" aria-labelledby="auth-title">
        <div className="auth-brand">
          <span className="auth-brand-icon" aria-hidden="true">
            &Sigma;
          </span>
          <div>
            <p className="auth-kicker">MathSolve</p>
            <h1 id="auth-title">{title}</h1>
          </div>
        </div>

        <div className="auth-lang-switcher" aria-label="Workspace language">
          <button type="button" className={`lang-btn ${language === "vi" ? "active" : ""}`} onClick={() => onLanguageChange("vi")}>
            Vi
          </button>
          <button type="button" className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => onLanguageChange("en")}>
            En
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!resetting ? (
            <label>
              <span>{labels.account}</span>
              <input
                autoComplete="username"
                disabled={disabled}
                onChange={(event) => setAccountIdentifier(event.target.value)}
                placeholder="student@example.com"
                required
                type="text"
                value={accountIdentifier}
              />
            </label>
          ) : null}

          {registering ? (
            <label>
              <span>{labels.displayName}</span>
              <input
                autoComplete="name"
                disabled={disabled}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Student"
                type="text"
                value={displayName}
              />
            </label>
          ) : null}

          {forgot ? null : (
            <>
              {resetting ? (
                <label>
                  <span>{labels.resetToken}</span>
                  <input disabled={disabled} onChange={(event) => setResetToken(event.target.value)} placeholder={labels.resetToken} required type="text" value={resetToken} />
                </label>
              ) : null}

              <label>
                <span>{resetting ? labels.newPassword : labels.password}</span>
                <input
                  autoComplete={registering || resetting ? "new-password" : "current-password"}
                  disabled={disabled}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  required
                  type="password"
                  value={password}
                />
              </label>

              {registering || resetting ? (
                <label>
                  <span>{labels.confirmPassword}</span>
                  <input
                    autoComplete="new-password"
                    disabled={disabled}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    placeholder={labels.confirmPassword}
                    required
                    type="password"
                    value={passwordConfirmation}
                  />
                </label>
              ) : null}
            </>
          )}

          {shownError ? <p className="auth-error">{shownError}</p> : <p className="auth-note">{notice || (resetting ? labels.resetTokenNote : labels.authNote)}</p>}

          <button type="submit" className="btn-auth" disabled={disabled}>
            {busy ? "Working..." : registering ? labels.createAccount : forgot ? labels.requestReset : resetting ? labels.resetPassword : labels.signIn}
          </button>
          {mode === "login" ? (
            <>
              <button type="button" className="auth-switch" disabled={disabled || Boolean(busy)} onClick={onGuest}>
                {busy === "starting-guest" ? "Working..." : labels.continueAsGuest}
              </button>
              <p className="auth-note">{labels.guestAuthNote}</p>
            </>
          ) : null}
        </form>

        <div className="auth-switch-row">
          <button type="button" className="auth-switch" disabled={Boolean(busy)} onClick={() => switchMode(registering || forgot || resetting ? "login" : "register")}>
            {forgot || resetting ? labels.backToSignIn : registering ? labels.alreadyHaveAccount : labels.createNewAccount}
          </button>
          {mode === "login" ? (
            <button type="button" className="auth-switch" disabled={Boolean(busy)} onClick={() => switchMode("forgot")}>
              {labels.forgotPassword}
            </button>
          ) : null}
          {forgot ? (
            <button type="button" className="auth-switch" disabled={Boolean(busy)} onClick={() => switchMode("reset")}>
              {labels.resetPassword}
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
