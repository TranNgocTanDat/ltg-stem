// 'use client';

// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Plus, Settings, User, Download, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';

// export default function Home() {
//   const [projects] = useState([
//     { id: 1, name: 'Untitled', created: 'a few seconds ago' },
//     { id: 2, name: 'car', created: '20 giây trước' },

//   ]);

//   const totalCards = projects.length + 1; // +1 for "Dự Án Mới"
//   const viewportRef = useRef<HTMLDivElement | null>(null);
//   const [itemsPerView, setItemsPerView] = useState(4);
//   const [cardWidthPx, setCardWidthPx] = useState<number>(0);
//   const [index, setIndex] = useState(0);

//   // Determine itemsPerView responsively and compute card width
//   useEffect(() => {
//     const update = () => {
//       const w = window.innerWidth;
//       const ip = w >= 1024 ? 4 : w >= 768 ? 2 : 1;
//       setItemsPerView(ip);
//       if (viewportRef.current) {
//         setCardWidthPx(Math.floor(viewportRef.current.clientWidth / ip));
//       }
//     };
//     update();
//     window.addEventListener('resize', update);
//     return () => window.removeEventListener('resize', update);
//   }, []);

//   // Keep index in bounds when itemsPerView changes
//   useEffect(() => {
//     const maxIndex = Math.max(0, totalCards - itemsPerView);
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     if (index > maxIndex) setIndex(maxIndex);
//   }, [itemsPerView, totalCards, index]);

//   const maxIndex = Math.max(0, totalCards - itemsPerView);
//   const shouldUseCarousel = totalCards > itemsPerView;

//   const prev = () => setIndex((i) => Math.max(0, i - 1));
//   const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

//   const translateX = cardWidthPx ? -(index * cardWidthPx) : `-${(index * 100) / totalCards}%`;

//   return (
//     <div className="h-screen bg-background flex flex-col overflow-hidden">
//       {/* Header */}
//       <header className="border-b border-border/40 bg-background h-16 flex-shrink-0">
//         <div className="flex items-center justify-between px-6 h-full">
//           <div className="flex items-center gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/20 text-primary font-bold text-sm font-mono">
//               L
//             </div>
//             <span className="text-base font-semibold tracking-wide text-foreground">LTG Education</span>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60 hover:text-foreground">
//               <Settings className="h-4 w-4" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   size="sm"
//                   className="gap-2 h-8 px-3 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
//                 >
//                   <User className="h-3.5 w-3.5" />
//                   Đăng ký
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-40">
//                 <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
//                 <DropdownMenuItem>Cài đặt</DropdownMenuItem>
//                 <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Hero */}
//         <section className="relative overflow-hidden border-b border-border/40 h-[36vh] flex-shrink-0">
//           <div className="mx-auto max-w-6xl px-6 h-full flex items-center">
//             <div className="max-w-2xl">
//               <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
//                 Học Lập Trình
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"> Thực Tế</span>
//               </h1>
//               <p className="text-sm md:text-base text-foreground/70 mb-6 max-w-xl leading-relaxed">
//                 Tạo các dự án tương tác, học lập trình từ các chuyên gia, và xây dựng kỹ năng coding của bạn.
//               </p>
//               <Button
//                 className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 h-9 text-sm font-medium"
//               >
//                 Thử Ngay
//               </Button>
//             </div>

//             <div className="absolute right-6 top-6 -z-10 w-64 h-64 md:w-96 md:h-96">
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
//             </div>
//           </div>
//         </section>

//         {/* Projects - show carousel only when overflow */}
//         <section className="mx-[13%] max-w-6xl px-6 flex-1 overflow-hidden py-6">
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-foreground">Dự Án Của Tôi</h2>
//               <p className="text-sm text-foreground/50 mt-1">Quản lý và mở các dự án của bạn</p>
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="gap-2 h-9 px-4 border-border/40 text-foreground/70 hover:text-foreground hover:bg-muted/50 bg-transparent"
//               >
//                 <Download className="h-4 w-4" />
//                 Nhập
//               </Button>
//               <Button
//                 size="sm"
//                 className="gap-2 h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 <Plus className="h-4 w-4" />
//                 Tạo
//               </Button>
//             </div>
//           </div>

