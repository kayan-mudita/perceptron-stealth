"use client";

import Link from "next/link";
import {
  Sparkles,
  Play,
  ArrowRight,
  Camera,
  Mic,
  Video,
  Shield,
  Brain,
  Clock,
  CalendarDays,
  MessageSquare,
  User,
  Star,
  Home,
  Scale,
  Stethoscope,
  Users,
  ChevronDown,
  Check,
  Cpu,
  Zap,
  Eye,
  Heart,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// FAQ data
const faqs = [
  { q: "How does Official AI keep my data and content safe?", a: "Your data is encrypted end-to-end and stored securely. We never share your photos, voice recordings, or generated content with third parties. You retain full ownership of all content, and we comply with GDPR and CCPA." },
  { q: "Is this ethical? How do you ensure responsible AI use?", a: "Official AI operates on a strict consent-based model. Nothing is ever published without your explicit approval. All generated content embeds C2PA provenance metadata for transparency. We never reuse, sell, or train on your data." },
  { q: "How quickly will I see ROI?", a: "Most clients see measurable engagement increases within 2-4 weeks. On average, our users experience a 60x increase in views, 10x in likes, and 8x in shares. The 10-15 hours/week you save delivers immediate value." },
  { q: "What does Official AI cost?", a: "Plans start at $79/month for Professional. We offer a free trial so you can experience the platform risk-free. Book a demo for a personalized quote." },
  { q: "How much time do I need to invest?", a: "Initial setup takes about 15 minutes. After that, you'll spend roughly 5 minutes per week reviewing and approving content — compared to the 10-15+ hours traditional content creation requires." },
  { q: "Will the AI voice actually sound like me?", a: "Yes. Kling 2.6 and Seedance 2.0 replicate your unique vocal characteristics — tone, pacing, inflection. The more samples you provide, the more authentic it becomes." },
  { q: "Can I approve content before it's published?", a: "Absolutely. Every piece of content goes through your approval queue before publishing. You have full editorial control and can request adjustments to any video." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060911]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold">Official <span className="gradient-text">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#models" className="hover:text-white transition-colors">AI Models</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-white/50 hover:text-white transition-colors">Log In</Link>
            <Link href="/auth/signup" className="btn-primary !py-2 !px-5 text-sm">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500 filter blur-[150px] opacity-[0.08]" />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600 filter blur-[150px] opacity-[0.08]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/60">Powered by Kling 2.6 & Seedance 2.0</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
            Transform your<br />
            <span className="gradient-text">social media</span> with<br />
            AI video content
          </h1>

          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-12">
            Official AI creates weekly content using your face and voice, powered by your AI teammate — no filming or editing required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup" className="btn-primary gap-2 text-lg !px-8 !py-4">
              Start your free trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="btn-secondary gap-2 text-lg !px-8 !py-4">
              <Play className="w-5 h-5" /> Watch the demo
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/30">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> Consent-based</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> Videos in minutes</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> No filming required</span>
          </div>

          {/* Dashboard preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden glass-card glow-effect p-1">
              <div className="rounded-xl bg-[#0a0e17] overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <div className="ml-3 flex-1 h-6 rounded-md bg-white/5 max-w-xs" />
                </div>
                <div className="p-6 grid grid-cols-3 gap-4">
                  {[
                    { title: "Market Update", model: "Kling 2.6", status: "Published", color: "from-blue-500/20 to-cyan-500/20" },
                    { title: "Client Testimonial", model: "Seedance 2.0", status: "In Review", color: "from-purple-500/20 to-pink-500/20" },
                    { title: "Property Tour", model: "Kling 2.6", status: "Scheduled", color: "from-green-500/20 to-emerald-500/20" },
                  ].map((v, i) => (
                    <div key={i} className="rounded-xl border border-white/5 overflow-hidden">
                      <div className={`aspect-video bg-gradient-to-br ${v.color} flex items-center justify-center`}>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-medium">{v.title}</div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-white/30">{v.model}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5">{v.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4 block">How It Works</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Create content <span className="gradient-text">in seconds</span></h2>
            <p className="text-white/40">Three simple steps — no cameras, no editing, no production team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, num: "01", title: "Upload your photos", desc: "Upload 5-10 photos from your phone. Our AI uses these to create lifelike video content that looks exactly like you.", color: "bg-blue-500/10", iconColor: "text-blue-400" },
              { icon: Mic, num: "02", title: "Record your voice", desc: "Record a short voice sample. The AI learns your unique vocal patterns, tone, and speaking style for authentic delivery.", color: "bg-purple-500/10", iconColor: "text-purple-400" },
              { icon: Video, num: "03", title: "AI generates videos", desc: "Kling 2.6 and Seedance 2.0 combine your photo and voice to generate stunning video content ready for social media.", color: "bg-green-500/10", iconColor: "text-green-400" },
            ].map((step, i) => (
              <div key={i} className="glass-card p-7 relative">
                <span className="text-5xl font-black text-white/[0.03] absolute top-3 right-4">{step.num}</span>
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-5`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models */}
      <section id="models" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-purple-400 mb-4 block">Our Technology</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Powered by <span className="gradient-text">cutting-edge AI</span></h2>
            <p className="text-white/40">Two state-of-the-art models for unmatched quality and creative versatility.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { name: "Kling 2.6", tagline: "Hyper-Realistic Generation", desc: "Photorealistic video with natural movements, frame-perfect lip-sync, and lifelike expressions.", icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10", features: ["4K photorealistic output", "Advanced lip-sync", "Natural human motion", "Best for: testimonials, professional"] },
              { name: "Seedance 2.0", tagline: "Creative & Dynamic", desc: "Stylized video with dynamic transitions, creative effects, and brand-consistent visual storytelling.", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", features: ["Multiple visual styles", "Dynamic transitions", "Social-optimized", "Best for: reels, trending content"] },
            ].map((model, i) => (
              <div key={i} className="glass-card p-8">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${model.bg} mb-5`}>
                  <model.icon className={`w-4 h-4 ${model.color}`} />
                  <span className="text-sm font-semibold">{model.name}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{model.tagline}</h3>
                <p className="text-white/40 mb-6">{model.desc}</p>
                <ul className="space-y-2">
                  {model.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/50">
                      <Check className={`w-4 h-4 ${model.color}`} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-4 block">Results</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Results that <span className="gradient-text">speak volumes</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "90%", label: "Faster video production", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
              { value: "60x", label: "Increase in views", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10" },
              { value: "10x", label: "Increase in likes", icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10" },
              { value: "8x", label: "Increase in shares", icon: Share2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-green-400 mb-4 block">Why Official AI</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Everything you need to <span className="gradient-text">scale your brand</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: User, title: "Authentic Personal Presence", desc: "Every video features your actual face, voice, and personality." },
              { icon: CalendarDays, title: "Weekly Content", desc: "Fresh video content delivered weekly, optimized for each platform." },
              { icon: MessageSquare, title: "Google Review Videos", desc: "Transform reviews into compelling video testimonials automatically." },
              { icon: Shield, title: "Consent-Based Control", desc: "Nothing publishes without your explicit approval." },
              { icon: Brain, title: "Brand Voice Learning", desc: "AI learns your communication style and improves over time." },
              { icon: Clock, title: "Automated Scheduling", desc: "Content auto-posts at optimal times across all channels." },
            ].map((f, i) => (
              <div key={i} className="glass-card p-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white/50" />
                </div>
                <h3 className="font-bold mb-1.5">{f.title}</h3>
                <p className="text-sm text-white/40">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-10">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xl sm:text-2xl text-white/80 leading-relaxed mb-8">
              &ldquo;It&apos;s like having a marketing team in my pocket. Official AI saves me thousands of dollars and hours every week.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">RR</div>
              <div className="text-left">
                <div className="font-semibold">Ryan Rockwell</div>
                <div className="text-sm text-white/40">Seattle Real Estate Broker · 28+ years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-orange-400 mb-4 block">Industries</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Who is Official AI <span className="gradient-text">for?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Home, title: "Real Estate", desc: "Showcase properties and build trust as the local expert.", stat: "3x listing inquiries", color: "bg-blue-500/10", iconColor: "text-blue-400" },
              { icon: Scale, title: "Attorneys", desc: "Educate clients and build your legal reputation online.", stat: "5x consultations", color: "bg-purple-500/10", iconColor: "text-purple-400" },
              { icon: Stethoscope, title: "Medical", desc: "Share health tips and establish thought leadership.", stat: "4x patient engagement", color: "bg-green-500/10", iconColor: "text-green-400" },
              { icon: Users, title: "Creators", desc: "Scale your personal brand across every platform.", stat: "10x social growth", color: "bg-orange-500/10", iconColor: "text-orange-400" },
            ].map((ind, i) => (
              <div key={i} className="glass-card p-6">
                <div className={`w-12 h-12 rounded-xl ${ind.color} flex items-center justify-center mb-4`}>
                  <ind.icon className={`w-6 h-6 ${ind.iconColor}`} />
                </div>
                <h3 className="font-bold mb-2">{ind.title}</h3>
                <p className="text-sm text-white/40 mb-3">{ind.desc}</p>
                <span className="text-xs font-semibold gradient-text">{ind.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Look professional for <span className="gradient-text">10x less</span>
            </h2>
            <p className="text-white/40">Start your free trial today. No setup fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Professional", price: "$79", orig: "$99", trial: "14-day free trial", features: ["3 AI video clips/month", "Voice cloning", "500 AI images", "Review-to-video testimonials", "80% savings vs agencies"], popular: false },
              { name: "Authority", price: "$199", orig: "$375", trial: "21-day free trial", features: ["8 AI video clips/month", "1,500 AI images", "Up to 10 team members", "3x more testimonials", "Content strategy"], popular: true },
              { name: "Expert", price: "$375", orig: "$500", trial: "30-day free trial", features: ["40+ AI video clips/month", "Dedicated AI strategist", "Monthly content calendar", "Competitor research", "Replaces $2-10K/mo agency"], popular: false },
            ].map((plan, i) => (
              <div key={i} className={`glass-card p-6 relative ${plan.popular ? "border-blue-500/30 bg-blue-500/5" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-[10px] font-semibold">Popular</div>
                )}
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-white/30">/mo</span>
                  <span className="text-sm text-white/20 line-through">{plan.orig}</span>
                </div>
                <div className="text-xs text-green-400 mt-1">{plan.trial}</div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/50">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className={`mt-6 w-full gap-2 text-sm block text-center ${plan.popular ? "btn-primary" : "btn-secondary"}`}>
                  Start your free trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Frequently asked <span className="gradient-text">questions</span></h2>
          </div>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5">
                <button className="w-full flex items-center justify-between py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-semibold pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="text-sm text-white/40 leading-relaxed pb-5">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[150px] opacity-10" />
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 relative z-10">
              Ready to scale <span className="gradient-text">your brand?</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto mb-8 relative z-10">
              Join thousands of professionals transforming their social media with AI-powered video content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/auth/signup" className="btn-primary gap-2 text-lg !px-8 !py-4">Start your free trial <ArrowRight className="w-5 h-5" /></Link>
            </div>
            <p className="text-xs text-white/20 mt-4 relative z-10">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold">Official <span className="gradient-text">AI</span></span>
            </div>
            <div className="flex gap-6 text-xs text-white/30">
              <a href="#" className="hover:text-white/50">About</a>
              <a href="#" className="hover:text-white/50">Blog</a>
              <a href="#" className="hover:text-white/50">Contact</a>
              <a href="#" className="hover:text-white/50">Terms</a>
              <a href="#" className="hover:text-white/50">Privacy</a>
            </div>
            <p className="text-xs text-white/20">&copy; 2026 Official AI. Powered by Kling 2.6 & Seedance 2.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
