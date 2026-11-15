import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Globe2, ShieldCheck, ChartNoAxesCombined, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./shell";
import { useWorkspace } from "./workspace";
import city from "@/assets/financial-city.jpg";

export function FrontPage() {
  const { user, profile } = useWorkspace();
  return <div className="front-page">
    <header className="front-nav"><Link to="/" aria-label="AFI home"><Brand /></Link>
      <nav aria-label="Main navigation"><Link to="/overview">Research workspace</Link><Link to="/markets">Markets</Link>
        <Button variant="outline" asChild><Link to={user ? "/account" : "/auth"}>{user ? profile.data?.display_name || "My account" : "Sign in"}<ArrowUpRight size={14}/></Link></Button>
      </nav>
    </header>
    <section className="front-hero">
      <img src={city} width={1920} height={1024} alt="Singapore's financial district across Marina Bay at dusk" className="front-city" fetchPriority="high"/>
      <div className="front-hero-shade"/>
      <div className="front-hero-copy">
        <div className="front-eyebrow"><span/> A CLEARER PERSPECTIVE ON MARKETS</div>
        <h1>Adaptive Financial<br/><span>Intelligence.</span></h1>
        <p className="front-tagline">Intelligence for Better Investment Decisions.</p>
        <p className="front-description">A disciplined approach to market research.<br/>Evidence first. Risk always. Decisions with conviction.</p>
        <div className="front-actions"><Button size="lg" asChild><Link to={user ? "/overview" : "/auth"}>{user ? "Open my workspace" : "Get started"}<ArrowRight size={17}/></Link></Button><Button size="lg" variant="ghost" asChild><Link to="/overview">Explore research<ArrowUpRight size={17}/></Link></Button></div>
        <div className="front-safety"><ShieldCheck size={14}/> Research only. No live trade execution.</div>
      </div>
      <div className="front-caption"><Globe2 size={15}/><span>GLOBAL PERSPECTIVE</span><span>Singapore · 1.3521° N, 103.8198° E</span></div>
    </section>
    <section className="front-principles"><div className="front-principles-heading"><span className="front-eyebrow">THE AFI APPROACH</span><h2>Less noise.<br/>More understanding.</h2></div>
      <Link to="/markets" className="front-principle"><ChartNoAxesCombined/><h3>Observe the market</h3><p>Forex and Gold research grounded in historical market observations.</p><span>Global markets <ArrowUpRight size={14}/></span></Link>
      <Link to="/intelligence" className="front-principle"><BrainCircuit/><h3>Understand the evidence</h3><p>Research, model evaluation and transparent data provenance.</p><span>Research intelligence <ArrowUpRight size={14}/></span></Link>
      <Link to="/risk-management" className="front-principle"><ShieldCheck/><h3>Keep risk in focus</h3><p>Position sizing and disciplined limits before any investment decision.</p><span>Risk management <ArrowUpRight size={14}/></span></Link>
    </section>
    <footer className="front-footer"><span>© AFI · Adaptive Financial Intelligence</span><span>Research, not investment advice.</span><Link to="/overview">Enter workspace <ArrowRight size={13}/></Link></footer>
  </div>;
}