//           <div className="relative">
//             {shouldUseCarousel ? (
//               <>
//                 {/* Carousel viewport */}
//                 <div ref={viewportRef} className="overflow-hidden">
//                   <div
//                     className="flex transition-transform duration-300 will-change-transform"
//                     style={{
//                       transform: typeof translateX === 'number' ? `translateX(${translateX}px)` : `translateX(${translateX})`,
//                     }}
//                   >
//                     {/* New project */}
//                     <div
//                       className="p-2"
//                       style={{
//                         minWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
//                         maxWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
//                       }}
//                     >
//                       <Card className="relative overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer h-44 flex flex-col items-center justify-center gap-3 group">
//                         <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
//                           <Plus className="h-6 w-6 text-primary/70" />
//                         </div>
//                         <div className="text-center">
//                           <p className="text-sm font-medium text-foreground">Dự Án Mới</p>
//                           <p className="text-xs text-foreground/50 mt-1">Tạo một dự án mới</p>
//                         </div>
//                       </Card>
//                     </div>

//                     {projects.map((project) => (
//                       <div
//                         key={project.id}
//                         className="p-2"
//                         style={{
//                           minWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
//                           maxWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
//                         }}
//                       >
//                         <Card className="overflow-hidden rounded-lg border border-border/40 bg-muted/20 hover:border-border/60 hover:bg-muted/40 transition-all cursor-pointer group h-44">
//                           <div className="h-20 bg-gradient-to-br from-primary/15 to-accent/10 flex items-start justify-between p-4">
//                             <div className="flex items-center gap-2">
//                               <FolderOpen className="h-4 w-4 text-primary/60" />
//                               <span className="text-sm font-medium text-foreground/80">{project.name}</span>
//                             </div>
//                           </div>
//                           <div className="px-4 py-3 space-y-3">
//                             <p className="text-xs text-foreground/50">{project.created}</p>
//                             <div className="pt-2 border-t border-border/30">
//                               <p className="text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
//                                 Nhấp để mở
//                               </p>
//                             </div>
//                           </div>
//                         </Card>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Controls */}
//                 <button
//                   onClick={prev}
//                   aria-label="Previous"
//                   disabled={index === 0}
//                   className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 border border-border/30 flex items-center justify-center shadow-sm transition-opacity ${
//                     index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-100'
//                   }`}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={next}
//                   aria-label="Next"
//                   disabled={index === maxIndex}
//                   className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 border border-border/30 flex items-center justify-center shadow-sm transition-opacity ${
//                     index === maxIndex ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-100'
//                   }`}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </button>

//                 {/* Dots */}
//                 <div className="mt-4 flex items-center justify-center gap-2">
//                   {Array.from({ length: maxIndex + 1 }).map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setIndex(i)}
//                       className={`h-2 w-8 rounded-full transition-colors ${i === index ? 'bg-primary' : 'bg-border/40'}`}
//                       aria-label={`Go to slide ${i + 1}`}
//                     />
//                   ))}
//                 </div>
//               </>
//             ) : (
//               /* Static grid when everything fits */
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {/* New project */}
//                 <Card className="relative overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer h-44 flex flex-col items-center justify-center gap-3 group p-4">
//                   <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
//                     <Plus className="h-6 w-6 text-primary/70" />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm font-medium text-foreground">Dự Án Mới</p>
//                     <p className="text-xs text-foreground/50 mt-1">Tạo một dự án mới</p>
//                   </div>
//                 </Card>

//                 {projects.map((project) => (
//                   <Card key={project.id} className="overflow-hidden rounded-lg border border-border/40 bg-muted/20 hover:border-border/60 hover:bg-muted/40 transition-all cursor-pointer group h-44">
//                     <div className="h-20 bg-gradient-to-br from-primary/15 to-accent/10 flex items-start justify-between p-4">
//                       <div className="flex items-center gap-2">
//                         <FolderOpen className="h-4 w-4 text-primary/60" />
//                         <span className="text-sm font-medium text-foreground/80">{project.name}</span>
//                       </div>
//                     </div>
//                     <div className="px-4 py-3 space-y-3">
//                       <p className="text-xs text-foreground/50">{project.created}</p>
//                       <div className="pt-2 border-t border-border/30">
//                         <p className="text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
//                           Nhấp để mở
//                         </p>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-border/40 bg-background/50 h-16 flex-shrink-0">
//         <div className="mx-auto max-w-6xl px-6 h-full flex items-center justify-between">
//           <div className="text-xs text-foreground/50 font-mono">
//             ltg.education
//           </div>
//           <div className="flex gap-6 text-xs text-foreground/50">
//             <a href="#" className="hover:text-foreground transition-colors">
//               Điều khoản
//             </a>
//             <a href="#" className="hover:text-foreground transition-colors">
//               Quyền riêng tư
//             </a>
//             <a href="#" className="hover:text-foreground transition-colors">
//               Giới thiệu
//             </a>
//           </div>
//           <div className="text-xs text-foreground/50 font-mono">
//             v1.0.0
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    Settings,
    User,
    Download,
    FolderOpen,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmptyProject } from '@/blockly/projects';

