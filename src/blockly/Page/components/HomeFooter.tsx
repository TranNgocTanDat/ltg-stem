export default function HomeFooter() {
    return (
        <footer className="border-t border-[#E8F3EA] bg-white h-16 flex-shrink-0">

            <div className="
                mx-auto
                max-w-6xl
                px-6
                h-full
                flex
                items-center
                justify-between
            ">

                {/* <div className="text-xs text-[#8A978D] font-mono">
                    ltg.education
                </div> */}

                <div className="flex gap-6 text-xs text-[#8A978D]">

                    <a
                        href="#"
                        className="hover:text-[#35B84A] transition-colors"
                    >
                        Điều khoản
                    </a>

                    <a
                        href="#"
                        className="hover:text-[#35B84A] transition-colors"
                    >
                        Quyền riêng tư
                    </a>

                    <a
                        href="#"
                        className="hover:text-[#35B84A] transition-colors"
                    >
                        Giới thiệu
                    </a>

                </div>

                <div className="text-xs text-[#8A978D] font-mono">
                    v1.0.0
                </div>

            </div>
        </footer>
    );
}