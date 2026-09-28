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
  const isAutoScrollingRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    const getAboutTarget = () => {
      const about = document.getElementById("about");
      if (about) {
        const rect = about.getBoundingClientRect();
        // 95px offset so the title "لبنة المجتمع" is NOT covered by the navbar
        return Math.max(rect.top + window.scrollY - 95, 0);
      }
      const hero = heroScrollRef.current;
      return hero ? Math.max(hero.offsetHeight - 95, 0) : window.innerHeight;
    };

    // The hero is h-[120vh] with a 100vh viewport → scrollable range = 20vh
    const getHeroScrollEnd = () => {
      const hero = heroScrollRef.current;
      if (!hero) return 0;
      return hero ? Math.max(hero.offsetHeight - window.innerHeight, 0) : 0;
    };

    // Smooth RAF auto-scroll with cubic easing and direct sound synthesis synchronization
    const autoScrollTo = (targetY: number, duration = 2600) => {
      if (isAutoScrollingRef.current) return;
      isAutoScrollingRef.current = true;
      const startY = window.scrollY;
      const diff = targetY - startY;

      if (Math.abs(diff) < 2) {
        window.scrollTo(0, targetY);
        onScrollProgress?.(0);
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

        const soundBell = Math.sin(Math.PI * progress);
        onScrollProgress?.(soundBell);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetY);
          onScrollProgress?.(0);
          setTimeout(() => {
            isAutoScrollingRef.current = false;
          }, 100);
        }
      };

      requestAnimationFrame(step);
    };



    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Fade progress relative to the hero's actual scroll range (~20vh), not aboutTarget
        const heroScrollEnd = Math.max(getHeroScrollEnd(), 1);
        const progress = window.scrollY / heroScrollEnd;
        const clamped = Math.min(Math.max(progress, 0), 1);

        setHeroScrollProgress(clamped);

        if (!isAutoScrollingRef.current) {
          if (clamped <= 0.01 || clamped >= 0.99) {
            onScrollProgress?.(0);
          } else {
            const bellCurve = Math.sin(Math.PI * clamped);
            onScrollProgress?.(bellCurve);
          }
        }

        // Safety snap: only while user is mid-way through the hero scroll zone
        if (clamped > 0.08 && clamped < 0.92 && !isAutoScrollingRef.current) {
          if (snapTimer) clearTimeout(snapTimer);
          snapTimer = setTimeout(() => {
            if (isAutoScrollingRef.current) return;
            const target = clamped < 0.5 ? 0 : getAboutTarget();
            autoScrollTo(target, 1600);
          }, 120);
        }
      });
    };

    // Auto-scroll triggers on wheel
    const onWheel = (e: WheelEvent) => {
      const heroScrollEnd = getHeroScrollEnd();
      const currentY = window.scrollY;

      if (isAutoScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // Within the hero scroll zone → snap to About Us on scroll down
      if (currentY <= heroScrollEnd && e.deltaY > 0) {
        e.preventDefault();
        autoScrollTo(getAboutTarget(), 2600);
        return;
      }

      // Landed at About Us and scrolling up → snap back to hero top
      if (currentY > heroScrollEnd && currentY <= getAboutTarget() + 60 && e.deltaY < 0) {
        e.preventDefault();
        autoScrollTo(0, 2600);
        return;
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
      const heroScrollEnd = getHeroScrollEnd();
      const currentY = window.scrollY;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (Math.abs(deltaY) < 14) return;

      if (currentY <= heroScrollEnd && deltaY > 0) {
        e.preventDefault();
        autoScrollTo(getAboutTarget(), 2600);
      } else if (currentY > heroScrollEnd && currentY <= getAboutTarget() + 60 && deltaY < 0) {
        e.preventDefault();
        autoScrollTo(0, 2600);
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
      const heroScrollEnd = getHeroScrollEnd();
      const currentY = window.scrollY;

      if (["ArrowDown", "PageDown", " "].includes(e.key) && currentY <= heroScrollEnd) {
        e.preventDefault();
        autoScrollTo(getAboutTarget(), 2600);
      } else if (["ArrowUp", "PageUp"].includes(e.key) && currentY > heroScrollEnd && currentY <= getAboutTarget() + 60) {
        e.preventDefault();
        autoScrollTo(0, 2600);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      if (snapTimer) clearTimeout(snapTimer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
      className="h-[120vh] relative shrink-0 w-full"
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
