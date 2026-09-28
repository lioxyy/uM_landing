import React, { useEffect, useRef } from "react";

export type SoundEffect = "appear" | "click" | "leave" | "cta" | "cloud";


export function playSoundEffect(
  context: AudioContext,
  sound: SoundEffect,
  delay = 0,
) {
  if (context.state === "closed") return;

  const start = context.currentTime + delay;

  // ── APPEAR — immersive cloud / celestial atmospheric pad ─────────────────
  if (sound === "appear") {
    const duration = 3.2;
    const sr = context.sampleRate;

    // 1. Filtered noise layer (airy texture)
    const noiseFrames = Math.ceil(sr * duration);
    const noiseBuf = context.createBuffer(1, noiseFrames, sr);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseFrames; i++) nd[i] = Math.random() * 2 - 1;

    const noiseSource = context.createBufferSource();
    noiseSource.buffer = noiseBuf;
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(600, start);
    noiseFilter.frequency.linearRampToValueAtTime(1800, start + duration * 0.5);
    noiseFilter.frequency.linearRampToValueAtTime(400, start + duration);
    noiseFilter.Q.value = 0.6;
    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0, start);
    noiseGain.gain.linearRampToValueAtTime(0.02, start + 0.6);
    noiseGain.gain.linearRampToValueAtTime(0.014, start + duration * 0.7);
    noiseGain.gain.linearRampToValueAtTime(0, start + duration);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(context.destination);
    noiseSource.start(start);
    noiseSource.stop(start + duration);

    // 2. Detuned drone oscillators — layered celestial pad (gentle volume)
    const drones: [number, number, number, number][] = [
      // [freq, detune_cents, attack, volume]
      [174, 0,    0.4, 0.022],
      [261, -8,   0.7, 0.016],
      [349, +12,  1.0, 0.012],
      [523, -5,   1.4, 0.008],
      [174, +18,  0.2, 0.010],
    ];

    drones.forEach(([freq, detune, attack, vol]) => {
      const osc = context.createOscillator();
      const g = context.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(vol, start + attack);
      g.gain.linearRampToValueAtTime(vol * 0.8, start + duration * 0.65);
      g.gain.linearRampToValueAtTime(0, start + duration);
      osc.connect(g);
      g.connect(context.destination);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    });

    // 3. High shimmer — brief octave-up sine swell
    const shimmer = context.createOscillator();
    const shimmerG = context.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1046, start);
    shimmer.frequency.linearRampToValueAtTime(1320, start + 1.2);
    shimmerG.gain.setValueAtTime(0, start);
    shimmerG.gain.linearRampToValueAtTime(0.006, start + 0.5);
    shimmerG.gain.linearRampToValueAtTime(0, start + 2.0);
    shimmer.connect(shimmerG);
    shimmerG.connect(context.destination);
    shimmer.start(start);
    shimmer.stop(start + 2.2);

    return;
  }


  // ── LEAVE — airy sweep out (existing behaviour, kept) ────────────────────
  if (sound === "leave") {
    const duration = 1.45;
    const frameCount = Math.ceil(context.sampleRate * duration);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < frameCount; i++) {
      const noise = Math.random() * 2 - 1;
      previous = previous * 0.965 + noise * 0.035;
      samples[i] = previous;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(1300, start);
    filter.frequency.exponentialRampToValueAtTime(220, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.055, start + duration * 0.28);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(start);
    source.stop(start + duration);
    return;
  }

  // ── CLICK — crisp physical tap ───────────────────────────────────────────
  if (sound === "click") {
    // Transient: 5ms white noise burst (subtle tap)
    const tapFrames = Math.ceil(context.sampleRate * 0.005);
    const tapBuf = context.createBuffer(1, tapFrames, context.sampleRate);
    const td = tapBuf.getChannelData(0);
    for (let i = 0; i < tapFrames; i++) td[i] = Math.random() * 2 - 1;
    const tap = context.createBufferSource();
    const tapFilter = context.createBiquadFilter();
    const tapGain = context.createGain();
    tap.buffer = tapBuf;
    tapFilter.type = "highpass";
    tapFilter.frequency.value = 2200;
    tapGain.gain.setValueAtTime(0.12, start);
    tapGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.022);
    tap.connect(tapFilter);
    tapFilter.connect(tapGain);
    tapGain.connect(context.destination);
    tap.start(start);

    // Body: short gentle sine chirp 900→600 Hz
    const chirp = context.createOscillator();
    const chirpGain = context.createGain();
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(900, start);
    chirp.frequency.exponentialRampToValueAtTime(600, start + 0.06);
    chirpGain.gain.setValueAtTime(0.0001, start);
    chirpGain.gain.linearRampToValueAtTime(0.035, start + 0.004);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
    chirp.connect(chirpGain);
    chirpGain.connect(context.destination);
    chirp.start(start);
    chirp.stop(start + 0.09);
    return;
  }

  // ── CTA — existing upward chime ──────────────────────────────────────────
  const settings = { from: 540, to: 760, duration: 0.14, volume: 0.09 };
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(settings.from, start);
  oscillator.frequency.exponentialRampToValueAtTime(settings.to, start + settings.duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(settings.volume, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + settings.duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + settings.duration + 0.02);
}


