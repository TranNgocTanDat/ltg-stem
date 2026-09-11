import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

import NewProjectCard from './NewProjectCard';
import ProjectCard from './ProjectCard';
import ProjectCarousel from './ProjectCarousel';

interface Project {
    id: string;
    name: string;
    updatedAt: number;
}

interface ProjectsSectionProps {
    projects: Project[];
    onCreate: () => void;
    onOpen: (projectId: string) => void;
}

export default function ProjectsSection({
    projects,
    onCreate,
    onOpen,
}: ProjectsSectionProps) {

    const totalCards =
        projects.length + 1;

    return (
        <section
            className="
                mx-auto
                w-full
                max-w-6xl
                flex-shrink-0
                px-4
                py-6

                sm:px-6

                lg:py-8
            "
        >

            {/* ================================
                Header
            ================================= */}

            <div
                className="
                    mb-6
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                {/* Title */}
                <div className="min-w-0">

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-[#26352A]

                            sm:text-2xl
                        "
                    >
                        Dự Án Của Tôi
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-[#8A978D]

                            sm:text-sm
                        "
                    >
                        Quản lý và mở các dự án của bạn
                    </p>

                </div>

                {/* Actions */}
                <div
                    className="
                        flex
                        shrink-0
                        gap-2
                    "
                >

                    {/* Import */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="
                            h-9
                            gap-2
                            border-[#DDE9DF]
                            bg-white
                            px-3
                            text-[#657267]
                            hover:bg-[#F1FAF2]
                            hover:text-[#35B84A]

                            sm:px-4
                        "
                    >
                        <Download className="h-4 w-4" />

                        <span className="hidden sm:inline">
                            Nhập
                        </span>
                    </Button>

                    {/* Create */}
                    <Button
                        size="sm"
                        onClick={onCreate}
                        className="
                            h-9
                            gap-2
                            bg-[#35B84A]
                            px-3
                            text-white
                            shadow-sm
                            hover:bg-[#2FA943]

                            sm:px-4
                        "
                    >
                        <Plus className="h-4 w-4" />

                        <span className="hidden sm:inline">
                            Tạo
                        </span>
                    </Button>

                </div>

            </div>

            {/* ================================
                Projects
            ================================= */}

            {totalCards > 4 ? (

                <ProjectCarousel
                    projects={projects}
                    onCreate={onCreate}
                    onOpen={onOpen}
                />

            ) : (

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4

                        sm:grid-cols-2

                        lg:grid-cols-4
                    "
                >

                    {/* New project */}
                    <NewProjectCard
                        onClick={onCreate}
                    />

                    {/* Existing projects */}
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() =>
                                onOpen(project.id)
                            }
                        />
                    ))}

                </div>

            )}

        </section>
    );
}