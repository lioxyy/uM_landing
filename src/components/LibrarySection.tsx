import React from "react";
import { BOOKS_DATA, BookItem } from "../data/contentData";
import { useReveal, useRevealCards } from "../hooks/useReveal";
import { GhostBtn, TealBtn } from "./ui/Buttons";

const imgBook = "/assets/d420b.png";
const imgUserIcon = "/assets/d2393.svg";
const imgCardPattern = "/assets/book-card-pattern.png";

interface BookCardProps {
  book: BookItem;
}

function BookCard({ book }: BookCardProps) {
  const { available, title, author, tags } = book;
  const displayTags = [...tags].reverse();

  return (
    <div
      role="button"
      tabIndex={0}
      className="card-lift bg-white border border-[#e2e8f0] rounded-[16px] flex flex-col h-[389px] w-full max-w-[278px] overflow-hidden relative shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-all duration-200 cursor-pointer select-none"
    >
      {/* ── Image Area (top) ────────────────────────────────────── */}
      <div className="relative h-[204px] w-full shrink-0 overflow-hidden rounded-t-[16px] rounded-b-[16px]">
        <img
          alt={title}
          className="w-full h-full object-cover pointer-events-none rounded-b-[16px]"
          src={book.coverImg || imgBook}
        />
        {/* Availability Badge */}
        <div className="absolute top-[14px] right-[14px] z-10 select-none pointer-events-none">
          {available ? (
            <img
              alt="متوفر"
              src="/assets/badge-available.png"
              className="h-[29px] w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.14)]"
            />
          ) : (
            <div className="h-[29px] px-[12px] rounded-[7px] bg-[#d97706] border border-[#f59e0b]/40 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.14)]">
              <span
                className="font-['Alyamama:Bold'] font-bold text-[13px] leading-none text-white whitespace-nowrap"
                dir="rtl"
              >
                غير متوفر
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Details Area (bottom) ────────────────────────────────── */}
      <div className="relative flex-1 px-[20px] pt-[16px] pb-[18px] flex flex-col justify-between overflow-hidden bg-white">
        {/* Authentic Islamic Geometric Watermark Pattern PNG */}
        <img
          alt=""
          aria-hidden
          src={imgCardPattern}
          className="absolute -left-[20px] top-[8px] w-[235px] h-[235px] pointer-events-none object-contain opacity-35"
        />

        {/* Top: Tags */}
        <div className="flex flex-row gap-[8px] items-center justify-start w-full relative z-10" dir="rtl">
          {displayTags.map((tag) => (
            <div
              key={tag}
              className="bg-[#dbfcf6] px-[12px] py-[3.5px] rounded-[8px] flex items-center justify-center shrink-0"
            >
              <span
                className="font-['Alyamama:Bold'] font-bold text-[#0aaf92] text-[13px] leading-normal tracking-[0.14px] whitespace-nowrap"
                dir="rtl"
              >
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Middle: Title & Author */}
        <div className="flex flex-col gap-[4px] items-start w-full relative z-10" dir="rtl">
          <h3
            className="font-['Alyamama:Bold'] font-bold text-[#243245] text-[18px] leading-none text-right w-full"
            dir="rtl"
          >
            {title}
          </h3>
          {/* Author row in RTL: Icon on right, author text to its left */}
          <div className="flex flex-row items-center justify-start gap-[6px] w-full text-[rgba(36,50,69,0.7)]" dir="rtl">
            <img
              alt=""
              className="size-[15px] shrink-0 opacity-70"
              src={imgUserIcon}
            />
            <span
              className="font-['Alyamama:Regular'] font-normal text-[14px] leading-none text-right truncate"
              dir="rtl"
            >
              {author}
            </span>
          </div>
        </div>

        {/* Bottom: Divider & CTA Button */}
        <div className="flex flex-col gap-[14px] items-center w-full relative z-10">
          <div className="w-full h-px bg-[#eef2f6]" />
          <TealBtn label="تفاصيل الكتاب" fullWidth />
        </div>
      </div>
    </div>
  );
}

export function LibrarySection() {
  const refBooks = useReveal();
  const refsBooks = useRevealCards(BOOKS_DATA.length);

  return (
    <section
      id="library"
      className="content-stretch flex flex-col items-center px-[40px] md:px-[80px] xl:px-[140px] py-[50px] relative shrink-0 w-full"
      dir="rtl"
    >
      <div
        ref={refBooks}
        className="reveal content-stretch flex flex-col gap-[32px] items-center justify-center max-w-[1300px] relative shrink-0 w-full"
      >
        <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 text-center w-full" dir="rtl">
          <p
            className="font-['Alyamama:Bold'] font-bold leading-none relative shrink-0 text-[#0aaf92] text-[20px] whitespace-nowrap text-center"
            dir="rtl"
          >
            مجموعة مختارة
          </p>
          <h2
            className="font-['Khalid_Art_bold:Regular'] not-italic flex flex-col justify-center leading-none relative shrink-0 text-[#243245] text-[40px] xl:text-[44px] text-center"
            dir="rtl"
          >
            أحدث إصدارات المكتبة
          </h2>
        </div>

        <div className="content-stretch flex flex-wrap gap-[16px] items-stretch justify-center relative shrink-0 w-full">
          {BOOKS_DATA.map((book, i) => (
            <div
              key={book.id}
              ref={(el) => {
                refsBooks.current[i] = el;
              }}
              className="reveal-card flex-1 min-w-[220px] max-w-[278px]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>

        <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
          <GhostBtn label="عرض الفهرس الكامل" />
        </div>
      </div>
    </section>
  );
}
