<script lang="ts" setup>
import { ref, watch } from "vue";
import useMySpeechRecognition from "~/composibals/useMySpeechRecognition";
import useMySpeechSynthesis from "~/composibals/useMySpeechSynthesis";
import type { Chat, ChatMessage } from "@/types";

const synthesis = useMySpeechSynthesis();
const recognation = useMySpeechRecognition();
const chat = ref<Chat>({
  messages: [
    {
      role: "system",
      text:
        "Ты проводишь собеседование на позицию Vue.js разработчик. " +
        "Кандидата спращивают о его опыте.",
    },
  ],
});
async function makePrompt(messages: ChatMessage[]) {
  const res = await $fetch<ChatMessage>("/api/yandex-gpt-prompt", {
    body: JSON.stringify({ messages }),
    method: "POST",
  });
  console.log(res);
  return res;
}

const isUserSpeak = ref(true);
const isInit = ref(true);

function onStart() {
  synthesis.text.value = "Раскажите о своем опыте.";
  synthesis.play();
  isInit.value = false;
}

function onToggleDialog() {
  if (!isUserSpeak.value && isInit.value) {
    synthesis.play();
  }
  isUserSpeak.value = !isUserSpeak.value;
}

watch(synthesis.speech.status, (status) => {
  if (status === "end") {
    recognation.start();
  }
});

watch(isUserSpeak, async (isUser) => {
  if (!isUser) {
    recognation.stop();
    const text = recognation.result.value;
    isUserSpeak.value = true;
    console.log(text);
    if (text) {
      chat.value?.messages.push({ text, role: "user" });
      const aiResponse = await makePrompt(chat.value.messages);
      synthesis.text.value = aiResponse.text;
      synthesis.play();
      chat.value.messages.push(aiResponse);
    }
  }
});
</script>

<template>
  <div class="flex flex-col border-2 rounded-2xl border-gray-500 p-5 m-3">
    <div
      v-for="(message, index) of chat?.messages"
      :key="index"
      class="flex flex-col"
    >
      <div
        v-if="message.role === 'assistant'"
        class=""
      >
        {{ message.text }}
      </div>
      <div
        v-if="message.role === 'user'"
        class="self-end"
      >
        {{ message.text }}
      </div>
    </div>
    <p
      v-if="recognation.result.value"
      class="tag"
    >
      Распознанная речь: {{ recognation.result }}
    </p>
    <UButtonGroup class="mt-3">
      <UButton
        v-if="isInit"
        @click="onStart"
      >
        Начать диалог
      </UButton>
      <UButton
        v-else-if="isUserSpeak"
        @click="onToggleDialog"
      >
        Продолжить
      </UButton>
    </UButtonGroup>
  </div>
</template>
