import React from "react";

export function NavBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="nav-btn-item content-stretch flex flex-col items-end justify-center relative shrink-0 cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <p
        className={`font-['Alyamama:Regular'] font-normal leading-normal relative shrink-0 text-[16px] whitespace-nowrap transition-colors duration-200
          group-hover:text-[#0aaf92]
          ${active ? "text-[#0aaf92]" : "text-[#243245]"}`}
        dir="auto"
      >
        {label}
      </p>
      {/* Underline: always shown on active, shown on hover too */}
      <div
        className={`h-px rounded-[5px] bg-[#0aaf92] transition-all duration-200
          group-hover:w-full
          ${active ? "w-full" : "w-0"}`}
      />
    </div>
  );
}

export function TealBtn({
  label,
  large = false,
  fullWidth = false,
  className = "",
  textClassName = "",
  onClick,
}: {
  label: string;
  large?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-lift cta-button border border-[rgba(255,255,255,0)] border-solid content-stretch flex gap-[10px] items-center justify-center overflow-clip relative rounded-[8px] shrink-0 cursor-pointer ${
        fullWidth ? "w-full h-[48px]" : large ? "px-[68px] py-[28px]" : "px-[32px] py-[8px]"
      } ${className}`}
    >
      <div
        aria-hidden
        className="cta-surface absolute inset-0 pointer-events-none rounded-[inherit]"
      />
      <p
        className={`font-['Alyamama:Regular'] font-normal leading-normal relative shrink-0 text-[#243245] whitespace-nowrap ${
          textClassName ? textClassName : large ? "text-[28px]" : "text-[16px]"
        }`}
        dir="auto"
      >
        {label}
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_8px_1px_rgba(255,255,255,0.6)]" />
    </button>
  );
}

export function GhostBtn({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-[rgba(13,233,195,0.1)] hover:bg-[rgba(13,233,195,0.22)] border border-solid border-white hover:border-[#0de9c3]/60 content-stretch flex items-center justify-center overflow-clip px-[24px] py-[4px] relative rounded-[8px] shrink-0 cursor-pointer !shadow-none hover:!shadow-none transition-all duration-200 text-[#0aaf92] hover:text-[#00c69d]"
    >
      <div className="content-stretch flex flex-row gap-[8px] items-center relative shrink-0" dir="rtl">
        <span
          className="font-['Alyamama:Bold'] font-bold leading-normal text-[16px] text-right whitespace-nowrap transition-colors duration-200"
          dir="rtl"
        >
          {label}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 size-[16px] transition-transform duration-200 group-hover:-translate-x-1"
        >
          <path
            d="M12.6667 7.33333H5.22L8.47333 4.08C8.73333 3.82 8.73333 3.39333 8.47333 3.13333C8.21333 2.87333 7.79333 2.87333 7.53333 3.13333L3.14 7.52667C2.88 7.78667 2.88 8.20667 3.14 8.46667L7.53333 12.86C7.79333 13.12 8.21333 13.12 8.47333 12.86C8.73333 12.6 8.73333 12.18 8.47333 11.92L5.22 8.66667H12.6667C13.0333 8.66667 13.3333 8.36667 13.3333 8C13.3333 7.63333 13.0333 7.33333 12.6667 7.33333Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </button>
  );
}
