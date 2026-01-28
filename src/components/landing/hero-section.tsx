
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Bot, Blocks, Sparkles, Building2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-10 md:py-14 lg:py-19">
      {/* Background decoration */}
      {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div> */}

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Giải pháp STEM cho Nhà trường
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Triển khai{" "}
              <span className="text-primary">STEM Robotics</span> cho trường học của bạn
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              LTG Education cung cấp giải pháp STEM Robotics và nền tảng Coding Blocks 
              trọn gói cho các trường học và trung tâm giáo dục. Từ giáo trình, thiết bị 
              đến đào tạo giáo viên - tất cả trong một.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="gap-2">
                Đăng ký tư vấn
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Play className="h-4 w-4" />
                Xem demo giải pháp
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-8 border-t border-border pt-6">
              <div>
                <div className="text-2xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Trường học</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">50.000+</div>
                <div className="text-sm text-muted-foreground">Học sinh</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">20+</div>
                <div className="text-sm text-muted-foreground">Tỉnh thành</div>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-lg">
              {/* Main visual card */}
              <div className="absolute inset-4 rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex h-full flex-col items-center justify-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
                    <Bot className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      Giải pháp trọn gói
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Thiết bị + Giáo trình + Đào tạo
                    </p>
                  </div>

                  {/* Code blocks preview */}
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                      <div className="h-3 w-3 rounded bg-accent" />
                      <div className="h-2 w-20 rounded bg-muted-foreground/30" />
                    </div>
                    <div className="ml-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                      <div className="h-3 w-3 rounded bg-primary" />
                      <div className="h-2 w-16 rounded bg-primary/30" />
                    </div>
                    <div className="ml-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                      <div className="h-3 w-3 rounded bg-primary" />
                      <div className="h-2 w-24 rounded bg-primary/30" />
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                      <div className="h-3 w-3 rounded bg-accent" />
                      <div className="h-2 w-14 rounded bg-muted-foreground/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-lg">
                <Blocks className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Coding Blocks
                </span>
              </div>

              <div className="absolute -right-4 bottom-1/4 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-lg">
                <Building2 className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Cho nhà trường
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
