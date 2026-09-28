import React from "react";
import { ARTICLES_DATA, ArticleItem } from "../data/contentData";
import { useReveal, useRevealCards } from "../hooks/useReveal";
import { GhostBtn, TealBtn } from "./ui/Buttons";

const imgArticle = "/assets/120cc.png";
const imgCardPattern = "/assets/book-card-pattern.png";

interface ArticleCardProps {
  article: ArticleItem;
}

function ArticleCard({ article }: ArticleCardProps) {
  const { date, title, excerpt, tags } = article;
  const displayTags = [...tags].reverse();

  return (
    <div
      role="button"
      tabIndex={0}
      className="card-lift bg-white border border-[#e2e8f0] rounded-[16px] flex flex-col w-full max-w-[376px] overflow-hidden relative shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-all duration-200 cursor-pointer select-none"
    >
      {/* ── Image Area (top) ────────────────────────────────────── */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-t-[16px] rounded-b-[16px]">
        <img
          alt={title}
          className="w-full h-full object-cover pointer-events-none rounded-b-[16px]"
          src={article.img || imgArticle}
        />
        {/* Date Badge */}
        <div className="absolute top-[17px] right-[18px] z-10 backdrop-blur-md bg-[rgba(42,58,76,0.75)] border border-white/75 px-[16px] py-[5px] rounded-[10px] shadow-[0_2px_6px_rgba(0,0,0,0.18)] flex items-center justify-center">
          <span
            className="font-['Alyamama:Bold'] font-bold text-[16px] leading-tight text-white whitespace-nowrap"
            dir="ltr"
          >
            {date}
          </span>
        </div>
      </div>

      {/* ── Details Area (bottom) ────────────────────────────────── */}
      <div className="relative pt-[22px] pb-[20px] flex flex-col justify-between overflow-hidden bg-white">
        {/* Authentic Islamic Geometric Watermark Pattern PNG */}
        <img
          alt=""
          aria-hidden
          src={imgCardPattern}
          className="absolute left-1/2 top-[115px] -translate-x-1/2 -translate-y-1/2 w-[355px] h-[355px] pointer-events-none object-contain opacity-35 select-none"
        />

        {/* Inner Content (Tags, Title, Excerpt) */}
        <div className="flex flex-col w-full px-[28px] relative z-10" dir="rtl">
          {/* Top: Tags */}
          <div className="flex flex-row gap-[8px] items-center justify-start w-full">
            {displayTags.map((tag) => (
              <div
                key={tag}
                className="bg-[#dbfcf6] px-[16px] py-[4px] rounded-[8px] flex items-center justify-center shrink-0"
              >
                <span
                  className="font-['Alyamama:Bold'] font-bold text-[#0aaf92] text-[13.5px] leading-normal tracking-[0.14px] whitespace-nowrap"
                  dir="rtl"
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>

          {/* Middle: Title & Excerpt */}
          <div className="flex flex-col gap-[10px] items-start w-full mt-[14px]">
            <h3
              className="font-['Khalid_Art_bold:Regular'] text-[#243245] text-[21.5px] leading-snug text-right w-full"
              dir="rtl"
            >
              {title}
            </h3>
            <p
              className="font-['Alyamama:Regular'] font-normal text-[rgba(36,50,69,0.8)] text-[15.5px] leading-[1.68] text-right w-full"
              dir="rtl"
            >
              {excerpt}
            </p>
          </div>
        </div>

        {/* Bottom: Divider & CTA Button */}
        <div className="flex flex-col gap-[16px] items-center w-full px-[18.5px] relative z-10 mt-[20px]">
          <div className="w-full h-px bg-[#eef2f6]" />
          <TealBtn
            label="مطالعة المقال"
            fullWidth
            className="!rounded-[10px]"
            textClassName="text-[22px]"
          />
        </div>
      </div>
    </div>
  );
}

export function ArticlesSection() {
  const refArticles = useReveal();
  const refsArt = useRevealCards(ARTICLES_DATA.length);

  return (
    <section
      id="articles"
      className="content-stretch flex flex-col items-center px-[40px] md:px-[80px] xl:px-[140px] py-[50px] relative shrink-0 w-full"
    >
      <div
        ref={refArticles}
        className="reveal content-stretch flex flex-col gap-[32px] items-center max-w-[1300px] relative shrink-0 w-full"
      >
        <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
          <p
            className="font-['Alyamama:Bold'] font-bold leading-none relative shrink-0 text-[#0aaf92] text-[20px] text-justify whitespace-nowrap"
            dir="auto"
          >
            فكر ومعرفة
          </p>
          <h2
            className="font-['Khalid_Art_bold:Regular'] not-italic flex flex-col justify-center leading-none relative shrink-0 text-[#243245] text-[40px] xl:text-[44px] text-center"
            dir="auto"
          >
            أحدث المقالات
          </h2>
        </div>

        <div className="content-stretch flex flex-col sm:flex-row gap-[20px] items-center sm:items-stretch justify-center relative shrink-0 w-full">
          {ARTICLES_DATA.map((article, i) => (
            <div
              key={article.id}
              ref={(el) => {
                refsArt.current[i] = el;
              }}
              className="reveal-card flex-1 min-w-[280px] max-w-[376px] flex justify-center w-full"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>

        <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
          <GhostBtn label="عرض المزيد" />
        </div>
      </div>
    </section>
  );
}
