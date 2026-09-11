import { Button } from '@/components/ui/button';

interface HomeHeroProps {
    onStart?: () => void;
}

export default function HomeHero({
    onStart,
}: HomeHeroProps) {

    return (
        <section
            className="
                relative
                flex-shrink-0
                overflow-hidden
                border-b
                border-[#E8F3EA]
                bg-gradient-to-br
                from-[#F8FFF9]
                via-white
                to-[#F2FBF4]

                min-h-[340px]
                py-10

                sm:min-h-[360px]
                sm:py-12

                md:min-h-[380px]
                md:py-12

                lg:h-[36vh]
                lg:min-h-0
                lg:py-0
            "
        >

            {/* ================================
                Decorative circles
            ================================= */}

            <div
                className="
                    absolute
                    right-[-120px]
                    top-[-130px]
                    h-72
                    w-72
                    rounded-full
                    bg-[#E9F9EC]

                    sm:right-[-100px]
                    sm:top-[-110px]
                    sm:h-80
                    sm:w-80

                    md:right-[-80px]
                    md:top-[-100px]
                    md:h-96
                    md:w-96
                "
            />

            <div
                className="
                    absolute
                    bottom-[-150px]
                    right-[-80px]
                    h-60
                    w-60
                    rounded-full
                    bg-[#FFF4D6]
                    opacity-60

                    sm:bottom-[-140px]
                    sm:right-10
                    sm:h-72
                    sm:w-72

                    md:bottom-[-140px]
                    md:right-24
                "
            />

            {/* ================================
                Content
            ================================= */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    h-full
                    w-full
                    max-w-6xl
                    items-center
                    px-4

                    sm:px-6
                "
            >

                <div
                    className="
                        w-full
                        max-w-2xl
                        text-center

                        md:text-left
                    "
                >

                    {/* Badge */}
                    <div
                        className="
                            mb-4
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#CDEBCF]
                            bg-[#EAF8EC]
                            px-3
                            py-1
                        "
                    >

                        <span
                            className="
                                h-2
                                w-2
                                shrink-0
                                rounded-full
                                bg-[#35B84A]
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-medium
                                text-[#2FA943]
                            "
                        >
                            STEM Robotics & Coding
                        </span>

                    </div>

                    {/* Title */}
                    <h1
                        className="
                            mb-3
                            text-3xl
                            font-bold
                            leading-tight
                            tracking-tight
                            text-[#18251B]

                            sm:text-4xl

                            md:mb-4
                            md:text-5xl
                        "
                    >
                        Học Lập Trình{' '}

                        <span className="text-[#35B84A]">
                            Thực Tế
                        </span>
                    </h1>

                    {/* Description */}
                    <p
                        className="
                            mx-auto
                            mb-6
                            max-w-xl
                            text-sm
                            leading-relaxed
                            text-[#647067]

                            sm:text-base

                            md:mx-0
                        "
                    >
                        Tạo các dự án tương tác, khám phá Robotics,
                        học lập trình và phát triển tư duy sáng tạo
                        thông qua những trải nghiệm thực tế.
                    </p>

                    {/* Button */}
                    <Button
                        onClick={onStart}
                        className="
                            h-10
                            rounded-lg
                            bg-[#35B84A]
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            hover:bg-[#2FA943]

                            sm:h-11
                            sm:px-6
                        "
                    >
                        Bắt Đầu Khám Phá
                    </Button>

                </div>

            </div>

        </section>
    );
}