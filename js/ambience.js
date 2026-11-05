// Café ambience, synthesized with Web Audio: murmur (filtered brown noise), cup clinks, steamer hiss.
(function () {
  const btn = document.getElementById("ambience");
  if (!btn || !(window.AudioContext || window.webkitAudioContext)) { btn && (btn.hidden = true); return; }
  let ctx, master, timers = [], on = false;

  function noiseBuffer(sec, brown) {
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.5 : w;
    }
    return b;
  }
  function murmur() {
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(4, true); src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700;
    const bp = ctx.createBiquadFilter(); bp.type = "peaking"; bp.frequency.value = 300; bp.gain.value = 6;
    const g = ctx.createGain(); g.gain.value = 0.55;
    // slow swell, like a room of conversations
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.08; lg.gain.value = 0.15;
    lfo.connect(lg).connect(g.gain); lfo.start();
    src.connect(lp).connect(bp).connect(g).connect(master); src.start();
  }
  function clink() {
    const t = ctx.currentTime, f = 2200 + Math.random() * 2400;
    [1, 2.7].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f * m; o.type = "sine";
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(i ? 0.02 : 0.05, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5 + Math.random() * 0.4);
      const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.6 - 0.8;
      o.connect(g).connect(pan).connect(master); o.start(t); o.stop(t + 1);
    });
    timers.push(setTimeout(clink, 1800 + Math.random() * 5000));
  }
  function steam() {
    const t = ctx.currentTime, src = ctx.createBufferSource(); src.buffer = noiseBuffer(3, false);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 3500; bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.3);
    g.gain.setValueAtTime(0.05, t + 2.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.9);
    const pan = ctx.createStereoPanner(); pan.pan.value = -0.5;
    src.connect(bp).connect(g).connect(pan).connect(master); src.start(t);
    timers.push(setTimeout(steam, 18000 + Math.random() * 25000));
  }

  function start() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      murmur();
    }
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1.5);
    timers.push(setTimeout(clink, 800), setTimeout(steam, 6000));
  }
  function stop() {
    timers.forEach(clearTimeout); timers = [];
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    setTimeout(() => !on && ctx.suspend(), 700);
  }
  btn.addEventListener("click", () => {
    on = !on; on ? start() : stop();
    btn.setAttribute("aria-pressed", String(on));
    btn.querySelector(".amb-label").textContent = on ? "Café sounds on" : "Play café sounds";
  });
})();
