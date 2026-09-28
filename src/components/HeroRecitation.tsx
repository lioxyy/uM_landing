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
  onScrollProgress?: (p: number) => void;
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
  onScrollProgress,
}: HeroRecitationProps) {
  const heroScrollRef = useRef<HTMLDivElement | null>(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [heroVideoVisible, setHeroVideoVisible] = useState(false);
  const scrollProgressRef = useRef(0);
  const heroBoundsRef = useRef({ sectionStart: 0, distance: 1 });
  const isAutoScrollingRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    const computeBounds = () => {
      const section = heroScrollRef.current;
      if (!section) return;
      const sectionStart = section.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      heroBoundsRef.current = { sectionStart, distance };
    };

    // Smooth RAF auto-scroll with cubic easing
    const autoScrollTo = (targetY: number, duration = 850) => {
      if (isAutoScrollingRef.current) return;
      isAutoScrollingRef.current = true;
      const startY = window.scrollY;
      const diff = targetY - startY;

      if (Math.abs(diff) < 2) {
        window.scrollTo(0, targetY);
        isAutoScrollingRef.current = false;
        return;
      }

      const startTime = performance.now();
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        window.scrollTo(0, startY + diff * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetY);
          setTimeout(() => {
            isAutoScrollingRef.current = false;
          }, 80);
        }
      };

      requestAnimationFrame(step);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = heroScrollRef.current;
        if (!section) return;

        const { sectionStart, distance } = heroBoundsRef.current;
        const progress = (window.scrollY - sectionStart) / distance;
        const clamped = Math.min(Math.max(progress, 0), 1);

        // Velocity for sound — px moved since last frame
        const velocity = Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;

        scrollProgressRef.current = clamped;
        setHeroScrollProgress(clamped);

        if (clamped <= 0.01 || clamped >= 0.99) {
          onScrollProgress?.(0);
        } else {
          // Bell curve: 0 at start, peak at mid-scroll, 0 at end
          const bellCurve = Math.sin(Math.PI * clamped);
          const speedFactor = Math.min(Math.max(velocity / 8, 0.4), 1);
          onScrollProgress?.(bellCurve * speedFactor);
        }

        // Safety snap if user dragged scrollbar and let go midway
        if (clamped > 0.05 && clamped < 0.95 && !isAutoScrollingRef.current) {
          if (snapTimer) clearTimeout(snapTimer);
          snapTimer = setTimeout(() => {
            if (isAutoScrollingRef.current) return;
            const { sectionStart: s, distance: d } = heroBoundsRef.current;
            const target = scrollProgressRef.current < 0.5 ? s : s + d;
            autoScrollTo(target, 600);
          }, 120);
        }
      });
    };

    // Auto-scroll triggers on wheel
    const onWheel = (e: WheelEvent) => {
      const { sectionStart, distance } = heroBoundsRef.current;
      const currentY = window.scrollY;

      if (isAutoScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // Case 1: In the hero top area, scrolling down -> auto-scroll to About Us
      if (currentY < sectionStart + distance * 0.45 && e.deltaY > 0) {
        e.preventDefault();
        autoScrollTo(sectionStart + distance, 850);
        return;
      }

      // Case 2: Near bottom of hero / at About Us, scrolling up -> auto-scroll back to Hero
      if (currentY >= sectionStart + distance * 0.75 && currentY <= sectionStart + distance + 30 && e.deltaY < 0) {
        e.preventDefault();
        autoScrollTo(sectionStart, 850);
        return;
      }

      // Case 3: In the middle of hero
      if (currentY > sectionStart && currentY < sectionStart + distance) {
        e.preventDefault();
        autoScrollTo(e.deltaY > 0 ? sectionStart + distance : sectionStart, 700);
      }
    };

    // Auto-scroll triggers on touch (mobile / tablet / trackpad)
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isAutoScrollingRef.current) {
        e.preventDefault();
        return;
      }
      const { sectionStart, distance } = heroBoundsRef.current;
      const currentY = window.scrollY;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (Math.abs(deltaY) < 14) return;

      if (currentY < sectionStart + distance * 0.45 && deltaY > 0) {
        e.preventDefault();
        autoScrollTo(sectionStart + distance, 850);
      } else if (currentY <= sectionStart + distance + 30 && deltaY < 0) {
        e.preventDefault();
        autoScrollTo(sectionStart, 850);
      }
    };

    // Auto-scroll triggers on arrow keys / space
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAutoScrollingRef.current) {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(e.key)) {
          e.preventDefault();
        }
        return;
      }
      const { sectionStart, distance } = heroBoundsRef.current;
      const currentY = window.scrollY;

      if (["ArrowDown", "PageDown", " "].includes(e.key) && currentY < sectionStart + distance * 0.45) {
        e.preventDefault();
        autoScrollTo(sectionStart + distance, 850);
      } else if (["ArrowUp", "PageUp"].includes(e.key) && currentY <= sectionStart + distance + 30) {
        e.preventDefault();
        autoScrollTo(sectionStart, 850);
      }
    };

    computeBounds();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => { computeBounds(); update(); });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      if (snapTimer) clearTimeout(snapTimer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", computeBounds);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
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
