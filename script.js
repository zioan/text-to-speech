let speech = null;
let voices = [];

const voiceSelect = document.getElementById("voiceSelect");
const textInput = document.getElementById("textInput");
const speakButton = document.getElementById("speakButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");

// Initialize speech synthesis
function initSpeech() {
  speech = window.speechSynthesis;
  speech.onvoiceschanged = loadVoices;
}

// Load available voices
function loadVoices() {
  // TODO: Filter voices to be included
  // voicesToBeIncluded = ["Aaron", "Trinoids", "Gordon", "Bubbles"];
  voices = speech.getVoices();
  console.log("voices", voices);

  voiceSelect.innerHTML = voices.map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`).join("");
}

// Speak function
function speak() {
  if (speech.speaking) {
    speech.cancel();
  }

  const text = textInput.value;
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices[voiceSelect.value];

    utterance.voice = selectedVoice;
    utterance.rate = rateInput.value;
    utterance.pitch = pitchInput.value;

    speech.speak(utterance);

    utterance.onend = () => {
      speakButton.disabled = false;
    };
  }
}

// Event Listeners
speakButton.addEventListener("click", () => {
  speak();
  speakButton.disabled = true;
});

pauseButton.addEventListener("click", () => {
  if (speech.speaking) {
    if (speech.paused) {
      speech.resume();
      pauseButton.textContent = "Pause";
    } else {
      speech.pause();
      pauseButton.textContent = "Resume";
    }
  }
});

stopButton.addEventListener("click", () => {
  speech.cancel();
  speakButton.disabled = false;
});

rateInput.addEventListener("input", (e) => {
  rateValue.textContent = `${e.target.value}x`;
});

pitchInput.addEventListener("input", (e) => {
  pitchValue.textContent = `${e.target.value}x`;
});

// Initialize on page load
window.addEventListener("load", initSpeech);