export default function Home() {
    const [projects] = useState([
        { id: 1, name: 'Untitled', created: 'a few seconds ago' },
        { id: 2, name: 'car', created: '20 giây trước' },
    ]);

    const totalCards = projects.length + 1; // +1 for "Dự Án Mới"
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [cardWidthPx, setCardWidthPx] = useState<number>(0);
    const [index, setIndex] = useState(0);

    const navigate = useNavigate();

    // Determine itemsPerView responsively and compute card width
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            const ip = w >= 1024 ? 4 : w >= 768 ? 2 : 1;
            setItemsPerView(ip);
            if (viewportRef.current) {
                setCardWidthPx(Math.floor(viewportRef.current.clientWidth / ip));
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Keep index in bounds when itemsPerView changes
    useEffect(() => {
        const maxIndex = Math.max(0, totalCards - itemsPerView);
        if (index > maxIndex) setIndex(maxIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsPerView, totalCards]);

    const maxIndex = Math.max(0, totalCards - itemsPerView);
    const shouldUseCarousel = totalCards > itemsPerView;

    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

    const translateX =
        typeof cardWidthPx === 'number' && cardWidthPx > 0
            ? -(index * cardWidthPx)
            : `-${(index * 100) / totalCards}%`;

    // create project then navigate to editor where BlockyEditor will load active project from localStorage
    const handleCreateAndOpen = () => {
        const name = prompt('Nhập tên project mới:') || 'Untitled';
        try {
            createEmptyProject(name);
            navigate('/editor-blockly');
        } catch (err) {
            console.error('Failed to create project', err);
            alert('Tạo project thất bại.');
        }
    };

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Header */}
            <header className="border-b border-border/40 bg-background h-16 flex-shrink-0">
                <div className="flex items-center justify-between px-6 h-full">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/20 text-primary font-bold text-sm font-mono">
                            L
                        </div>
                        <span className="text-base font-semibold tracking-wide text-foreground">LTG Education</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60 hover:text-foreground">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    className="gap-2 h-8 px-3 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                                >
                                    <User className="h-3.5 w-3.5" />
                                    Đăng ký
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                                <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                                <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-border/40 h-[36vh] flex-shrink-0">
                    <div className="mx-auto max-w-6xl px-6 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                                Học Lập Trình
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"> Thực Tế</span>
                            </h1>
                            <p className="text-sm md:text-base text-foreground/70 mb-6 max-w-xl leading-relaxed">
                                Tạo các dự án tương tác, học lập trình từ các chuyên gia, và xây dựng kỹ năng coding của bạn.
                            </p>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 h-9 text-sm font-medium">
                                Thử Ngay
                            </Button>
                        </div>

                        <div className="absolute right-6 top-6 -z-10 w-64 h-64 md:w-96 md:h-96">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
                        </div>
                    </div>
                </section>

                {/* Projects - show carousel only when overflow */}
                <section className="mx-[13%] max-w-6xl px-6 flex-1 overflow-hidden py-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Dự Án Của Tôi</h2>
                            <p className="text-sm text-foreground/50 mt-1">Quản lý và mở các dự án của bạn</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 h-9 px-4 border-border/40 text-foreground/70 hover:text-foreground hover:bg-muted/50 bg-transparent"
                            >
                                <Download className="h-4 w-4" />
                                Nhập
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2 h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={handleCreateAndOpen}
                            >
                                <Plus className="h-4 w-4" />
                                Tạo
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        {shouldUseCarousel ? (
                            <>
                                {/* Carousel viewport */}
                                <div ref={viewportRef} className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-300 will-change-transform"
                                        style={{
                                            transform: typeof translateX === 'number' ? `translateX(${translateX}px)` : `translateX(${translateX})`,
                                        }}
                                    >
                                        {/* New project */}
                                        <div
                                            className="p-2"
                                            style={{
                                                minWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
                                                maxWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
                                            }}
                                        >
                                            <Card
                                                onClick={handleCreateAndOpen}
                                                className="relative overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer h-44 flex flex-col items-center justify-center gap-3 group"
                                            >
                                                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                                                    <Plus className="h-6 w-6 text-primary/70" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-foreground">Dự Án Mới</p>
                                                    <p className="text-xs text-foreground/50 mt-1">Tạo một dự án mới</p>
                                                </div>
                                            </Card>
                                        </div>

                                        {projects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="p-2"
                                                style={{
                                                    minWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
                                                    maxWidth: cardWidthPx ? `${cardWidthPx}px` : `${100 / itemsPerView}%`,
                                                }}
                                            >
                                                <Card className="overflow-hidden rounded-lg border border-border/40 bg-muted/20 hover:border-border/60 hover:bg-muted/40 transition-all cursor-pointer group h-44">
                                                    <div className="h-20 bg-gradient-to-br from-primary/15 to-accent/10 flex items-start justify-between p-4">
                                                        <div className="flex items-center gap-2">
                                                            <FolderOpen className="h-4 w-4 text-primary/60" />
                                                            <span className="text-sm font-medium text-foreground/80">{project.name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="px-4 py-3 space-y-3">
                                                        <p className="text-xs text-foreground/50">{project.created}</p>
                                                        <div className="pt-2 border-t border-border/30">
                                                            <p className="text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
                                                                Nhấp để mở
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Controls */}
                                <button
                                    onClick={prev}
                                    aria-label="Previous"
                                    disabled={index === 0}
                                    className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 border border-border/30 flex items-center justify-center shadow-sm transition-opacity ${index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-100'
                                        }`}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={next}
                                    aria-label="Next"
                                    disabled={index === maxIndex}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 border border-border/30 flex items-center justify-center shadow-sm transition-opacity ${index === maxIndex ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-100'
                                        }`}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>

                                {/* Dots */}
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setIndex(i)}
                                            className={`h-2 w-8 rounded-full transition-colors ${i === index ? 'bg-primary' : 'bg-border/40'}`}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            /* Static grid when everything fits */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* New project */}
                                <Card
                                    onClick={handleCreateAndOpen}
                                    className="relative overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer h-44 flex flex-col items-center justify-center gap-3 group p-4"
                                >
                                    <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                                        <Plus className="h-6 w-6 text-primary/70" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-foreground">Dự Án Mới</p>
                                        <p className="text-xs text-foreground/50 mt-1">Tạo một dự án mới</p>
                                    </div>
                                </Card>

                                {projects.map((project) => (
                                    <Card key={project.id} className="overflow-hidden rounded-lg border border-border/40 bg-muted/20 hover:border-border/60 hover:bg-muted/40 transition-all cursor-pointer group h-44">
                                        <div className="h-20 bg-gradient-to-br from-primary/15 to-accent/10 flex items-start justify-between p-4">
                                            <div className="flex items-center gap-2">
                                                <FolderOpen className="h-4 w-4 text-primary/60" />
                                                <span className="text-sm font-medium text-foreground/80">{project.name}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 space-y-3">
                                            <p className="text-xs text-foreground/50">{project.created}</p>
                                            <div className="pt-2 border-t border-border/30">
                                                <p className="text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
                                                    Nhấp để mở
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background/50 h-16 flex-shrink-0">
                <div className="mx-auto max-w-6xl px-6 h-full flex items-center justify-between">
                    <div className="text-xs text-foreground/50 font-mono">
                        ltg.education
                    </div>
                    <div className="flex gap-6 text-xs text-foreground/50">
                        <a href="#" className="hover:text-foreground transition-colors">
                            Điều khoản
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Quyền riêng tư
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Giới thiệu
                        </a>
                    </div>
                    <div className="text-xs text-foreground/50 font-mono">
                        v1.0.0
                    </div>
                </div>
            </footer>
        </div>
    );
}