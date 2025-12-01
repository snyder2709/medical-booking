<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts" async>
import { useApi } from "@/composables/useApi";
import { useSpecialtyStore } from "~/stores/specialty";

const store = useSpecialtyStore();

const { data, error } = await useApi("/api/specialties");

if (data.value) {
  store.setSpecialities(data.value);
}

if (error.value) {
  console.error("Ошибка загрузки специальностей", error.value);
}
</script>
