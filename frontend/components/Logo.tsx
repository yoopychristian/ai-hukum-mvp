"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: number;
  withText?: boolean;
};

export default function Logo({ size = 28, withText = true }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 select-none">
      <Image src="/icon.svg" alt="AI Hukum" width={size} height={size} priority />
      {withText && (
        <span className="font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">AI Hukum</span>
        </span>
      )}
    </Link>
  );
}


