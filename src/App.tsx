import React, { useEffect, useRef, useState } from "react";
import { OnboardingSplash, OnboardingPhase } from "./components/OnboardingSplash";
import { Navbar } from "./components/Navbar";
import { HeroRecitation } from "./components/HeroRecitation";
import { AboutSection } from "./components/AboutSection";
import { LibrarySection } from "./components/LibrarySection";
import { ActivitiesSection } from "./components/ActivitiesSection";
import { ArticlesSection } from "./components/ArticlesSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import { useSoundEffects, useCloudScroll } from "./hooks/useSoundEffects";
import { useQuranSync } from "./hooks/useQuranSync";

export default function App() {
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>("ready");
  const [activeNav, setActiveNav] = useState("الرئيسية");

  // Animation phase flags for hero reveal
  const [bgReady, setBgReady] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const [navReady, setNavReady] = useState(false);

  // Sound effects and Quran recitation hooks
  const { sfxContext, appearanceSoundPlayed, playSfx, resumeContext } =
    useSoundEffects();
  const { setCloudGain } = useCloudScroll(sfxContext);
  const {
    isRecitationPlaying,
    recitationReady,
    wordIdx,
    prepareAudio,
    beginRecitation,
    toggleRecitation,
  } = useQuranSync();

  const heroVideo = useRef<HTMLVideoElement | null>(null);
  const heroVideoReady = useRef(false);

  // ── Hero sequence trigger after splash is completed ─────────────────────
  useEffect(() => {
    if (onboardingPhase !== "done") return;

    const t1 = setTimeout(() => setBgReady(true), 100);
    const t2 = setTimeout(() => setTextReady(true), 450);
    const t3 = setTimeout(() => setNavReady(true), 1200);
    const t4 = setTimeout(() => beginRecitation(), 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onboardingPhase]);

  // ── Splash interaction to unlock audio and transition to landing ────────
  function continueToLanding() {
    if (onboardingPhase !== "ready") return;

    resumeContext()
      .then(() => {
        let clickDelay = 0;
        if (!appearanceSoundPlayed.current) {
          playSfx("appear");
          appearanceSoundPlayed.current = true;
          clickDelay = 0.16;
        }
        playSfx("click", clickDelay);
      })
      .catch(() => {});

    // Prime audio within the direct user-gesture call stack
    prepareAudio();
    setOnboardingPhase("hiding");
    window.setTimeout(() => setOnboardingPhase("zooming"), 500);
    window.setTimeout(revealLandingWhenVideoReady, 2400);
  }

  function revealLandingWhenVideoReady() {
    const video = heroVideo.current;
    const beginLeaving = () => {
      if (sfxContext.current?.state === "running") {
        playSfx("leave");
      }
      setOnboardingPhase("leaving");
      window.setTimeout(() => setOnboardingPhase("done"), 700);
    };

    if (
      heroVideoReady.current ||
      (video && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA)
    ) {
      beginLeaving();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      heroVideoReady.current = true;
      beginLeaving();
    };

    video?.addEventListener("canplay", finish, { once: true });
    video?.load();
    window.setTimeout(finish, 2500);
  }

  return (
    <div className="bg-[#f2f8fc] content-stretch flex flex-col items-center relative w-full min-h-screen">
      {/* ── Onboarding Splash Screen (Unlocks Web Audio) ────────────────── */}
      {onboardingPhase !== "done" && (
        <OnboardingSplash
          phase={onboardingPhase}
          onContinue={continueToLanding}
        />
      )}

      {/* ── Fixed Navbar with Mobile Drawer ───────────────────────────── */}
      <Navbar
        navReady={navReady}
        activeNav={activeNav}
        onSelectNav={(label) => setActiveNav(label)}
      />

      {/* ── Hero with Synchronized Quran Recitation ───────────────────── */}
      <HeroRecitation
        bgReady={bgReady}
        textReady={textReady}
        wordIdx={wordIdx}
        isRecitationPlaying={isRecitationPlaying}
        recitationReady={recitationReady}
        onToggleRecitation={toggleRecitation}
        videoRef={heroVideo}
        onVideoCanPlay={() => {
          heroVideoReady.current = true;
        }}
        onScrollProgress={setCloudGain}
      />

      {/* ── Main Content Sections ─────────────────────────────────────── */}
      <main className="content-stretch flex flex-col items-center relative shrink-0 w-full z-10">
        <AboutSection />
        <LibrarySection />
        <ActivitiesSection />
        <ArticlesSection />
        <CtaSection />
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
