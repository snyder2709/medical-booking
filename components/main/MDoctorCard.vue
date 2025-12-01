<template>
  <Card class="hover:shadow-lg transition-shadow flex flex-col">
    <CardHeader class="flex items-start gap-4">
      <Avatar class="h-16 w-16">
        <AvatarImage :src="doctor.avatar" :alt="doctor.name" />
        <AvatarFallback>
          {{
            doctor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          }}
        </AvatarFallback>
      </Avatar>

      <div class="flex-1">
        <CardTitle class="text-lg mb-1">{{ doctor.name }}</CardTitle>
        <CardDescription>{{ doctorSpeciality }}</CardDescription>
      </div>
    </CardHeader>

    <CardContent class="flex flex-col justify-between flex-1 space-y-3">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span class="ml-1 font-semibold">{{ doctor.rating }}</span>
          <span class="text-sm text-muted-foreground">
            ({{ doctor.reviewCount }} отзывов)
          </span>
        </div>

        <p class="text-sm text-muted-foreground">
          Стаж: <span class="font-medium">{{ doctor.experience }} лет</span>
        </p>

        <div v-if="doctor.achievements.length" class="space-y-1">
          <p class="text-sm font-medium">Достижения:</p>
          <div class="flex flex-wrap gap-1">
            <Badge
              v-for="(ach, idx) in doctor.achievements"
              :key="idx"
              variant="secondary"
              class="text-xs"
            >
              {{ ach }}
            </Badge>
          </div>
        </div>

        <p class="text-sm">
          Цена консультации:
          <span class="font-medium">{{ doctor.price }} ₽</span>
        </p>

        <div v-if="doctor.todaySlots.length" class="space-y-2">
          <p class="text-sm font-medium">Свободные слоты сегодня:</p>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="(slot, idx) in doctor.todaySlots"
              :key="idx"
              size="sm"
              variant="outline"
              @click="$emit('select-slot', slot)"
            >
              {{ formatSlot(slot) }}
            </Button>
          </div>
        </div>
      </div>

      <NuxtLink :to="`/doctors/${doctor.id}`">
        <Button size="sm" class="mt-4 w-full">Подробнее</Button>
      </NuxtLink>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatSlot } from "@/lib/formatSlot";
import type { Doctor, Specialiti } from "@/types/api";
import { Star } from "lucide-vue-next";

const props = defineProps<{
  doctor: Doctor;
  specialities: Specialiti[];
}>();

const doctorSpeciality = computed(
  () =>
    props.specialities.find((s) => s.id === props.doctor.specialty)?.name ||
    "Не указано"
);
</script>