export function useSoundEffects() {
  const sfxContext = useRef<AudioContext | null>(null);
  const appearanceSoundPlayed = useRef(false);

  useEffect(() => {
    const context = new AudioContext();
    sfxContext.current = context;

    if (context.state === "running") {
      playSoundEffect(context, "appear");
      appearanceSoundPlayed.current = true;
    }

    return () => {
      context.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const handleCtaClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(".cta-button")) return;

      const context = sfxContext.current;
      if (!context) return;
      context
        .resume()
        .then(() => playSoundEffect(context, "cta"))
        .catch(() => {});
    };

    document.addEventListener("click", handleCtaClick);
    return () => document.removeEventListener("click", handleCtaClick);
  }, []);

  const playSfx = (sound: SoundEffect, delay = 0) => {
    const context = sfxContext.current;
    if (!context) return;

    if (context.state === "suspended") {
      context
        .resume()
        .then(() => playSoundEffect(context, sound, delay))
        .catch(() => {});
    } else {
      playSoundEffect(context, sound, delay);
    }
  };

  const resumeContext = async () => {
    const context = sfxContext.current;
    if (context && context.state === "suspended") {
      await context.resume();
    }
  };

  return {
    sfxContext,
    appearanceSoundPlayed,
    playSfx,
    resumeContext,
  };
}

// ── useCloudScroll — ultra-soothing celestial ambient chime ───────────────────
// A whisper-soft, meditative glass-pad resonance (216Hz, 324Hz, 432Hz, 648Hz)
// with delicate slow shimmer and zero harsh noise. Extremely gentle & soothing.
export function useCloudScroll(ctxRef: React.MutableRefObject<AudioContext | null>) {
  const masterGain   = useRef<GainNode | null>(null);
  const started      = useRef(false);
  const nodes        = useRef<AudioNode[]>([]);
  const silenceTimer = useRef<number | null>(null);

  const start = (context: AudioContext) => {
    if (started.current) return;
    started.current = true;

    const master = context.createGain();
    master.gain.setValueAtTime(0, context.currentTime);
    master.connect(context.destination);
    masterGain.current = master;

    // 1. Warm meditative foundation — pure sine 216 Hz (A3)
    const osc1 = context.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 216.0;
    const osc1Gain = context.createGain();
    osc1Gain.gain.value = 0.018;
    osc1.connect(osc1Gain);
    osc1Gain.connect(master);
    osc1.start();

    // 2. Harmonious fifth — 324 Hz (E4)
    const osc2 = context.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 324.0;
    const osc2Gain = context.createGain();
    osc2Gain.gain.value = 0.014;
    osc2.connect(osc2Gain);
    osc2Gain.connect(master);
    osc2.start();

    // 3. Sacred chime tone — 432 Hz (A4)
    const osc3 = context.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 432.0;
    const osc3Gain = context.createGain();
    osc3Gain.gain.value = 0.011;
    osc3.connect(osc3Gain);
    osc3Gain.connect(master);
    osc3.start();

    // 4. Subtle shimmer overtone — 433.2 Hz (gentle +1.2Hz organic chorus beat)
    const osc4 = context.createOscillator();
    osc4.type = "sine";
    osc4.frequency.value = 433.2;
    const osc4Gain = context.createGain();
    osc4Gain.gain.value = 0.009;
    osc4.connect(osc4Gain);
    osc4Gain.connect(master);
    osc4.start();

    // 5. Crystalline bell harmonic — 648 Hz (E5)
    const osc5 = context.createOscillator();
    osc5.type = "sine";
    osc5.frequency.value = 648.0;
    const osc5Gain = context.createGain();
    osc5Gain.gain.value = 0.005;
    osc5.connect(osc5Gain);
    osc5Gain.connect(master);
    osc5.start();

    nodes.current = [osc1, osc2, osc3, osc4, osc5, osc1Gain, osc2Gain, osc3Gain, osc4Gain, osc5Gain, master];
  };

  const setCloudGain = (p: number) => {
    const context = ctxRef.current;
    if (!context) return;
    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }
    if (p > 0.005 && !started.current && context.state === "running") {
      start(context);
    }
    const g = masterGain.current;
    if (!g) return;

    if (silenceTimer.current) {
      window.clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }

    if (p <= 0.02) {
      g.gain.setTargetAtTime(0, context.currentTime, 0.04);
      return;
    }

    // Direct soothing scaling: peak master gain is gentle (0.45)
    const target = Math.min(Math.max(p, 0), 1) * 0.45;
    g.gain.setTargetAtTime(target, context.currentTime, 0.06);

    // Auto-silence when scrolling pauses for more than 75ms
    silenceTimer.current = window.setTimeout(() => {
      if (masterGain.current && context.state === "running") {
        masterGain.current.gain.setTargetAtTime(0, context.currentTime, 0.08);
      }
    }, 75);
  };

  const stop = () => {
    if (silenceTimer.current) {
      window.clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    nodes.current.forEach(n => {
      try { (n as AudioScheduledSourceNode).stop?.(); } catch (_) {}
    });
    masterGain.current?.disconnect();
    nodes.current = [];
    started.current = false;
    masterGain.current = null;
  };

  return { setCloudGain, stop };
}
