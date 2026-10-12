import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import SectionHeading from "@/components/section-heading";
import type { Project } from "@/lib/api";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection({ projects }: { projects: Project[] }) {
    return (
        <div className="flex min-h-0 flex-col gap-6 sm:gap-8">
            <SectionHeading title="Featured Projects" />
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {projects.filter((project) => project.active).map((project, id) => (
                    <li key={project._id} className="min-w-0">
                        <BlurFade
                            inView
                            delay={BLUR_FADE_DELAY + id * 0.05}
                            className="h-full"
                        >
                            <ProjectCard
                                href={project.href}
                                title={project.title}
                                description={project.description}
                                dates={project.dates}
                                tags={project.technologies}
                                image={project.image}
                                video={project.video}
                                links={project.links}
                            />
                        </BlurFade>
                    </li>
                ))}
            </ul>
        </div>
    );
}
