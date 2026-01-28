import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, GraduationCap, CheckCircle } from "lucide-react";

const programs = [
  {
    title: "STEM Robotics Tiểu học",
    description:
      "Chương trình nhập môn dành cho học sinh tiểu học. Làm quen với robot, tư duy logic và lập trình trực quan.",
    level: "Lớp 1-5",
    duration: "32 tiết/năm",
    features: ["Bộ kit robot cơ bản", "Coding Blocks trực quan", "Học qua trò chơi"],
    badge: "Phổ biến nhất",
    badgeVariant: "default" as const,
  },
  {
    title: "STEM Robotics THCS",
    description:
      "Chương trình nâng cao cho THCS. Lập trình Scratch, mBlock và thiết kế robot giải quyết vấn đề thực tế.",
    level: "Lớp 6-9",
    duration: "36 tiết/năm",
    features: ["Bộ kit robot nâng cao", "Scratch & mBlock", "Dự án thực tế"],
    badge: "Được yêu thích",
    badgeVariant: "secondary" as const,
  },
  {
    title: "STEM Robotics THPT",
    description:
      "Chương trình chuyên sâu với Python, Arduino và chuẩn bị cho các cuộc thi robotics quốc gia, quốc tế.",
    level: "Lớp 10-12",
    duration: "40 tiết/năm",
    features: ["Python & Arduino", "AI cơ bản", "Thi đấu quốc tế"],
    badge: "Chuyên sâu",
    badgeVariant: "outline" as const,
  },
];

export function ProgramsSection() {
  return (
    <section id="programs" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Chương trình theo cấp học
            </h2>
            <p className="mt-2 text-muted-foreground">
              Giáo trình được thiết kế phù hợp với từng độ tuổi và cấp học
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            Xem chi tiết giáo trình
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
            >
              {/* Program header */}
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                <Badge variant={program.badgeVariant} className="absolute right-4 top-4">
                  {program.badge}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {program.level}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  {program.title}
                </h3>
              </div>

              {/* Program content */}
              <div className="flex flex-1 flex-col p-6">
                <p className="flex-1 text-muted-foreground leading-relaxed">
                  {program.description}
                </p>

                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{program.duration}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {program.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="mt-6 w-full gap-2">
                  Tìm hiểu thêm
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
