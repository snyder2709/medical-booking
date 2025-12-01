<template>
  <div>
    <MAppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import MAppHeader from "@/components/layouts/MAppHeader.vue";
</script>
