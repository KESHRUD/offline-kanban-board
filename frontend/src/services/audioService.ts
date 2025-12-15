
import type { ThemeMode } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init on first interaction
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Default volume
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
  }

  public getMuteState() {
    return this.isMuted;
  }

  // --- PROCEDURAL SFX ---
  public play(type: 'hover' | 'click' | 'success' | 'error' | 'flip', theme: ThemeMode) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    if (theme === 'galilee') {
      // SCI-FI SOUNDS
      switch (type) {
        case 'hover':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, t);
          osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        case 'click':
          osc.type = 'square';
          osc.frequency.setValueAtTime(200, t);
          osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.start(t);
          osc.stop(t + 0.1);
          break;
        case 'success':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.setValueAtTime(880, t + 0.1);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
          break;
        case 'flip':
           osc.type = 'sawtooth';
           osc.frequency.setValueAtTime(100, t);
           gain.gain.setValueAtTime(0.1, t);
           gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
           osc.start(t);
           osc.stop(t + 0.2);
           break;
      }
    } else {
      // PRO SOUNDS (Subtle)
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.03);
      }
    }
  }

  // --- TEXT TO SPEECH ---
  public speak(text: string, lang: string = 'fr-FR') {
    if (this.isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  public stopSpeak() {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
      }
  }

  // --- BROWN NOISE (FOCUS) ---
  public toggleBrownNoise(enable: boolean) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (enable) {
        if (this.noiseNode) return; // Already playing
        
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Brown noise generation
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // Compensate for gain
        }

        this.noiseNode = this.ctx.createBufferSource();
        this.noiseNode.buffer = noiseBuffer;
        this.noiseNode.loop = true;
        
        this.noiseGain = this.ctx.createGain();
        this.noiseGain.gain.value = 0.05; // Low volume background

        this.noiseNode.connect(this.noiseGain);
        this.noiseGain.connect(this.masterGain);
        this.noiseNode.start(0);
    } else {
        if (this.noiseNode) {
            this.noiseNode.stop();
            this.noiseNode.disconnect();
            this.noiseNode = null;
        }
        if (this.noiseGain) {
            this.noiseGain.disconnect();
            this.noiseGain = null;
        }
    }
  }
}

export const audioManager = new AudioService();

// Simple Levenshtein distance for string matching
export const calculateSimilarity = (s1: string, s2: string): number => {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  
  const editDistance = (str1: string, str2: string) => {
    str1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
    str2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const costs = new Array();
    for (let i = 0; i <= str1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= str2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (str1.charAt(i - 1) != str2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
  }
  
  const dist = editDistance(longer, shorter);
  return (longerLength - dist) / longerLength;
};
