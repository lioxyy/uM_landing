import React, { useEffect, useRef, useState } from "react";
import { WORDS } from "../data/quranData";

const imgHeroVideo = "/assets/hero-video.mp4";
const imgHeroBg = "/assets/89907.png";
const imgMaskHero = "/assets/3ffe4.svg";
const imgHeading = "/assets/08051.svg";

interface HeroRecitationProps {
  bgReady: boolean;
  textReady: boolean;
  wordIdx: number;
  isRecitationPlaying: boolean;
  recitationReady: boolean;
  onToggleRecitation: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onVideoCanPlay?: () => void;
}

export function HeroRecitation({
  bgReady,
  textReady,
  wordIdx,
  isRecitationPlaying,
  recitationReady,
  onToggleRecitation,
  videoRef,
  onVideoCanPlay,
}: HeroRecitationProps) {
  const heroScrollRef = useRef<HTMLDivElement | null>(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [heroVideoVisible, setHeroVideoVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = heroScrollRef.current;
        if (!section) return;

        const start = section.getBoundingClientRect().top + window.scrollY;
        const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = (window.scrollY - start) / distance;
        setHeroScrollProgress(Math.min(Math.max(progress, 0), 1));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const heroFadeP =
    heroScrollProgress * heroScrollProgress * (3 - 2 * heroScrollProgress);
  const cloudP = heroFadeP;

  return (
    <div
      id="hero"
      ref={heroScrollRef}
      className="h-[170vh] relative shrink-0 w-full"
    >
      <div className="bg-[#f2f8fc] content-stretch flex flex-col h-screen items-center sticky top-0 w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* ── VIDEO background with bottom-fade mask + Ken Burns ──── */}
          <div
            className={`absolute inset-0 ${
              bgReady ? "hero-bg-playing" : "opacity-0"
            }`}
            style={{ transformOrigin: "center center" }}
          >
            {/* Apply the 3ffe4.svg bottom-fade gradient mask to the video */}
            <div
              className="absolute inset-0"
              style={{
                maskImage: `url("${imgMaskHero}")`,
                maskRepeat: "no-repeat",
                maskSize: "100% 100%",
                maskPosition: "0 0",
              }}
            >
              <video
                autoPlay
                ref={videoRef}
                muted
                loop
                playsInline
                preload="auto"
                poster={imgHeroBg}
                onCanPlay={() => {
                  setHeroVideoVisible(true);
                  onVideoCanPlay?.();
                }}
                className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-1000 ${
                  heroVideoVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={imgHeroVideo} type="video/mp4" />
                {/* Fallback poster image if video cannot play */}
                <img
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                  src={imgHeroBg}
                />
              </video>
            </div>
          </div>

          {/* ── Hue blend overlay (dark navy, 60% opacity) ─────────────── */}
          <div
            className="absolute inset-0 bg-[#243245] opacity-60"
            style={{ mixBlendMode: "hue" }}
          />

          {/* ── Quranic text + heading ─────────────────────────────────── */}
          <div
            className={`absolute content-stretch flex flex-col gap-[24px] items-center pb-[16px] pt-[40px] px-[32px] rounded-[8px]
              ${textReady ? "hero-text-visible" : "opacity-0"}`}
            style={{
              bottom: "367.18px",
              left: "5vw",
              right: "5vw",
              top: "110px",
            }}
          >
            {/* small path heading */}
            <div className="h-[24.034px] relative shrink-0 w-[175.734px]">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgHeading}
              />
            </div>

            {/* Quranic verse with word-by-word highlighting */}
            <p
              className="leading-[1.84] relative shrink-0 text-[#243245] text-center"
              dir="auto"
              style={{
                fontFamily:
                  "'KFGQPC Uthmanic Script HAFS:Regular', 'Scheherazade New', serif",
                fontSize: "clamp(22px, 2.5vw, 40px)",
                maxWidth: "1128px",
              }}
            >
              {WORDS.map((w, i) => {
                const isDone = i < wordIdx;
                const isActive = i === wordIdx;
                let cls = "qword";
                if (isActive) cls += " qword--active";
                else if (isDone) cls += " qword--done";
                const baseColor = w.allah ? "#0de9c3" : "#243245";
                return (
                  <span
                    key={i}
                    className={cls}
                    style={{
                      color: isDone || isActive ? "#0de9c3" : baseColor,
                    }}
                  >
                    {w.t}{" "}
                  </span>
                );
              })}
              <span
                style={{
                  fontFamily:
                    "'KFGQPC Uthmanic Script HAFS:Regular', 'Scheherazade New', serif",
                  fontSize: "clamp(14px, 1.6vw, 24px)",
                  color: "#243245",
                }}
              >
                [النور: ٣٦]
              </span>
            </p>

            <button
              aria-label={
                isRecitationPlaying ? "إيقاف التلاوة مؤقتًا" : "تشغيل التلاوة"
              }
              className="quran-audio-control"
              disabled={!recitationReady}
              onClick={onToggleRecitation}
              type="button"
            >
              {isRecitationPlaying ? (
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M7.5 5.5v13M16.5 5.5v13" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m9 6 9 6-9 6V6Z" />
                </svg>
              )}
            </button>
          </div>

          {/* ── Cloudy scroll-out overlay ──────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              backdropFilter: cloudP > 0.05 ? `blur(${cloudP * 16}px)` : "none",
              backgroundColor: `rgba(242,248,252,${cloudP})`,
              backgroundImage: `radial-gradient(ellipse 160% 120% at 50% 110%, rgba(242,248,252,${
                cloudP * 0.92
              }) 0%, rgba(255,255,255,${cloudP * 0.55}) 60%, transparent 100%)`,
            }}
          />
          {/* Soft gradient blending into page body */}
          <div className="absolute bottom-0 inset-x-0 h-[120px] pointer-events-none bg-gradient-to-t from-[#f2f8fc] to-transparent z-20" />
        </div>
      </div>
    </div>
  );
}
