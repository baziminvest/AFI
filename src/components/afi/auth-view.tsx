import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Brand } from "./shell";
import city from "@/assets/financial-city.jpg";
import { isRecoveryLink } from "@/lib/afi/account";
import "@lovable.dev/cloud-auth-js/styles.css";
export function AuthView() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "reset") {
        const r = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (r.error) throw r.error;
        setMessage("Check your email for the password reset link.");
      } else if (mode === "signup") {
        const r = await supabase.auth.signUp({
          email,
          password,
           options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } },
        });
        if (r.error) throw r.error;
         if (r.data.session) await navigate({ to: "/overview" });
        else setMessage("Check your email to confirm your research account.");
      } else {
        const r = await supabase.auth.signInWithPassword({ email, password });
        if (r.error) throw r.error;
         await navigate({ to: "/overview" });
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sign-in could not complete.");
    } finally {
      setBusy(false);
    }
  }
  async function social(provider: "google" | "lovable") {
    setMessage("");
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (result.error) setMessage(result.error.message);
      else if (!result.redirected) await navigate({ to: "/overview" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sign-in could not complete."); }
    finally { setBusy(false); }
  }
  return (
    <div className="auth-screen">
      <img src={city} alt="Singapore financial district at dusk" width={1920} height={1024} className="auth-city"/>
      <div className="auth-panel">
        <Link to="/" aria-label="AFI home"><Brand /></Link>
        <h1>
          {mode === "signup"
            ? "Create your research account"
            : mode === "reset"
              ? "Reset your password"
              : "Welcome back."}
        </h1>
        <p className="subtitle text-center">Your perspective. Your research. Your AFI.</p>
        {mode !== "reset" && (
          <div className="auth-social">
            <Button disabled={busy} variant="outline" className="google-button" onClick={() => social("google")}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              Continue with Google
            </Button>
            <Button disabled={busy} variant="outline" onClick={() => social("lovable")}>
              Continue with Lovable
            </Button>
          </div>
        )}
        <div className="auth-divider">
          {mode === "reset" ? "EMAIL RECOVERY" : "OR CONTINUE WITH EMAIL"}
        </div>
        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && <div className="form-field"><label htmlFor="auth-name">Display name</label><input id="auth-name" autoComplete="name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></div>}
          <div className="form-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {mode !== "reset" && (
            <div className="form-field">
              <label htmlFor="auth-password">Password</label>
              <div className="password-field"><input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff/> : <Eye/>}</Button></div>
            </div>
          )}
          <Button disabled={busy} type="submit">
            {busy ? "Please wait…" : mode === "signup"
              ? "Create account"
              : mode === "reset"
                ? "Send reset link"
                : "Sign in"}
            <ArrowRight />
          </Button>
          {message && (
            <p role="status" className="mini-sub">
              {message}
            </p>
          )}
        </form>
        <div className="mt-4 flex justify-center flex-wrap">
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setMessage("");
            }}
          >
            {mode === "signup" ? "Already have an account? Sign in" : "Create an account"}
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setMode(mode === "reset" ? "login" : "reset");
              setMessage("");
            }}
          >
            {mode === "reset" ? "Back to sign in" : "Forgot password?"}
          </Button>
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="section-link justify-center">
            Return to AFI
            <ArrowRight size={12} />
          </Link>
        </div>
        <p className="auth-trust"><ShieldCheck size={12}/> Private account · Research only</p>
      </div>
    </div>
  );
}
export function ResetPasswordView() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const recovery = isRecoveryLink(window.location.hash);
    if (!recovery) { setMessage("Open the password recovery link from your email to continue."); return; }
    supabase.auth.getUser().then(({ data, error }) => {
      setAllowed(Boolean(data.user) && !error);
      if (!data.user || error) setMessage("This recovery link is invalid or expired. Request a new link.");
    });
  }, []);
  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <Brand />
        <h1>Choose a new password</h1>
        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!allowed || busy) return;
            setBusy(true);
            try {
              const { error } = await supabase.auth.updateUser({ password });
              setMessage(error?.message ?? "Password updated. You can return to your workspace.");
              if (!error) setAllowed(false);
            } catch { setMessage("Your password could not be updated. Please try again."); }
            finally { setBusy(false); }
          }}
        >
          <input
            aria-label="New password"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" disabled={!allowed || busy}>
            <LockKeyhole />
            {busy ? "Updating…" : "Update password"}
          </Button>
          <p role="status" className="mini-sub">
            {message}
          </p>
          <Button variant="link" asChild>
            <Link to="/">
              Return to overview
              <ArrowRight />
            </Link>
          </Button>
        </form>
      </div>
    </div>
  );
}
