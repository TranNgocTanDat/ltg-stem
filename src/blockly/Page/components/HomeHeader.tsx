import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Settings,
    User,
} from 'lucide-react';

export default function HomeHeader() {
    return (
        <header className="border-b border-[#E8F3EA] bg-white h-16 flex-shrink-0">
            <div className="flex items-center justify-between px-6 h-full">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F7EA] text-[#35B84A] font-bold text-sm">
                        L
                    </div>

                    <span className="text-base font-semibold tracking-wide text-[#1F2937]">
                        LTG Education
                    </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#7A8A7D] hover:text-[#35B84A] hover:bg-[#F1FAF2]"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                className="
                                    gap-2
                                    h-8
                                    px-3
                                    rounded-lg
                                    text-xs
                                    font-medium
                                    bg-[#EAF8EC]
                                    text-[#2FA943]
                                    hover:bg-[#DDF5E1]
                                    border border-[#BFE7C6]
                                "
                            >
                                <User className="h-3.5 w-3.5" />
                                Đăng ký
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-40"
                        >
                            <DropdownMenuItem>
                                Hồ sơ
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Cài đặt
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    );
}