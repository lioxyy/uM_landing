import { useEffect, useRef } from "react";

export type SoundEffect = "appear" | "click" | "leave" | "cta";


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
    noiseGain.gain.linearRampToValueAtTime(0.08, start + 0.6);
    noiseGain.gain.linearRampToValueAtTime(0.055, start + duration * 0.7);
    noiseGain.gain.linearRampToValueAtTime(0, start + duration);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(context.destination);
    noiseSource.start(start);
    noiseSource.stop(start + duration);

    // 2. Detuned drone oscillators — layered celestial pad
    const drones: [number, number, number, number][] = [
      // [freq, detune_cents, attack, volume]
      [174, 0,    0.4, 0.09],
      [261, -8,   0.7, 0.07],
      [349, +12,  1.0, 0.055],
      [523, -5,   1.4, 0.038],
      [174, +18,  0.2, 0.045],
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
    shimmerG.gain.linearRampToValueAtTime(0.025, start + 0.5);
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
    // Transient: 5ms white noise burst
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
    tapGain.gain.setValueAtTime(0.55, start);
    tapGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.022);
    tap.connect(tapFilter);
    tapFilter.connect(tapGain);
    tapGain.connect(context.destination);
    tap.start(start);

    // Body: short sine chirp 900→600 Hz
    const chirp = context.createOscillator();
    const chirpGain = context.createGain();
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(900, start);
    chirp.frequency.exponentialRampToValueAtTime(600, start + 0.06);
    chirpGain.gain.setValueAtTime(0.0001, start);
    chirpGain.gain.linearRampToValueAtTime(0.09, start + 0.004);
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
