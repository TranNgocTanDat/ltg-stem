import { Card } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    updatedAt: number;
}

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

export default function ProjectCard({
    project,
    onClick,
}: ProjectCardProps) {

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString(
            'vi-VN',
            {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }
        );
    };

    return (
        <Card
            onClick={onClick}
            className="
        overflow-hidden
        rounded-xl
        border
        border-[#E1ECE3]
        bg-white
        hover:border-[#A9DCAF]
        hover:shadow-md
        transition-all
        cursor-pointer
        group
        h-44
        p-0
    "
        >
            {/* Header */}
            <div
                className="
                    h-20
                    bg-gradient-to-br
                    from-[#EAF8EC]
                    to-[#F8FCF8]
                    flex
                    items-start
                    justify-between
                    p-4
                "
            >
                <div className="flex items-center gap-2 min-w-0">

                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80">
                        <FolderOpen className="h-4 w-4 text-[#35B84A]" />
                    </div>

                    <span className="text-sm font-semibold text-[#304036] truncate">
                        {project.name}
                    </span>

                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-3">

                <p className="text-xs text-[#8A978D]">
                    Cập nhật: {formatDate(project.updatedAt)}
                </p>

                <div className="pt-2 border-t border-[#EDF2EE]">

                    <p className="
                        text-xs
                        font-semibold
                        text-[#58B965]
                        group-hover:text-[#2FA943]
                        transition-colors
                    ">
                        Nhấp để mở
                    </p>

                </div>

            </div>
        </Card>
    );
}