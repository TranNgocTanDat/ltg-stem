import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import NewProjectCard from './NewProjectCard';
import ProjectCard from './ProjectCard';

interface Project {
    id: string;
    name: string;
    updatedAt: number;
}

interface ProjectCarouselProps {
    projects: Project[];
    onCreate: () => void;
    onOpen: (projectId: string) => void;
}

export default function ProjectCarousel({
    projects,
    onCreate,
    onOpen,
}: ProjectCarouselProps) {

    const totalCards = projects.length + 1;

    const viewportRef =
        useRef<HTMLDivElement | null>(null);

    const [itemsPerView, setItemsPerView] =
        useState(4);

    const [cardWidthPx, setCardWidthPx] =
        useState(0);

    const [index, setIndex] =
        useState(0);

    useEffect(() => {

        const update = () => {

            const w = window.innerWidth;

            const ip =
                w >= 1024
                    ? 4
                    : w >= 768
                        ? 2
                        : 1;

            setItemsPerView(ip);

            if (viewportRef.current) {
                setCardWidthPx(
                    Math.floor(
                        viewportRef.current.clientWidth / ip
                    )
                );
            }
        };

        update();

        window.addEventListener(
            'resize',
            update
        );

        return () => {
            window.removeEventListener(
                'resize',
                update
            );
        };

    }, []);

    const maxIndex = Math.max(
        0,
        totalCards - itemsPerView
    );

    useEffect(() => {

        if (index > maxIndex) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIndex(maxIndex);
        }

    }, [
        index,
        maxIndex,
    ]);

    const prev = () => {
        setIndex((i) =>
            Math.max(0, i - 1)
        );
    };

    const next = () => {
        setIndex((i) =>
            Math.min(maxIndex, i + 1)
        );
    };

    const translateX =
        cardWidthPx > 0
            ? -(index * cardWidthPx)
            : `-${(index * 100) / totalCards}%`;

    return (
        <div className="relative">

            {/* Viewport */}
            <div
                ref={viewportRef}
                className="overflow-hidden"
            >
                <div
                    className="
                        flex
                        transition-transform
                        duration-300
                        will-change-transform
                    "
                    style={{
                        transform:
                            typeof translateX === 'number'
                                ? `translateX(${translateX}px)`
                                : `translateX(${translateX})`,
                    }}
                >

                    {/* New project */}
                    <div
                        className="p-2"
                        style={{
                            minWidth: cardWidthPx
                                ? `${cardWidthPx}px`
                                : `${100 / itemsPerView}%`,

                            maxWidth: cardWidthPx
                                ? `${cardWidthPx}px`
                                : `${100 / itemsPerView}%`,
                        }}
                    >
                        <NewProjectCard
                            onClick={onCreate}
                        />
                    </div>

                    {/* Projects */}
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="p-2"
                            style={{
                                minWidth: cardWidthPx
                                    ? `${cardWidthPx}px`
                                    : `${100 / itemsPerView}%`,

                                maxWidth: cardWidthPx
                                    ? `${cardWidthPx}px`
                                    : `${100 / itemsPerView}%`,
                            }}
                        >
                            <ProjectCard
                                project={project}
                                onClick={() =>
                                    onOpen(project.id)
                                }
                            />
                        </div>
                    ))}

                </div>
            </div>

            {/* Previous */}
            <button
                onClick={prev}
                aria-label="Previous"
                disabled={index === 0}
                className={`
                    absolute
                    left-2
                    top-1/2
                    -translate-y-1/2
                    z-10
                    h-9
                    w-9
                    rounded-full
                    bg-white
                    border
                    border-[#DDE9DF]
                    flex
                    items-center
                    justify-center
                    shadow-md
                    transition-all

                    ${index === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-[#F1FAF2] hover:border-[#A9DCAF]'
                    }
                `}
            >
                <ChevronLeft className="h-4 w-4 text-[#4E5D52]" />
            </button>

            {/* Next */}
            <button
                onClick={next}
                aria-label="Next"
                disabled={index === maxIndex}
                className={`
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    z-10
                    h-9
                    w-9
                    rounded-full
                    bg-white
                    border
                    border-[#DDE9DF]
                    flex
                    items-center
                    justify-center
                    shadow-md
                    transition-all

                    ${index === maxIndex
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-[#F1FAF2] hover:border-[#A9DCAF]'
                    }
                `}
            >
                <ChevronRight className="h-4 w-4 text-[#4E5D52]" />
            </button>

            {/* Dots */}
            <div className="mt-4 flex items-center justify-center gap-2">

                {Array.from({
                    length: maxIndex + 1,
                }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() =>
                            setIndex(i)
                        }
                        className={`
                            h-2
                            rounded-full
                            transition-all

                            ${i === index
                                ? 'w-8 bg-[#35B84A]'
                                : 'w-2 bg-[#CFE2D2]'
                            }
                        `}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}

            </div>

        </div>
    );
}