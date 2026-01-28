import { Cpu, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Cpu className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                LTG Education
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Công ty cung cấp giải pháp STEM Robotics và Coding Blocks 
              cho các trường học và trung tâm giáo dục tại Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Giải pháp</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  STEM Robotics Tiểu học
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  STEM Robotics THCS
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  STEM Robotics THPT
                </Link>
              </li>
              <li>
                <Link
                  to="/coding-blocks"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Nền tảng Coding Blocks
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Về LTG</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Giới thiệu công ty
                </Link>
              </li>
              <li>
                <Link
                  to="#partners"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Đối tác & Khách hàng
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tin tức & Sự kiện
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Liên hệ hợp tác</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>partner@ltgeducation.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 LTG Education. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Điều khoản hợp tác
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
