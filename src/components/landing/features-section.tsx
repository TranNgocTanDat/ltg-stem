import {
  BookOpen,
  Wrench,
  GraduationCap,
  Headphones,
  Award,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Giáo trình chuẩn",
    description:
      "Chương trình học được thiết kế bởi chuyên gia, phù hợp với từng cấp học và chuẩn đầu ra quốc tế.",
  },
  {
    icon: Wrench,
    title: "Thiết bị hiện đại",
    description:
      "Cung cấp bộ kit robot và thiết bị STEM chất lượng cao, dễ sử dụng và bền bỉ cho môi trường học đường.",
  },
  {
    icon: GraduationCap,
    title: "Đào tạo giáo viên",
    description:
      "Chương trình training toàn diện giúp giáo viên tự tin giảng dạy STEM Robotics cho học sinh.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ liên tục",
    description:
      "Đội ngũ kỹ thuật hỗ trợ 24/7, đồng hành cùng nhà trường trong suốt quá trình triển khai.",
  },
  {
    icon: Award,
    title: "Chứng nhận quốc tế",
    description:
      "Học sinh đạt chứng chỉ STEM được công nhận, cơ hội tham gia các cuộc thi trong nước và quốc tế.",
  },
  {
    icon: TrendingUp,
    title: "Báo cáo tiến độ",
    description:
      "Hệ thống quản lý và báo cáo kết quả học tập chi tiết cho nhà trường và phụ huynh.",
  },
];

export function FeaturesSection() {
  return (
    <section id="solutions" className="bg-muted/50 py-10 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Giải pháp toàn diện cho Nhà trường
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            LTG Education mang đến giải pháp STEM trọn gói, giúp nhà trường 
            triển khai chương trình Robotics một cách dễ dàng và hiệu quả.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
