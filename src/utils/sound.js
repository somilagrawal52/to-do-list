// Web Audio API synthesized sound generator & continuous ambient focus soundscapes

class SoundEffects {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.ambientSource = null
    this.ambientGain = null
    this.currentAmbient = null
    this.stopTimeout = null
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setEnabled(val) {
    this.enabled = Boolean(val)
    if (!this.enabled && this.currentAmbient) {
      this.stopAmbient(true)
    }
  }

  playCompletion() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gainNode = this.ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'triangle'

      // Bright chime: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
      osc1.frequency.setValueAtTime(523.25, now)
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08)
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18)

      osc2.frequency.setValueAtTime(261.63, now)
      osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.18)

      gainNode.gain.setValueAtTime(0.001, now)
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(this.ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.55)
      osc2.stop(now + 0.55)
    } catch {
      // Ignore browser audio restrictions
    }
  }

  playPop() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gainNode = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(380, now)
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06)

      gainNode.gain.setValueAtTime(0.12, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      osc.connect(gainNode)
      gainNode.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.07)
    } catch {
      // Ignore
    }
  }

  playTimerAlert() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const notes = [659.25, 659.25, 659.25, 830.61] // E5, E5, E5, G#5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const startTime = now + idx * 0.15

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.35)
      })
    } catch {
      // Ignore
    }
  }

  playCelebration() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
      melody.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const startTime = now + idx * 0.08

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.5)
      })
    } catch {
      // Ignore
    }
  }

  // --- AMBIENT SOUNDSCAPES (Continuous Focus Engines) ---
  startAmbient(type = 'brown') {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      // Stop any existing sound immediately to prevent overlaps
      this.stopAmbient(true)

      const bufferSize = this.ctx.sampleRate * 4 // 4 seconds looping buffer
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      if (type === 'brown') {
        // Brownian noise (deep focus / ADHD focus)
        let lastOut = 0.0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          data[i] = (lastOut + 0.02 * white) / 1.02
          lastOut = data[i]
          data[i] *= 3.5 // Gain boost
        }
      } else if (type === 'rain') {
        // Soft rain simulation (pink noise modulated)
        let b0 = 0, b1 = 0, b2 = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.12
        }
      } else if (type === 'alpha') {
        // 10Hz Binaural alpha focus wave carrier
        for (let i = 0; i < bufferSize; i++) {
          const t = i / this.ctx.sampleRate
          data[i] = Math.sin(2 * Math.PI * 216 * t) * 0.08
        }
      }

      const noiseSource = this.ctx.createBufferSource()
      noiseSource.buffer = buffer
      noiseSource.loop = true

      const filter = this.ctx.createBiquadFilter()
      if (type === 'brown') {
        filter.type = 'lowpass'
        filter.frequency.value = 450
      } else if (type === 'rain') {
        filter.type = 'bandpass'
        filter.frequency.value = 1200
        filter.Q.value = 0.7
      } else {
        filter.type = 'lowpass'
        filter.frequency.value = 800
      }

      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime)
      this.ambientGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.2)

      noiseSource.connect(filter)
      filter.connect(this.ambientGain)
      this.ambientGain.connect(this.ctx.destination)

      noiseSource.start()
      this.ambientSource = noiseSource
      this.currentAmbient = type
    } catch (err) {
      console.warn('Could not start ambient audio:', err)
    }
  }

  stopAmbient(immediate = false) {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout)
      this.stopTimeout = null
    }

    if (immediate) {
      if (this.ambientSource) {
        try {
          this.ambientSource.stop()
          this.ambientSource.disconnect()
        } catch {
          // Ignore
        }
        this.ambientSource = null
      }
      this.ambientGain = null
      this.currentAmbient = null
      return
    }

    if (this.ambientGain && this.ctx) {
      try {
        const targetSource = this.ambientSource
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6)
        this.stopTimeout = setTimeout(() => {
          if (targetSource) {
            try {
              targetSource.stop()
              targetSource.disconnect()
            } catch {
              // Ignore
            }
          }
          if (this.ambientSource === targetSource) {
            this.ambientSource = null
            this.ambientGain = null
            this.currentAmbient = null
          }
          this.stopTimeout = null
        }, 650)
      } catch {
        this.currentAmbient = null
      }
    } else {
      this.currentAmbient = null
    }
  }

  getAmbientType() {
    return this.currentAmbient
  }
}

export const sound = new SoundEffects()
