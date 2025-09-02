import { shallowRef } from 'vue'
import { useSpeechRecognition } from '@vueuse/core'

const useMySpeechRecognition = () => {
  const lang = shallowRef('ru')

  // const grammar = `#JSGF V1.0;`

  const speech = useSpeechRecognition({
    lang,
    continuous: true,
  })

  // const color = shallowRef('transparent')

  // if (speech.isSupported.value) {
  // const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
  // const speechRecognitionList = new SpeechGrammarList()
  // speechRecognitionList.addFromString(grammar, 1)
  // speech.recognition!.grammars = speechRecognitionList
  // }

  function start() {
    // color.value = 'transparent'
    speech.result.value = ''
    speech.start()
  }

  const { isListening, isFinal, isSupported, stop, result } = speech

  return {
    isSupported,
    stop,
    result,
    start,
    isListening,
    isFinal,
  }
}

export default useMySpeechRecognition
