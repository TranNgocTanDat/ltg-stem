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
        <header className="h-16 flex-shrink-0 border-b border-[#E8F3EA] bg-white">
            <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6">

                {/* Logo */}
                <div className="flex min-w-0 items-center gap-3">
                    {/* 
                    <div className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#E8F7EA]
                        text-sm
                        font-bold
                        text-[#35B84A]
                    ">
                        L
                    </div>

                    <span className="
                        hidden
                        truncate
                        text-base
                        font-semibold
                        tracking-wide
                        text-[#1F2937]
                        sm:block
                    ">
                        LTG Education
                    </span>
                    */}
                </div>

                {/* Right */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">

                    {/* Settings */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="
                            h-8
                            w-8
                            shrink-0
                            text-[#7A8A7D]
                            hover:bg-[#F1FAF2]
                            hover:text-[#35B84A]
                        "
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    {/* User */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                className="
                                    h-8
                                    shrink-0
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-[#BFE7C6]
                                    bg-[#EAF8EC]
                                    px-2
                                    text-xs
                                    font-medium
                                    text-[#2FA943]
                                    hover:bg-[#DDF5E1]
                                    sm:px-3
                                "
                            >
                                <User className="h-3.5 w-3.5 shrink-0" />

                                {/* Chỉ hiện chữ từ sm */}
                                <span className="hidden sm:inline">
                                    Đăng ký
                                </span>
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