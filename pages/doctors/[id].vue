<template>
  <div class="container mx-auto p-6 max-w-7xl">
    <div v-if="pendingDoctor && !doctor">
      <Card class="mb-6">
        <CardContent class="pt-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="shrink-0">
              <Skeleton class="h-32 w-32 rounded-full" />
            </div>

            <div class="flex-1 space-y-4">
              <div>
                <Skeleton class="h-8 w-48 mb-2" />
                <Skeleton class="h-6 w-32" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton class="h-5 w-40" />
                <Skeleton class="h-5 w-32" />
                <Skeleton class="h-5 w-48" />
                <Skeleton class="h-5 w-36" />
              </div>

              <div>
                <Skeleton class="h-5 w-24 mb-2" />
                <Skeleton class="h-20 w-full" />
              </div>

              <div>
                <Skeleton class="h-5 w-28 mb-2" />
                <div class="flex flex-wrap gap-2">
                  <Skeleton class="h-6 w-24" />
                  <Skeleton class="h-6 w-32" />
                  <Skeleton class="h-6 w-28" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else-if="errorDoctor">
      <CardContent class="py-12 text-center text-red-500">
        Врач не найден
      </CardContent>
    </Card>

    <template v-else-if="doctor">
      <Card class="mb-6">
        <CardContent class="pt-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="shrink-0">
              <Avatar class="h-32 w-32">
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
            </div>

            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-2">{{ doctor.name }}</h1>
              <p class="text-xl text-muted-foreground mb-4">
                {{ doctorSpeciality }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center gap-2">
                  <Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span class="font-semibold">{{ doctor.rating }}</span>
                  <span class="text-sm text-muted-foreground">
                    ({{ doctor.reviewCount }} отзывов)
                  </span>
                </div>

                <div>
                  <span class="text-muted-foreground">Стаж: </span>
                  <span class="font-medium">{{ doctor.experience }} лет</span>
                </div>

                <div>
                  <span class="text-muted-foreground">Образование: </span>
                  <span class="font-medium">{{ doctor.education }}</span>
                </div>

                <div>
                  <span class="text-muted-foreground">Цена консультации: </span>
                  <span class="font-bold text-lg">{{ doctor.price }} ₽</span>
                </div>
              </div>

              <div class="mb-4">
                <h3 class="font-semibold mb-2">Описание:</h3>
                <p class="text-muted-foreground">{{ doctor.description }}</p>
              </div>

              <div v-if="doctor.achievements.length > 0">
                <h3 class="font-semibold mb-2">Достижения:</h3>
                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="(achievement, idx) in doctor.achievements"
                    :key="idx"
                    variant="secondary"
                  >
                    {{ achievement }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MWeekSchedule
        :week-schedule="weekSchedule"
        @select-slot="openAppointmentModal"
      />

      <MAppointmentModal
        v-model:open="isModalOpen"
        :schedule-slot-id="selectedSlot.id"
        @success="handleAppointmentSuccess"
      />

      <Card>
        <CardHeader>
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <CardTitle>Отзывы ({{ doctor.reviewCount }})</CardTitle>
            <div class="flex gap-2">
              <Select v-model="query.sortBy">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">По дате</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" @click="toggleSortOrder">
                {{ query.sortOrder === "asc" ? "↑" : "↓" }}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="pendingReviews" class="space-y-4">
            <div v-for="i in 3" :key="i" class="border-b pb-4 last:border-b-0">
              <div class="flex items-start justify-between mb-2">
                <div class="space-y-2">
                  <Skeleton class="h-5 w-32" />
                  <div class="flex items-center gap-2">
                    <Skeleton class="h-4 w-16" />
                    <Skeleton class="h-4 w-24" />
                  </div>
                </div>
              </div>
              <Skeleton class="h-16 w-full" />
            </div>
          </div>
          <div
            v-else-if="reviews && reviews.reviews.length > 0"
            class="space-y-4"
          >
            <div
              v-for="review in reviews.reviews"
              :key="review.id"
              class="border-b pb-4 last:border-b-0"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <p class="font-semibold">{{ review.patientName }}</p>
                  <div
                    class="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div class="flex items-center">
                      <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span class="ml-1">{{ review.rating }}</span>
                    </div>
                    <span>•</span>
                    <span>{{ formatReviewDate(review.date) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-muted-foreground">{{ review.comment }}</p>
            </div>

            <div
              v-if="reviews.pagination.pages > 1"
              class="flex items-center justify-between pt-4"
            >
              <Button
                variant="outline"
                size="sm"
                :disabled="!reviews.pagination.hasPrev"
                @click="query.page = query.page - 1"
              >
                <ChevronLeft class="h-4 w-4 mr-1" />
                Назад
              </Button>

              <span class="text-sm text-muted-foreground">
                Страница {{ reviews.pagination.page }} из
                {{ reviews.pagination.pages }}
              </span>

              <Button
                variant="outline"
                size="sm"
                :disabled="!reviews.pagination.hasNext"
                @click="query.page = query.page + 1"
              >
                Вперед
                <ChevronRight class="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            Пока нет отзывов
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import MAppointmentModal from "@/components/main/MAppointmentModal.vue";
import MWeekSchedule from "@/components/main/MWeekShedule.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/composables/useApi";
import { buildWeekSchedule } from "@/lib/buildWeekShedule";
import { useRouteQuery } from "@vueuse/router";
import { ChevronLeft, ChevronRight, Star } from "lucide-vue-next";
import { Skeleton } from "~/components/ui/skeleton";
import type { Query } from "~/types/api";

const store = useSpecialtyStore();

const route = useRoute();
const doctorId = route.params.id as string;

const {
  data: doctor,
  pending: pendingDoctor,
  error: errorDoctor,
} = await useApi(`/api/doctors/${doctorId}`, {
  key: `doctor-${doctorId}`,
  lazy: true,
  getCachedData(key) {
    const data = useNuxtData(key);

    if (!data.data.value) {
      return;
    }

    const expirationDate = new Date(data.data.value._expiresAt);
    const isExpired = expirationDate.getTime() < Date.now();

    if (isExpired) {
      return;
    }

    return data.data.value;
  },
  transform(data) {
    return {
      ...data,
      _expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
    };
  },
});

const { specialities } = storeToRefs(store);

const doctorSpeciality = computed(
  () =>
    specialities.value.find((s) => s.id === doctor.value.specialty)?.name ||
    "Не указано"
);

const { data: schedules } = await useApi(`/api/doctors/${doctorId}/schedule`);

const weekSchedule = computed(() => buildWeekSchedule(schedules.value || []));

const query: Pick<Query, "page" | "sortBy" | "sortOrder"> = reactive({
  page: useRouteQuery("page", 1, { transform: Number }),
  sortBy: useRouteQuery("sortBy", "rating"),
  sortOrder: useRouteQuery("sortOrder", "desc"),
});

const toggleSortOrder = () => {
  query.sortOrder = query.sortOrder === "asc" ? "desc" : "asc";
};

const {
  data: reviews,
  pending: pendingReviews,
  refresh,
} = await useApi(`/api/doctors/${doctorId}/reviews`, {
  query: computed(() => ({
    page: unref(query.page),
    sortBy: unref(query.sortBy),
    sortOrder: unref(query.sortOrder),
  })),
});

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isModalOpen = ref(false);

const selectedSlot = ref({
  id: "",
});

const openAppointmentModal = (slot: { id: string }) => {
  selectedSlot.value = {
    id: slot.id,
  };

  isModalOpen.value = true;
};

const handleAppointmentSuccess = async () => {
  await refresh();
};

useHead({
  title: computed(() =>
    doctor.value ? `${doctor.value.name} - Запись на прием` : "Врач"
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        doctor.value ? doctor.value.description : "Информация о враче"
      ),
    },
  ],
});
</script>
