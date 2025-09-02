import { useSpeechSynthesis } from '@vueuse/core'
import { computed, ref as deepRef, onMounted, shallowRef, watch } from 'vue'

const useMySpeechSynthesis = () => {
  const voice = deepRef<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice)
  const text = shallowRef('')

  const boundaryStart = shallowRef(0)
  const boundaryEnd = shallowRef(0)

  const textSegments = computed(() => {
    const fullText = text.value || ''
    const startIndex = Math.max(0, Math.min(boundaryStart.value, fullText.length))
    const endIndex = Math.max(startIndex, Math.min(boundaryEnd.value, fullText.length))
    return {
      leadingText: fullText.slice(0, startIndex),
      highlightedText: fullText.slice(startIndex, endIndex),
      trailingText: fullText.slice(endIndex),
    }
  })

  const speech = useSpeechSynthesis(text, {
    voice,
    onBoundary,
  })

  let synth: SpeechSynthesis

  onMounted(() => {
    if (speech.isSupported.value) {
      // load at last
      setTimeout(() => {
        synth = window.speechSynthesis
        const voices = synth.getVoices()
        const voiceRu = voices.find((voice) => voice.lang === 'ru-RU')
        if (voiceRu) {
          voice.value = voiceRu
        }
      }, 100)
    }
  })

  function onBoundary(event: SpeechSynthesisEvent) {
    const { charIndex, charLength } = event
    const startIndex = charIndex
    let endIndex = charIndex
    if (typeof charLength === 'number' && charLength > 0) {
      endIndex = startIndex + charLength
    } else {
      const fullText = text.value || ''
      const remainingText = fullText.slice(startIndex)
      const firstWordMatch = remainingText.match(/^\S+/)
      endIndex = startIndex + (firstWordMatch ? firstWordMatch[0].length : 0)
    }
    boundaryStart.value = startIndex
    boundaryEnd.value = endIndex
  }

  function resetSpeakingText() {
    boundaryStart.value = 0
    boundaryEnd.value = 0
  }

  function play() {
    if (speech.status.value === 'pause') {
      window.speechSynthesis.resume()
    } else {
      resetSpeakingText()
      speech.speak()
    }
  }

  function pause() {
    window.speechSynthesis.pause()
  }

  function stop() {
    speech.stop()
    resetSpeakingText()
  }

  watch(
    () => speech.status.value,
    (s) => {
      if (s === 'end') {
        resetSpeakingText()
      }
    },
  )

  return {
    speech,
    textSegments,
    text,
    play,
    pause,
    stop,
  }
}

export default useMySpeechSynthesis
