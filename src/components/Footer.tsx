import React from "react";
import { SOCIAL_LINKS } from "../data/navigationData";
import { useReveal } from "../hooks/useReveal";

const imgFooterLogo = "/assets/33c40.svg";

export function Footer() {
  const refFooter = useReveal<HTMLElement>();

  return (
    <footer
      id="contact"
      ref={refFooter}
      className="reveal bg-[#e8f2f8] content-stretch flex flex-col sm:flex-row items-center justify-between gap-[24px] px-[40px] md:px-[80px] xl:px-[140px] py-[40px] relative shrink-0 w-full"
    >
      {/* Visual Right in RTL: Social icons */}
      <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" dir="ltr">
        {SOCIAL_LINKS.map(({ src, size, alt, href }) => (
          <a
            key={alt}
            href={href}
            aria-label={alt}
            className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer p-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative" style={{ width: size, height: size }}>
              <img
                alt={alt}
                className="absolute block inset-0 max-w-none size-full"
                src={src}
              />
            </div>
          </a>
        ))}
      </div>

      {/* Center logo — pos absolute over the full footer frame, mirrors Figma positioning */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative h-[38.64px] w-[22.94px]">
          <img
            alt="شعار مسجد باب الزوار"
            className="absolute block inset-0 max-w-none size-full"
            src={imgFooterLogo}
          />
        </div>
      </div>

      {/* Visual Left in RTL: Copyright text */}
      <p
        className="font-['Alyamama:Regular'] font-normal leading-normal relative shrink-0 text-[#808080] text-[18px] xl:text-[20px] text-center whitespace-nowrap"
        dir="auto"
      >
        Copyright © 2026 - All rights reserved
      </p>
    </footer>
  );
}
