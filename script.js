const NOTE_URLS = (() => {
  function makeWav(freq) {
    const sampleRate = 44100;
    const duration = 0.4;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    function writeString(offset, str) {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-4 * t / duration);
      const sample = Math.sin(2 * Math.PI * freq * t) * decay * 32767;
      view.setInt16(44 + i * 2, sample, true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  return {
    65: makeWav(220),
    83: makeWav(330),
    68: makeWav(440),
    70: makeWav(550),
    71: makeWav(660),
    72: makeWav(770),
    74: makeWav(880),
    75: makeWav(990),
    76: makeWav(1100),
  };
})();

function playSound(keyCode) {
  const url = NOTE_URLS[keyCode];
  if (!url) return;

  const existing = document.getElementById('audio-' + keyCode);
  if (existing) existing.remove();

  const audio = document.createElement('audio');
  audio.id = 'audio-' + keyCode;
  audio.src = url;
  document.body.appendChild(audio);
  audio.play();
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
  el.addEventListener('click', () => activateKey(parseInt(el.dataset.key)));
});