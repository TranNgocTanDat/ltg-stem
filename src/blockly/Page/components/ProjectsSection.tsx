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

    const totalCards = projects.length + 1;

    return (
        <section className="mx-[13%] max-w-6xl px-6 flex-1 overflow-hidden py-6">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h2 className="text-2xl font-bold text-[#26352A]">
                        Dự Án Của Tôi
                    </h2>

                    <p className="text-sm text-[#8A978D] mt-1">
                        Quản lý và mở các dự án của bạn
                    </p>
                </div>

                <div className="flex gap-2">

                    <Button
                        variant="outline"
                        size="sm"
                        className="
                            gap-2
                            h-9
                            px-4
                            border-[#DDE9DF]
                            text-[#657267]
                            hover:text-[#35B84A]
                            hover:bg-[#F1FAF2]
                            bg-white
                        "
                    >
                        <Download className="h-4 w-4" />
                        Nhập
                    </Button>

                    <Button
                        size="sm"
                        onClick={onCreate}
                        className="
                            gap-2
                            h-9
                            px-4
                            bg-[#35B84A]
                            text-white
                            hover:bg-[#2FA943]
                            shadow-sm
                        "
                    >
                        <Plus className="h-4 w-4" />
                        Tạo
                    </Button>

                </div>
            </div>

            {/* Desktop / Tablet */}
            {totalCards > 4 ? (

                <ProjectCarousel
                    projects={projects}
                    onCreate={onCreate}
                    onOpen={onOpen}
                />

            ) : (

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                ">

                    <NewProjectCard
                        onClick={onCreate}
                    />

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