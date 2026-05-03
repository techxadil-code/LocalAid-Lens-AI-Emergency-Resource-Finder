import { NavBar } from "@/components/nav-bar";
import { UploadZone } from "@/components/upload-zone";
import { Zap, Shield, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-[150px]" />
      </div>

      <NavBar />

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 md:py-28 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-medium text-violet-500 mb-6">
            <Sparkles className="size-3.5" />
            AI-Powered Emergency Response
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Turn{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Screenshots
            </span>{" "}
            into{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Action
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload emergency screenshots from WhatsApp or Twitter. Our AI instantly extracts critical information and creates actionable cards for volunteers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link href="/dashboard" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 transition-all">
              Open Dashboard <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left mb-16">
            {[
              { icon: Zap, title: "Instant AI", desc: "Gemini extracts data in seconds", color: "violet" },
              { icon: Shield, title: "Auto-Verify", desc: "Smart validation flags missing info", color: "blue" },
              { icon: Clock, title: "Real-time", desc: "Live updates for all volunteers", color: "indigo" },
              { icon: Users, title: "Coordinate", desc: "Assign & track emergency responses", color: "purple" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:border-violet-500/30 transition-colors">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                  <feature.icon className="size-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upload Section */}
        <section id="upload-section" className="max-w-2xl mx-auto pb-20">
          <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-xl shadow-black/5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Submit an Emergency</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a screenshot or paste text from an emergency message
              </p>
            </div>
            <UploadZone />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Zap className="size-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Offbeat</span>
          </div>
          <p className="text-xs text-muted-foreground">Emergency Response Platform</p>
        </div>
      </footer>
    </div>
  );
}
