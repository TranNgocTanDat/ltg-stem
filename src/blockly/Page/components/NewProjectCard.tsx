import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface NewProjectCardProps {
    onClick: () => void;
}

export default function NewProjectCard({
    onClick,
}: NewProjectCardProps) {
    return (
        <Card
            onClick={onClick}
            className="
                relative
                overflow-hidden
                rounded-xl
                border-2
                border-dashed
                border-[#BFE7C6]
                bg-[#F9FFFA]
                hover:bg-[#F0FBF2]
                hover:border-[#7BCB87]
                transition-all
                cursor-pointer
                h-44
                flex
                flex-col
                items-center
                justify-center
                gap-3
                group
                shadow-none
            "
        >
            <div
                className="
                    rounded-xl
                    bg-[#E8F7EA]
                    p-3
                    group-hover:bg-[#D9F3DD]
                    transition-colors
                "
            >
                <Plus className="h-6 w-6 text-[#35B84A]" />
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold text-[#26352A]">
                    Dự Án Mới
                </p>

                <p className="text-xs text-[#8A978D] mt-1">
                    Tạo một dự án mới
                </p>
            </div>
        </Card>
    );
}