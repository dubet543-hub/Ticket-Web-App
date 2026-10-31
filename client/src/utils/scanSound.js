let audioCtx = null;

// Short beep for gate staff: one high tone when entry is allowed, two low tones when denied
export const playScanSound = (allowed) => {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const tones = allowed ? [[880, 0]] : [[220, 0], [220, 0.22]];
    tones.forEach(([freq, delay]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = audioCtx.currentTime + delay;
      osc.frequency.value = freq;
      osc.type = allowed ? "sine" : "square";
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  } catch {
    // Audio is optional; ignore browsers that block it
  }
};
