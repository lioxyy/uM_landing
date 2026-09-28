import React from "react";
import { ACTIVITIES_DATA, ActivityItem } from "../data/contentData";
import { useReveal, useRevealCards } from "../hooks/useReveal";
import { GhostBtn } from "./ui/Buttons";


interface ActivityCardProps {
  activity: ActivityItem;
}

function ActivityCard({ activity }: ActivityCardProps) {
  const { title, desc, img, featured, badge } = activity;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`card-lift flex flex-col justify-end overflow-hidden relative rounded-[12px] w-full select-none cursor-pointer transition-all duration-300 ${
        featured ? "h-full min-h-[460px] p-[24px]" : "h-[220px] p-[20px]"
      }`}
    >
      <img
        alt={title}
        className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full transition-transform duration-500 hover:scale-[1.03]"
        src={img}
      />
      {/* Dark gradient overlay - crystal clear top, rich readable bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#243245] via-[#243245]/70 via-50% to-transparent pointer-events-none rounded-[12px]" />

      {/* Top right circular outward arrow button for non-featured cards */}
      {!featured && (
        <div className="absolute top-[16px] right-[16px] z-10 size-[34px] rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] cursor-pointer">
          <img
            alt=""
            className="size-full object-contain pointer-events-none"
            src="/assets/btn-outward.png"
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col gap-[8px] items-start w-full relative z-10" dir="rtl">
        {/* Badge on featured card, right above title */}
        {badge && (
          <div className="bg-[#0de9c3] px-[10px] py-[3px] rounded-[6px] flex items-center justify-center mb-[2px]">
            <span
              className="font-['Alyamama:Bold'] font-bold text-[#243245] text-[12px] leading-tight whitespace-nowrap"
              dir="rtl"
            >
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className={`font-['Khalid_Art_bold:Regular'] text-white text-right leading-tight w-full ${
            featured ? "text-[28px] xl:text-[32px]" : "text-[22px]"
          }`}
          dir="rtl"
        >
          {title}
        </h3>

        {/* Description & Hadith */}
        {desc && (
          <p
            className="font-['Alyamama:Regular'] font-normal text-white/85 text-[14px] leading-relaxed text-right w-full"
            dir="rtl"
          >
            {desc}
            <br />
            {`قال رسول `}
            <span className="text-[#0de9c3] font-medium">الله</span>
            {` صلى `}
            <span className="text-[#0de9c3] font-medium">الله</span>
            {` عليه وسلم : " خيركم من تعلم القرآن وعلمه"`}
          </p>
        )}

        {/* Featured Actions */}
        {featured && (
          <div className="flex flex-row gap-[14px] items-center w-full pt-[6px]" dir="rtl">
            {/* Visual Right in RTL: سجل الآن */}
            <button
              type="button"
              className="flex-1 h-[42px] rounded-[8px] bg-[#1f6a6b] hover:bg-[#258284] border border-[#0de9c3]/50 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.98]"
            >
              <span className="font-['Alyamama:Bold'] font-bold text-[16px] text-[#f2f8fc] leading-none whitespace-nowrap">
                سجل الآن
              </span>
            </button>

            {/* Visual Left in RTL: التفاصيل */}
            <button
              type="button"
              className="flex-1 h-[42px] rounded-[8px] bg-[#455161] hover:bg-[#526073] border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.98]"
            >
              <span className="font-['Alyamama:Bold'] font-bold text-[16px] text-[#f2f8fc] leading-none whitespace-nowrap">
                التفاصيل
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivitiesSection() {
  const refActiv = useReveal();
  const refsAct = useRevealCards(3);

  const { list, featured } = ACTIVITIES_DATA;

  return (
    <section
      id="activities"
      className="bg-[#e8f2f8] content-stretch flex flex-col items-center px-[40px] md:px-[80px] xl:px-[140px] py-[50px] relative shrink-0 w-full"
      dir="rtl"
    >
      <div
        ref={refActiv}
        className="reveal content-stretch flex flex-col gap-[32px] items-center max-w-[1300px] overflow-clip relative shrink-0 w-full"
      >
        <div className="content-stretch flex flex-col gap-[12px] items-center leading-none relative shrink-0 text-center w-full" dir="rtl">
          <p
            className="font-['Alyamama:Bold'] font-bold relative shrink-0 text-[#0aaf92] text-[20px] whitespace-nowrap text-center"
            dir="rtl"
          >
            نشاطاتنا
          </p>
          <h2
            className="font-['Khalid_Art_bold:Regular'] not-italic relative shrink-0 text-[#243245] text-[40px] xl:text-[44px] text-center"
            dir="rtl"
          >
            نشاطات دعوية وتعليمية واجتماعية
          </h2>
        </div>

        {/* In RTL: Child 1 (Featured) is visual RIGHT, Child 2 (3-cards) is visual LEFT */}
        <div className="content-stretch flex flex-col lg:flex-row gap-[16px] items-stretch relative shrink-0 w-full" dir="rtl">
          {/* Visual Right in RTL: Featured Card ("حلقات القرآن") */}
          <div className="flex-1 min-h-[460px]">
            <ActivityCard activity={featured} />
          </div>

          {/* Visual Left in RTL: Column of 3 cards */}
          <div className="flex flex-1 flex-col items-stretch gap-[16px]">
            {/* Top card: مكتبة */}
            <div
              ref={(el) => {
                refsAct.current[0] = el;
              }}
              className="reveal-card w-full"
              style={{ transitionDelay: "0s" }}
            >
              <ActivityCard activity={list[0]} />
            </div>

            {/* Bottom row: in RTL, child 1 (المسابقة الرمضانية) is visual right, child 2 (نشاط مسعى) is visual left */}
            <div className="flex flex-col sm:flex-row gap-[16px] w-full" dir="rtl">
              <div
                ref={(el) => {
                  refsAct.current[2] = el;
                }}
                className="reveal-card flex-1"
                style={{ transitionDelay: "0.2s" }}
              >
                <ActivityCard activity={list[2]} />
              </div>
              <div
                ref={(el) => {
                  refsAct.current[1] = el;
                }}
                className="reveal-card flex-1"
                style={{ transitionDelay: "0.1s" }}
              >
                <ActivityCard activity={list[1]} />
              </div>
            </div>
          </div>
        </div>

        <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
          <GhostBtn label="عرض المزيد" />
        </div>
      </div>
    </section>
  );
}
