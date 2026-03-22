"use client";

import Link from "next/link";
import { ArrowRight, Target, Lightbulb, Eye, Users } from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";

const team = [
  {
    name: "Kayan Mishra",
    role: "Co-founder & CEO",
    bio: "Previously built and scaled multiple AI products. Obsessed with making technology disappear behind great user experiences.",
  },
  {
    name: "Ben Ledwith",
    role: "Co-founder & CTO",
    bio: "Deep expertise in generative AI, video processing, and production-grade ML systems. Built AI infrastructure at scale.",
  },
  {
    name: "Alex Rivera",
    role: "Head of Product",
    bio: "Background in content strategy and social media growth. Understands what makes content perform because they have done it themselves.",
  },
  {
    name: "Jordan Kim",
    role: "Lead Engineer",
    bio: "Full-stack engineer with expertise in real-time video processing, multi-model orchestration, and platform API integrations.",
  },
];

const values = [
  {
    icon: Target,
    title: "Results over aesthetics",
    description:
      "We do not build pretty demos. We build tools that generate real views, real engagement, and real business for our users.",
  },
  {
    icon: Lightbulb,
    title: "Quality is the product",
    description:
      "If the output looks like AI-generated content, we have failed. Our bar is indistinguishable from self-shot video.",
  },
  {
    icon: Eye,
    title: "User control",
    description:
      "Nothing goes live without approval. We give professionals the tools, not the anxiety. Every video is reviewed before posting.",
  },
  {
    icon: Users,
    title: "Build for professionals",
    description:
      "We are not building for influencers. We are building for attorneys, doctors, agents, and advisors who have expertise but not time.",
  },
];

export default function AboutClient() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/3 w-[200px] h-[200px] bg-violet-500/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-4">
            About
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
            Make every professional
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              a content creator.
            </span>
          </h1>
          <p className="text-[17px] text-white/35 max-w-xl mx-auto leading-relaxed font-light">
            Official AI exists because the best experts in every field are
            invisible online. We are changing that.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                The problem
              </p>
              <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white leading-tight mb-6">
                Professionals know they need to post.
                <br />
                <span className="text-white/40">They never do.</span>
              </h2>
              <div className="space-y-4">
                <p className="text-[15px] text-white/30 leading-relaxed">
                  Every real estate agent, attorney, financial advisor, and doctor
                  knows the same thing: the professionals who post content consistently
                  get more clients. Social proof is not optional anymore. It is the
                  new word-of-mouth.
                </p>
                <p className="text-[15px] text-white/30 leading-relaxed">
                  But filming content takes time they do not have. Hiring a video
                  team costs $5,000 a month. And the polished corporate videos that
                  agencies produce do not even perform well — audiences scroll right
                  past them.
                </p>
                <p className="text-[15px] text-white/30 leading-relaxed">
                  So the best experts in every field stay invisible. Their
                  competitors who happen to be comfortable on camera dominate every
                  feed. Expertise does not equal visibility. Until now.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  stat: "73%",
                  text: "of professionals say they should post more content online",
                },
                {
                  stat: "91%",
                  text: "cite lack of time as the primary reason they do not post",
                },
                {
                  stat: "4x",
                  text: "more leads for professionals who post content weekly",
                },
                {
                  stat: "$60K+",
                  text: "average annual cost of a video production team",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.015] flex items-start gap-4"
                >
                  <span className="text-[24px] font-bold text-white flex-shrink-0 w-16">
                    {item.stat}
                  </span>
                  <p className="text-[13px] text-white/30 leading-relaxed pt-1.5">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
            The insight
          </p>
          <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white leading-tight mb-8">
            The best content looks like it was
            <br />
            <span className="text-white/40">shot on an iPhone in 30 seconds.</span>
          </h2>

          <div className="space-y-6">
            <p className="text-[16px] text-white/30 leading-relaxed">
              The content that performs best on social media is not the polished
              corporate video with three cameras and a lighting rig. It is the raw,
              face-to-camera UGC — a professional looking into their phone and
              sharing something useful.
            </p>
            <p className="text-[16px] text-white/30 leading-relaxed">
              That is the content that feels authentic. That is what people engage
              with. That is what drives consultations, appointments, and deals.
            </p>
            <p className="text-[16px] text-white/30 leading-relaxed">
              Our entire technology stack is built around one goal: creating AI
              content that is indistinguishable from self-shot iPhone video. Not
              polished. Not overproduced. Real. Raw. Effective.
            </p>
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[14px] font-medium text-white/50 mb-2">
                  What agencies produce
                </h3>
                <ul className="space-y-2">
                  {[
                    "Overproduced and polished",
                    "Feels like an ad",
                    "Low engagement rates",
                    "$5,000+/month",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-[13px] text-white/20"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-white/50 mb-2">
                  What Official AI produces
                </h3>
                <ul className="space-y-2">
                  {[
                    "Raw, face-to-camera UGC style",
                    "Feels like you shot it yourself",
                    "High engagement rates",
                    "Starting at $79/month",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-[13px] text-white/40"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Approach */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              Our approach
            </p>
            <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white leading-tight">
              AI that creates content
              <br />
              <span className="text-white/40">
                indistinguishable from self-shot video.
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-[15px] text-white/30 leading-relaxed max-w-2xl">
              Most AI video tools generate a single continuous shot from a prompt.
              The result looks artificial because real video is not a single shot —
              it is composed of multiple cuts, angles, and edits.
            </p>
            <p className="text-[15px] text-white/30 leading-relaxed max-w-2xl">
              Official AI uses multi-cut composition. Every video is 3-8 separate
              clips, each generated from a composed starting frame, then stitched
              together with professional editing — hooks, transitions, B-roll, and
              CTAs. The result looks like it was shot and edited by a real
              production team.
            </p>
            <p className="text-[15px] text-white/30 leading-relaxed max-w-2xl">
              Combined with character sheets for visual consistency and voice cloning
              for audio authenticity, the output is content that looks and sounds
              exactly like you — because the AI was trained specifically on you.
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-[14px] text-blue-400/70 hover:text-blue-400 transition-colors font-medium"
            >
              See the full technical breakdown
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              Values
            </p>
            <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white leading-tight">
              What we believe.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((value, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.025] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-white/[0.1] transition-colors">
                  <value.icon className="w-4 h-4 text-white/30" />
                </div>
                <h3 className="text-[15px] font-semibold text-white/80 mb-2">
                  {value.title}
                </h3>
                <p className="text-[13px] text-white/25 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              Team
            </p>
            <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white leading-tight">
              The people behind
              <br />
              <span className="text-white/40">Official AI.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] transition-all duration-300"
              >
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                  <span className="text-[14px] font-semibold text-white/30">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-white/80">
                  {member.name}
                </h3>
                <p className="text-[12px] text-blue-400/60 mb-3">{member.role}</p>
                <p className="text-[12px] text-white/20 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Join us."
        description="Start creating AI content that actually looks like you. No filming, no editing, no excuses."
        badge="We are just getting started"
      />
    </MarketingLayout>
  );
}
