import React from "react";
import { MOSQUE_INFO } from "../data/contentData";
import { useReveal } from "../hooks/useReveal";
import { GhostBtn } from "./ui/Buttons";

const imgMosque1 = "/assets/89907.png";
const imgMosque2 = "/assets/9cc4f.png";

export function AboutSection() {
  const refAbout = useReveal();
  const refMission = useReveal();

  const { about, mission } = MOSQUE_INFO;

  return (
    <section id="about" className="content-stretch flex flex-col items-center relative shrink-0 w-full" dir="rtl">
      {/* ── About Us: لبنة المجتمع (Text Right, Image Left) ────────── */}
      <div className="content-stretch flex flex-col items-center px-[40px] md:px-[80px] xl:px-[140px] py-[64px] relative shrink-0 w-full">
        <div
          ref={refAbout}
          className="reveal content-stretch flex flex-col xl:flex-row gap-[48px] xl:gap-[82px] items-center justify-between max-w-[1300px] relative shrink-0 w-full"
        >
          {/* Visual Right in RTL: Text */}
          <div className="content-stretch flex flex-col gap-[28px] items-start text-right relative shrink-0 max-w-[508px] w-full" dir="rtl">
            <div className="content-stretch flex flex-col gap-[20px] items-start text-right relative shrink-0 w-full">
              <h2
                className="font-['Khalid_Art_bold:Regular'] not-italic leading-none relative shrink-0 text-[#243245] text-[40px] xl:text-[44px] text-right w-full"
                dir="rtl"
              >
                {about.heading}
              </h2>
              <p
                className="font-['Alyamama:Regular'] font-normal leading-[2] relative shrink-0 text-[20px] xl:text-[24px] text-[rgba(36,50,69,0.8)] text-right w-full"
                dir="rtl"
              >
                {about.description}
              </p>
            </div>
            <GhostBtn label="تعرف علينا" />
          </div>

          {/* Visual Left in RTL: Image card with floating quote */}
          <div className="flex-1 min-w-0 h-[422px] relative w-full max-w-[570px]">
            <div className="absolute bg-white content-stretch flex items-center justify-center left-0 overflow-clip p-[16px] right-0 rounded-[8px] top-1/2 -translate-y-1/2 h-[400px]">
              <div className="flex flex-1 h-full items-center justify-center min-w-px relative overflow-clip rounded-[4px]">
                <img
                  alt="مسجد جامعة باب الزوار"
                  className="w-full h-full object-cover"
                  src={imgMosque1}
                />
              </div>
            </div>
            {/* Floating card overhangs to the left */}
            <div className="absolute backdrop-blur-md bg-white/75 border border-solid border-white/80 bottom-[-14.79px] left-[-20px] xl:left-[-43px] content-stretch flex flex-col gap-[12px] items-start text-right overflow-clip p-[16px] rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] max-w-[300px]" dir="rtl">
              <p
                className="font-['Alyamama:Bold'] font-bold leading-none min-w-full relative shrink-0 text-[#243245] text-[20px] xl:text-[24px] text-right"
                dir="rtl"
              >
                {about.cardTitle}
              </p>
              <p
                className="font-['Alyamama_SemiBold:Regular'] leading-[1.5] not-italic relative shrink-0 text-[14px] text-[rgba(36,50,69,0.8)] w-[240px] xl:w-[268px] text-right"
                dir="rtl"
              >
                {about.cardQuote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mission: رسالة علمية وإيمانية (Image Right, Text Left) ── */}
      <div className="bg-[#e8f2f8] content-stretch flex flex-col items-center px-[40px] md:px-[80px] xl:px-[140px] py-[64px] relative shrink-0 w-full">
        <div
          ref={refMission}
          className="reveal content-stretch flex flex-col xl:flex-row gap-[48px] xl:gap-[82px] items-start justify-between max-w-[1300px] relative shrink-0 w-full"
        >
          {/* Visual Right in RTL: Image card with floating quote */}
          <div className="flex-1 min-w-0 relative self-stretch w-full min-h-[400px] max-w-[570px]">
            <div className="absolute bg-white content-stretch flex items-center justify-center left-0 overflow-clip p-[16px] right-0 rounded-[8px] top-1/2 -translate-y-1/2 h-[400px]">
              <div className="flex flex-1 h-full items-center justify-center min-w-px relative overflow-clip rounded-[4px]">
                <img
                  alt="جامعة باب الزوار"
                  className="w-full h-full object-cover"
                  src={imgMosque2}
                />
              </div>
            </div>
            {/* Floating card overhangs to the right */}
            <div className="absolute backdrop-blur-md bg-white/75 border border-solid border-white/80 bottom-[3px] right-[-20px] xl:right-[-53px] content-stretch flex flex-col gap-[8px] items-start text-right overflow-clip p-[16px] rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] max-w-[300px]" dir="rtl">
              <p
                className="font-['Alyamama:Bold'] font-bold leading-none relative shrink-0 text-[#243245] text-[20px] xl:text-[24px] whitespace-nowrap text-right"
                dir="rtl"
              >
                {mission.cardTitle}
              </p>
              <p
                className="font-['Alyamama_SemiBold:Regular'] leading-[1.5] not-italic relative shrink-0 text-[14px] text-[rgba(36,50,69,0.8)] w-[240px] xl:w-[268px] text-right"
                dir="rtl"
              >
                {mission.cardQuote}
              </p>
            </div>
          </div>

          {/* Visual Left in RTL: Text with stats */}
          <div className="content-stretch flex flex-col gap-[40px] items-start text-right pt-[24px] relative shrink-0 max-w-[508px] w-full" dir="rtl">
            <div className="content-stretch flex flex-col gap-[28px] items-start text-right relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[20px] items-start text-right relative shrink-0 w-full">
                <h2
                  className="font-['Khalid_Art_bold:Regular'] not-italic leading-none relative shrink-0 text-[#243245] text-[40px] xl:text-[44px] text-right w-full"
                  dir="rtl"
                >
                  {mission.heading}
                </h2>
                <p
                  className="font-['Alyamama:Regular'] font-normal leading-[2] relative shrink-0 text-[20px] xl:text-[24px] text-[rgba(36,50,69,0.8)] text-right w-full whitespace-pre-wrap"
                  dir="rtl"
                >
                  {mission.description}
                </p>
              </div>
              <div className="font-['Alyamama:Bold'] font-bold content-stretch flex gap-[84px] items-center justify-start leading-none relative shrink-0 text-right w-full whitespace-nowrap" dir="rtl">
                {mission.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="content-stretch flex flex-col gap-[8px] items-start text-right min-w-px relative"
                    dir="rtl"
                  >
                    <p className="relative shrink-0 text-[#0aaf92] text-[32px] text-right" dir="rtl">
                      {stat.count}
                    </p>
                    <p className="relative shrink-0 text-[#243245] text-[24px] text-right" dir="rtl">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <GhostBtn label="عرض المزيد" />
          </div>
        </div>
      </div>
    </section>
  );
}
