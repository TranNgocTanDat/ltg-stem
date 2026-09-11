import { Button } from '@/components/ui/button';

interface HomeHeroProps {
    onStart?: () => void;
}

export default function HomeHero({
    onStart,
}: HomeHeroProps) {
    return (
        <section className="relative overflow-hidden border-b border-[#E8F3EA] bg-gradient-to-br from-[#F8FFF9] via-white to-[#F2FBF4] h-[36vh] flex-shrink-0">

            {/* Decorative circles */}
            <div className="absolute right-[-80px] top-[-100px] w-96 h-96 rounded-full bg-[#E9F9EC]" />

            <div className="absolute right-24 bottom-[-140px] w-72 h-72 rounded-full bg-[#FFF4D6] opacity-60" />

            <div className="mx-auto max-w-6xl px-6 h-full flex items-center relative z-10">

                <div className="max-w-2xl">

                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#EAF8EC] border border-[#CDEBCF]">
                        <span className="w-2 h-2 rounded-full bg-[#35B84A]" />

                        <span className="text-xs font-medium text-[#2FA943]">
                            STEM Robotics & Coding
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-[#18251B] mb-4 leading-tight tracking-tight">
                        Học Lập Trình{' '}
                        <span className="text-[#35B84A]">
                            Thực Tế
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-[#647067] mb-6 max-w-xl leading-relaxed">
                        Tạo các dự án tương tác, khám phá Robotics,
                        học lập trình và phát triển tư duy sáng tạo
                        thông qua những trải nghiệm thực tế.
                    </p>

                    <Button
                        onClick={onStart}
                        className="
                            bg-[#35B84A]
                            text-white
                            hover:bg-[#2FA943]
                            rounded-lg
                            px-5
                            h-10
                            text-sm
                            font-semibold
                            shadow-sm
                        "
                    >
                        Bắt Đầu Khám Phá
                    </Button>

                </div>

            </div>
        </section>
    );
}