//your JS code here. If required.
const ctx = new (window.AudioContext || window.webkitAudioContext)();

const sounds = {
  65: { type: 'sine',     freq: 220  },
  83: { type: 'square',   freq: 330  },
  68: { type: 'sawtooth', freq: 440  },
  70: { type: 'sine',     freq: 550  },
  71: { type: 'triangle', freq: 660  },
  72: { type: 'square',   freq: 770  },
  74: { type: 'sine',     freq: 880  },
  75: { type: 'sawtooth', freq: 990  },
  76: { type: 'triangle', freq: 1100 },
};

function playSound(keyCode) {
  const s = sounds[keyCode];
  if (!s) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = s.type;
  osc.frequency.setValueAtTime(s.freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

function activateKey(keyCode) {
  const el = document.querySelector(`.key[data-key="${keyCode}"]`);
  if (!el) return;
  playSound(keyCode);
  el.classList.add('playing');
  setTimeout(() => el.classList.remove('playing'), 150);
}

window.addEventListener('keydown', e => {
  if (e.repeat) return;
  activateKey(e.keyCode);
});

document.querySelectorAll('.key').forEach(el => {
  el.addEventListener('click', () => {
    ctx.resume();
    activateKey(parseInt(el.dataset.key));
  });
});