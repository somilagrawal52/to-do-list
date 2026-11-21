import { createContext, useContext, useState, useEffect } from 'react'
import { sound } from '../utils/sound'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return loadFromStorage('taskflow_sound_enabled', true)
  })

  const [activeAmbient, setActiveAmbient] = useState(null) // null | 'brown' | 'rain' | 'alpha'

  useEffect(() => {
    saveToStorage('taskflow_sound_enabled', soundEnabled)
    sound.setEnabled(soundEnabled)
    if (!soundEnabled && activeAmbient) {
      sound.stopAmbient()
      setActiveAmbient(null)
    }
  }, [soundEnabled, activeAmbient])

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  const toggleAmbient = (type) => {
    if (activeAmbient === type) {
      sound.stopAmbient()
      setActiveAmbient(null)
    } else {
      sound.startAmbient(type)
      setActiveAmbient(type)
    }
  }

  const stopAmbient = () => {
    sound.stopAmbient()
    setActiveAmbient(null)
  }

  const playComplete = () => sound.playCompletion()
  const playClick = () => sound.playPop()
  const playTimer = () => sound.playTimerAlert()
  const playCelebrate = () => sound.playCelebration()

  return (
    <AudioContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        activeAmbient,
        toggleAmbient,
        stopAmbient,
        playComplete,
        playClick,
        playTimer,
        playCelebrate
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
