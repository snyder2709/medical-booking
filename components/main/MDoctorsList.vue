<template>
  <div v-if="doctors.length === 0" class="mb-6">
    <Card>
      <CardContent class="py-12 text-center text-muted-foreground">
        Врачи не найдены
      </CardContent>
    </Card>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <DoctorCard
      v-for="doctor in doctors"
      :key="doctor.id"
      :doctor="doctor"
      :specialities="specialities"
      @select-slot="(slot: TodaySlot) => $emit('select-slot', slot)"
    />
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor, Specialiti, TodaySlot } from "@/types/api";
import DoctorCard from "./MDoctorCard.vue";
defineProps<{ doctors: Doctor[]; specialities: Specialiti[] }>();
</script>
