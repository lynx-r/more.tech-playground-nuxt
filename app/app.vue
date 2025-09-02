<script setup lang="ts">
useHead({
  title: "Megalit More.tech",
  meta: [
    {
      name: "description",
      content: "Megalit приложение для хакатона More.Tech",
    },
  ],
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </UApp>
</template>
