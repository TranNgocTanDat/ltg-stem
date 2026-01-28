"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Cpu } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Cpu className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            LTG Education
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#solutions"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Giải pháp
          </a>
          <a
            href="#programs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Chương trình
          </a>
          <a
            href="#partners"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Đối tác
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Liên hệ
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            Đăng nhập
          </Button>
          <Button size="sm">Đăng ký tư vấn</Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <a
              href="#solutions"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Giải pháp
            </a>
            <a
              href="#programs"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Chương trình
            </a>
            <a
              href="#partners"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Đối tác
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Liên hệ
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm" className="justify-start">
                Đăng nhập
              </Button>
              <Button size="sm">Đăng ký tư vấn</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
