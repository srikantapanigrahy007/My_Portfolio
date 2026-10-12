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
import SectionHeading from "@/components/section-heading";
import { ArrowUpRight, Download, MailIcon, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BLUR_FADE_DELAY = 0.04;

const socialLinkClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors duration-200 hover:border-foreground/25 hover:text-foreground";

export default async function Page() {
  const { profile, skills, experience, education, certifications, projects } =
    await getPortfolioData();

  if (!profile) return null;

  const github = profile.socials.find((s) => s.key === "GitHub");
  const linkedin = profile.socials.find((s) => s.key === "LinkedIn");
  const x = profile.socials.find((s) => s.key === "X");

  return (
    <main className="relative flex min-h-dvh flex-col gap-20 sm:gap-24">
      <div className="pointer-events-none absolute -inset-x-6 top-[-48px] sm:top-[-80px] h-[270px] sm:h-[318px] -z-10 grid-bg md:hidden" />
      <section id="hero">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 lg:gap-20">
          <div className="order-2 min-w-0 md:order-1">
            <BlurFade delay={0}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <p className="text-lg font-medium text-muted-foreground sm:text-xl">
                    <span
                      className="mr-2 inline-block animate-wave"
                      role="img"
                      aria-hidden
                    >
                      👋
                    </span>
                    Hi, I&apos;m
                  </p>
                  <h1 className="text-balance text-[clamp(2.25rem,6.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                    {profile.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-base font-medium text-foreground sm:text-lg">
                    Full Stack Developer
                  </span>
                  <span className="hidden h-4 w-px bg-input sm:block" aria-hidden />
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:text-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    </span>
                    Open for Opportunities
                  </span>
                </div>
                <div className="prose max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg dark:prose-invert">
                  <Markdown>{profile.heroDescription}</Markdown>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex w-fit min-w-0 items-center gap-2 rounded-sm break-all transition-colors hover:text-foreground"
                  >
                    <MailIcon className="size-4 shrink-0" aria-hidden />
                    {profile.email}
                  </a>
                  <a
                    href={`tel:${profile.tel.replace(/\s+/g, "")}`}
                    className="inline-flex w-fit items-center gap-2 rounded-sm transition-colors hover:text-foreground"
                  >
                    <Phone className="size-4 shrink-0" aria-hidden />
                    {profile.tel}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button asChild size="lg">
                    <Link href={profile.resumeUrl} target="_blank">
                      <Download className="size-4" aria-hidden />
                      Download Resume
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="#contact">Get in Touch</a>
                  </Button>
                  <div className="flex items-center gap-2 sm:ml-2">
                    {github && (
                      <Link
                        href={github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className={socialLinkClass}
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
                        className={socialLinkClass}
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
                        className={socialLinkClass}
                      >
                        <Icons.x className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
          <div className="order-1 flex md:order-2 md:justify-end">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="relative mb-2.5 mr-2.5 md:mb-4 md:mr-4">
                <div
                  className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl border border-primary/30 bg-accent md:translate-x-4 md:translate-y-4"
                  aria-hidden
                />
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={320}
                  height={320}
                  priority
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 256px, 160px"
                  className="relative size-32 rounded-2xl border border-border object-cover shadow-card-hover sm:size-40 md:size-64 lg:size-80"
                />
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about" className="flex flex-col gap-6 sm:gap-8">
        <BlurFade inView delay={0}>
          <SectionHeading title="About" />
        </BlurFade>
        <BlurFade inView delay={BLUR_FADE_DELAY}>
          <div className="surface p-6 sm:p-8">
            <div className="prose max-w-3xl text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>{profile.summary}</Markdown>
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="work" className="flex flex-col gap-6 sm:gap-8">
        <BlurFade inView delay={0}>
          <SectionHeading title="Professional Training and Work Experience" />
        </BlurFade>
        {experience.length > 0 && (
          <BlurFade inView delay={BLUR_FADE_DELAY}>
            <div className="surface p-3 sm:p-4">
              <WorkSection experience={experience} />
            </div>
          </BlurFade>
        )}
      </section>

      <div className="grid gap-20 sm:gap-24 lg:grid-cols-2 lg:gap-8">
        <section id="education" className="flex min-w-0 flex-col gap-6 sm:gap-8">
          <BlurFade inView delay={0}>
            <SectionHeading title="Education" />
          </BlurFade>
          <BlurFade inView delay={BLUR_FADE_DELAY} className="flex-1">
            <ul className="surface flex h-full flex-col gap-1 p-3 empty:hidden sm:p-4">
              {education.map((edu) => (
                <li key={edu._id}>
                  <Link
                    href={edu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl p-3 transition-colors duration-200 hover:bg-muted"
                  >
                    {edu.logoUrl ? (
                      <img
                        src={edu.logoUrl}
                        alt={edu.school}
                        className="size-11 flex-none overflow-hidden rounded-full border border-border bg-white object-contain p-1"
                      />
                    ) : (
                      <div className="size-11 flex-none rounded-full border border-border bg-muted" />
                    )}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-semibold leading-snug text-foreground">
                        <span className="min-w-0">{edu.school}</span>
                        <ArrowUpRight
                          className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                          aria-hidden
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">{edu.degree}</div>
                      <div className="text-xs tabular-nums text-muted-foreground sm:hidden">
                        {edu.start} - {edu.end}
                      </div>
                    </div>
                    <span className="hidden flex-none text-sm tabular-nums text-muted-foreground sm:block">
                      {edu.start} - {edu.end}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </BlurFade>
        </section>

        <section id="certifications" className="flex min-w-0 flex-col gap-6 sm:gap-8">
          <BlurFade inView delay={0}>
            <SectionHeading title="Certifications" />
          </BlurFade>
          <BlurFade inView delay={BLUR_FADE_DELAY} className="flex-1">
            <ul className="surface h-full divide-y divide-border px-6 py-2 empty:hidden">
              {certifications.map((cert) => (
                <li key={cert._id} className="py-4">
                  <p className="font-semibold leading-snug text-foreground">{cert.name}</p>
                  <p className="mt-1 text-sm font-medium text-accent-foreground">
                    {cert.issuer}
                  </p>
                  {cert.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cert.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </BlurFade>
        </section>
      </div>

      <section id="skills" className="flex flex-col gap-6 sm:gap-8">
        <BlurFade inView delay={0}>
          <SectionHeading title="Skills" />
        </BlurFade>
        <BlurFade inView delay={BLUR_FADE_DELAY}>
          <ul className="surface flex flex-wrap gap-2.5 p-6 empty:hidden sm:p-8">
            {skills.map((skill) => (
              <li
                key={skill._id}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-accent"
              >
                {skillIconMap[skill.icon] && (
                  <FontAwesomeIcon
                    icon={skillIconMap[skill.icon]}
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                )}
                {skill.name}
              </li>
            ))}
          </ul>
        </BlurFade>
      </section>

      <section id="projects">
        <BlurFade inView delay={0}>
          <ProjectsSection projects={projects} />
        </BlurFade>
      </section>

      <section id="github">
        <BlurFade inView delay={0}>
          <GithubSection githubUrl={github?.url || ""} />
        </BlurFade>
      </section>

      <section id="contact">
        <BlurFade inView delay={0}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
