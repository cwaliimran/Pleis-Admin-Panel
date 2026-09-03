'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// Notification chime
//
// Synthesised rather than loaded from a file: it is two sine tones, so an
// asset would be a binary to ship, cache and 404 on for no gain.
//
// Browsers refuse to make noise until the page has been interacted with, so
// an `AudioContext` starts life suspended. That is handled here — the first
// click or keypress anywhere resumes it — and until it does, `isBlocked`
// says so rather than the sound silently doing nothing.
// ============================================================

/**
 * A rising major triad, each note left ringing under the next so they stack
 * into a chord rather than reading as three separate beeps. Triangle waves
 * carry more harmonics than a sine, which is what makes it sound like a
 * bell and lets it carry across a room at a low volume.
 *
 * Swap the frequencies to retune it: this is C6 → E6 → G6.
 */
const CHIME_NOTES: { frequency: number; startAt: number; duration: number; gain: number }[] = [
  { frequency: 1046.5, startAt: 0, duration: 0.5, gain: 0.9 }, // C6
  { frequency: 1318.51, startAt: 0.09, duration: 0.52, gain: 0.8 }, // E6
  { frequency: 1567.98, startAt: 0.18, duration: 0.75, gain: 1 }, // G6 — the one that lingers
];

const OSCILLATOR_TYPE: OscillatorType = 'triangle';

/** Well below 1 — a notification, not an alarm. */
const PEAK_GAIN = 0.22;

/** Long enough to avoid a click at the edges of the envelope. */
const ATTACK_SECONDS = 0.01;

type AudioContextConstructor = new () => AudioContext;

const getAudioContextCtor = (): AudioContextConstructor | null => {
  if (typeof window === 'undefined') return null;

  return (window.AudioContext || (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext) ?? null;
};

interface UseNotificationSoundArgs {
  /** localStorage key the mute preference is remembered under. */
  storageKey: string;
}

interface UseNotificationSoundReturn {
  play: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  /** The browser has not allowed audio yet — it needs a gesture on the page. */
  isBlocked: boolean;
}

export const useNotificationSound = ({ storageKey }: UseNotificationSoundArgs): UseNotificationSoundReturn => {
  // Starts unmuted so the server and the first client render agree; the
  // stored preference is applied in an effect just below.
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // `play` is called from effects that must not re-run when the preference
  // changes, so it reads the current value through a ref.
  const isMutedRef = useRef(isMuted);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    try {
      setIsMuted(localStorage.getItem(storageKey) === 'true');
    } catch {
      // Private browsing and locked-down profiles can throw on read; the
      // default of "unmuted" is the right thing to fall back to.
    }
  }, [storageKey]);

  const ensureContext = useCallback((): AudioContext | null => {
    if (contextRef.current) return contextRef.current;

    const AudioContextCtor = getAudioContextCtor();
    if (!AudioContextCtor) return null;

    contextRef.current = new AudioContextCtor();
    return contextRef.current;
  }, []);

  // A context created before any interaction is born suspended, so the first
  // gesture anywhere on the page is what actually enables sound.
  useEffect(() => {
    const unlock = () => {
      const context = contextRef.current;
      if (!context || context.state !== 'suspended') return;

      context
        .resume()
        .then(() => setIsBlocked(false))
        .catch(() => {});
    };

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(
    () => () => {
      contextRef.current?.close().catch(() => {});
      contextRef.current = null;
    },
    []
  );

  const play = useCallback(() => {
    if (isMutedRef.current) return;

    const context = ensureContext();
    if (!context) return;

    // Asking is free and often enough; it resolves after this tick, so a
    // first chime with no prior interaction is still reported as blocked.
    if (context.state === 'suspended') context.resume().catch(() => {});

    if (context.state !== 'running') {
      setIsBlocked(true);
      console.warn('[notification-sound] the browser is blocking audio until the page is clicked');
      return;
    }

    setIsBlocked(false);

    CHIME_NOTES.forEach(({ frequency, startAt, duration, gain: noteGain }) => {
      const startTime = context.currentTime + startAt;
      const endTime = startTime + duration;

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = OSCILLATOR_TYPE;
      oscillator.frequency.value = frequency;

      // Struck rather than switched on: a near-instant attack followed by a
      // long exponential decay is what the ear reads as a bell.
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(PEAK_GAIN * noteGain, startTime + ATTACK_SECONDS);
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  }, [ensureContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((current) => {
      const next = !current;

      try {
        localStorage.setItem(storageKey, String(next));
      } catch {
        // Preference is lost on reload, but muting still applies right now.
      }

      return next;
    });
  }, [storageKey]);

  return { play, isMuted, toggleMute, isBlocked };
};
