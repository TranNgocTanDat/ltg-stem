import { Building2, MapPin, Users, Quote } from "lucide-react";

const partners = [
  {
    name: "Hệ thống trường Vinschool",
    location: "Hà Nội & TP.HCM",
    students: "15.000+ học sinh",
    quote: "LTG Education giúp chúng tôi triển khai STEM một cách chuyên nghiệp và hiệu quả.",
  },
  {
    name: "Trường Quốc tế TH School",
    location: "Hà Nội",
    students: "3.000+ học sinh",
    quote: "Giáo trình chuẩn quốc tế và đội ngũ hỗ trợ tận tình.",
  },
  {
    name: "Hệ thống trường FPT",
    location: "Toàn quốc",
    students: "10.000+ học sinh",
    quote: "Nền tảng Coding Blocks rất phù hợp để đưa vào chương trình chính khóa.",
  },
];

const stats = [
  { value: "100+", label: "Trường học đối tác" },
  { value: "20+", label: "Tỉnh thành phủ sóng" },
  { value: "50.000+", label: "Học sinh được đào tạo" },
  { value: "500+", label: "Giáo viên được training" },
];

export function PartnersSection() {
  return (
    <section id="partners" className="bg-muted/50 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Được tin tưởng bởi các trường học hàng đầu
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            LTG Education tự hào đồng hành cùng hàng trăm trường học 
            trong hành trình đưa STEM Robotics đến với học sinh Việt Nam.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partner testimonials */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{partner.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {partner.location}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {partner.students}
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <Quote className="h-5 w-5 text-primary/50" />
                <p className="mt-2 text-sm italic text-muted-foreground leading-relaxed">
                  {partner.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted by logos placeholder */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Và nhiều trường học, trung tâm giáo dục khác trên toàn quốc
          </p>
        </div>
      </div>
    </section>
  );
}
