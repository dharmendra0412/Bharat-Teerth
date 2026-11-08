// Web Audio API authentic Temple Bell / Ghanta sound generator
// Zero external asset downloads, works 100% offline and instantly.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTempleBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic bell frequencies (fundamental + rich brass overtones)
    const freqs = [528, 792, 1056, 1584]; 
    const gains = [0.4, 0.25, 0.15, 0.08];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Strike attack and long resonant exponential decay
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(gains[i], now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  } catch (e) {
    // Graceful fallback if audio is blocked by browser policy
  }
}

