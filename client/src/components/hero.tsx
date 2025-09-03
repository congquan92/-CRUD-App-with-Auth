"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section>
      <div className="container mx-auto p-2 my-2">
        <div className="bg-muted grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              New Release
            </p>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              Welcome to Our Website
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
              doloremque mollitia fugiat omnis! Porro facilis quo animi
              consequatur. Explicabo.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button>
                Primary
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">Secondary</Button>
            </div>
          </div>
          <div className="relative h-[400px] w-full lg:h-full">
            <Image
              src="https://i.pinimg.com/736x/47/0a/7a/470a7a7f14f5e42985c7d33124a69874.jpg"
              alt="placeholder hero"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
