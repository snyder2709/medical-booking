<template>
  <Card class="mb-6">
    <CardHeader>
      <CardTitle>Расписание на неделю</CardTitle>
      <CardDescription>Выберите день для записи</CardDescription>
    </CardHeader>
    <CardContent>
      <div
        v-if="!weekSchedule || weekSchedule.length === 0"
        class="text-center py-8 text-muted-foreground"
      >
        Нет доступных слотов на эту неделю
      </div>

      <div v-else>
        <div class="flex flex-wrap gap-2 mb-4">
          <Button
            class="p-5"
            v-for="day in availableDays"
            :key="day.date"
            :variant="selectedDay?.date === day.date ? 'default' : 'outline'"
            size="sm"
            @click="selectDay(day)"
          >
            <div class="text-left w-full">
              <div class="font-semibold">{{ formatDayLabel(day.date) }}</div>
              <div class="text-xs opacity-80">
                {{ day.slots.length }} слотов
              </div>
            </div>
          </Button>
        </div>

        <div v-if="selectedDay">
          <h4 class="font-semibold mb-3">
            Свободные слоты на {{ formatDayLabel(selectedDay.date) }}:
          </h4>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="slot in selectedDay.slots"
              :key="slot.id"
              size="sm"
              variant="outline"
              @click="$emit('select-slot', slot)"
            >
              {{ formatSlot(slot) }}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatSlot } from "@/lib/formatSlot";
import type { TodaySlot } from "@/types/api";
import { computed, ref } from "vue";

interface DaySlots {
  date: string;
  slots: TodaySlot[];
}

const props = defineProps<{ weekSchedule: DaySlots[] }>();
const selectedDay = ref<DaySlots | null>(null);

const availableDays = computed(() =>
  props.weekSchedule.filter((d) => d.slots.length > 0)
);

const selectDay = (day: DaySlots) => {
  selectedDay.value = day;
};

const formatDayLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};
</script>
