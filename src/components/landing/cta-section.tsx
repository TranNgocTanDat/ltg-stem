"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Blocks } from "lucide-react";
import { Link } from "react-router-dom";


export function CTASection() {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
            <Blocks className="h-5 w-5 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Nền tảng Coding Blocks
            </span>
          </div>

          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
            Trải nghiệm nền tảng lập trình trực quan
          </h2>

          <p className="mt-6 text-pretty text-lg text-primary-foreground/80 leading-relaxed">
            Coding Blocks là nền tảng lập trình kéo thả được LTG Education phát triển, 
            giúp học sinh dễ dàng học lập trình và điều khiển robot. 
            Nhà trường có thể dùng thử miễn phí!
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 text-base"
            >
              <Link to="/home-blockly">
                Dùng thử Coding Blocks
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Đặt lịch demo cho trường
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            Miễn phí dùng thử. Liên hệ để nhận báo giá cho nhà trường.
          </p>
        </div>
      </div>
    </section>
  );
}
