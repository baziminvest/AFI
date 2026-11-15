import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "./workspace";
import { PageTitle } from "./shell";

export function AccountView() {
  const { user, profile, cache } = useWorkspace();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setName(profile.data?.display_name ?? ""); }, [profile.data]);
  return <><PageTitle title="Your account" subtitle="Your personal research identity."/>
    {!user ? <div className="workspace-empty"><UserRound/><h2>Sign in to your account</h2><Button asChild className="mt-6"><Link to="/auth">Sign in</Link></Button></div> :
    <form className="account-form" onSubmit={async e => {
      e.preventDefault(); setBusy(true); setMessage("");
      try {
        const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: name.trim(), updated_at: new Date().toISOString() });
        if (error) throw error;
        await cache.invalidateQueries({ queryKey: ["afi-private", "profile", user.id] });
        setMessage("Your profile has been saved.");
      } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save your profile."); }
      finally { setBusy(false); }
    }}>
      <div className="account-identity"><div className="avatar">{(name || "A").slice(0, 1).toUpperCase()}</div><div><h2>Research profile</h2><p className="subtitle">Private to your account</p></div></div>
      <div className="form-field"><label htmlFor="profile-name">Display name</label><input id="profile-name" maxLength={80} value={name} onChange={e => setName(e.target.value)} autoComplete="name"/></div>
      <div className="form-field"><label htmlFor="profile-email">Email address</label><input id="profile-email" value={user.email ?? ""} readOnly/></div>
      {profile.error && <p role="alert" className="error">Your profile could not be loaded. Please try again.</p>}
      <Button disabled={busy || profile.isLoading} type="submit"><Save size={15}/>{busy ? "Saving…" : "Save profile"}</Button>
      <p role="status">{message}</p>
    </form>}
  </>;
}