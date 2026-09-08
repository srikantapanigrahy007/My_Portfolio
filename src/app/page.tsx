/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getPortfolioData } from "@/lib/api";
import { skillIconMap, getSocialIcon } from "@/lib/icon-map";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import GithubSection from "@/components/section/github-section";
import { ArrowUpRight, MailIcon, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BLUR_FADE_DELAY = 0.04;

export default async function Page() {
  const { profile, skills, experience, education, certifications, projects } =
    await getPortfolioData();

  if (!profile) return null;

  const github = profile.socials.find((s) => s.key === "GitHub");
  const linkedin = profile.socials.find((s) => s.key === "LinkedIn");
  const x = profile.socials.find((s) => s.key === "X");

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <div className="pointer-events-none absolute -inset-x-6 top-[-48px] sm:top-[-96px] h-[270px] sm:h-[318px] -z-10 grid-bg md:hidden" />
      <section id="hero">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="order-2 flex min-w-0 flex-1 flex-col gap-4 md:order-1">
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span
                  className="mr-2 inline-block animate-wave"
                  role="img"
                  aria-hidden
                >
                  👋
                </span>
                Hi, I&apos;m
              </p>
              <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-bold tracking-tight whitespace-nowrap">
                {profile.name}
              </h1>
            </div>
            <p className="flex flex-nowrap items-center gap-x-2 overflow-x-auto text-sm font-semibold text-foreground sm:text-base md:text-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0">Full Stack Developer</span>
              <span className="shrink-0 font-normal text-muted-foreground">|</span>
              <span className="animate-open-badge inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-medium sm:gap-2 sm:px-3 sm:py-1 sm:text-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span className="animate-shimmer whitespace-nowrap bg-gradient-to-r from-primary via-primary/50 to-primary bg-[length:200%_100%] bg-clip-text text-transparent">
                  Open for Opportunities
                </span>
              </span>
            </p>
            <div className="prose max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base dark:prose-invert">
              <Markdown>{profile.heroDescription}</Markdown>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground w-fit">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <MailIcon className="size-4 shrink-0" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.tel.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="size-4 shrink-0" />
                {profile.tel}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href={profile.resumeUrl} target="_blank">
                  Download Resume
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                {github && (
                  <Link
                    href={github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icons.github className="size-4" />
                  </Link>
                )}
                {linkedin && (
                  <Link
                    href={linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icons.linkedin className="size-4" />
                  </Link>
                )}
                {x && (
                  <Link
                    href={x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icons.x className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="order-1 flex shrink-0 justify-center md:order-2 md:justify-end">
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={192}
              height={192}
              priority
              className="size-40 rounded-full border border-border object-cover md:size-48"
            />
          </div>
        </div>
      </section>
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>{profile.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Professional Training and Work Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection experience={experience} />
          </BlurFade>
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          <div className="flex flex-col gap-8">
            {education.map((edu, index) => (
              <BlurFade key={edu._id} delay={BLUR_FADE_DELAY * 8 + index * 0.05}>
                <Link
                  href={edu.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-3 justify-between group"
                >
                  <div className="flex items-center gap-x-3 flex-1 min-w-0">
                    {edu.logoUrl ? (
                      <img
                        src={edu.logoUrl}
                        alt={edu.school}
                        className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                      />
                    ) : (
                      <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-semibold leading-none flex items-center gap-2">
                        {edu.school}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                      </div>
                      <div className="font-sans text-sm text-muted-foreground">
                        {edu.degree}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                    <span>
                      {edu.start} - {edu.end}
                    </span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="certifications">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 8.5}>
            <h2 className="text-xl font-bold">Certifications</h2>
          </BlurFade>
          <div className="flex flex-col gap-4">
            {certifications.map((cert, index) => (
              <BlurFade key={cert._id} delay={BLUR_FADE_DELAY * 8.7 + index * 0.05}>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold leading-none">{cert.name}</span>
                  </div>
                  <div className="mt-1 font-sans text-sm text-muted-foreground">
                    {cert.issuer}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {cert.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, id) => (
              <BlurFade key={skill._id} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                  {skillIconMap[skill.icon] && (
                    <FontAwesomeIcon
                      icon={skillIconMap[skill.icon]}
                      className="size-4 rounded overflow-hidden object-contain"
                    />
                  )}
                  <span className="text-foreground text-sm font-medium">{skill.name}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="projects">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ProjectsSection projects={projects} />
        </BlurFade>
      </section>
      <section id="github">
        <BlurFade delay={BLUR_FADE_DELAY * 13}>
          <GithubSection githubUrl={github?.url || ""} />
        </BlurFade>
      </section>
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
