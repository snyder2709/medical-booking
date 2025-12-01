<template>
  <div class="container mx-auto p-6 max-w-7xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Наши врачи</h1>
      <p class="text-muted-foreground">Выберите специалиста для записи</p>
    </div>

    <MFilters
      v-model:search="search"
      v-model:specialitie="query.specialty"
      v-model:sortBy="query.sortBy"
      v-model:sortOrder="query.sortOrder"
      v-model:minRating="minRating"
      :specialities="specialities"
      @reset-filters="resetFilters"
    />

    <div v-if="pending && !data" class="flex justify-center py-12">
      <div class="text-muted-foreground">Загрузка...</div>
    </div>

    <template v-else-if="error">
      <Card>
        <CardContent class="py-12 text-center text-red-500">
          Ошибка загрузки данных
        </CardContent>
      </Card>
    </template>

    <template v-else>
      <DoctorsList
        :doctors="data.doctors"
        :specialities="specialities"
        @select-slot="openAppointmentModal"
      />

      <Pagination
        v-if="data.pagination.pages > 1"
        :page="data.pagination.page"
        :pages="data.pagination.pages"
        :has-next="data.pagination.hasNext"
        :has-prev="data.pagination.hasPrev"
        @change="(p) => (query.page = p)"
      />
    </template>

    <MAppointmentModal
      v-model:open="isModalOpen"
      :schedule-slot-id="selectedSlot.id"
      @success="handleAppointmentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import MAppointmentModal from "@/components/main/MAppointmentModal.vue";
import DoctorsList from "@/components/main/MDoctorsList.vue";
import MFilters from "@/components/main/MFilters.vue";
import Pagination from "@/components/main/MPagination.vue";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/composables/useApi";
import type { Query } from "@/types/api";
import { refDebounced } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";
import { storeToRefs } from "pinia";
import { useSpecialtyStore } from "~/stores/specialty";
const route = useRoute();
const store = useSpecialtyStore();
const { specialities } = storeToRefs(store);

const search = ref<string>((route.query.search as string) || "");
const debouncedSearch = refDebounced(search, 500);
const minRating = ref<number>(Number(route.query.minRating) || 0);
const debouncedMinRating = refDebounced(minRating, 500);

const query: Query = reactive({
  page: useRouteQuery("page", 1, { transform: Number }),
  specialty: useRouteQuery("specialty", ""),
  sortBy: useRouteQuery("sortBy", "rating"),
  sortOrder: useRouteQuery("sortOrder", "desc"),
  search: useRouteQuery("search", ""),
  minRating: useRouteQuery("minRating", 0, { transform: Number }),
});

watch(debouncedSearch, (value) => {
  query.search = value;
});

watch(debouncedMinRating, (value) => {
  query.minRating = value;
});

const resetFilters = () => {
  query.specialty = "";
  query.sortBy = "rating";
  query.sortOrder = "desc";
  search.value = "";
  minRating.value = 0;
};

const { data, pending, error, refresh } = await useApi("/api/doctors", {
  query: computed(() => {
    const q: Partial<Query> = {};

    if (query.page) q.page = query.page;
    if (query.specialty) q.specialty = query.specialty;
    if (query.sortBy) q.sortBy = query.sortBy;
    if (query.sortOrder) q.sortOrder = query.sortOrder;
    if (query.search) q.search = query.search;
    if (query.minRating) q.minRating = query.minRating;

    return q;
  }),
});

watch(
  [
    () => query.search,
    () => query.minRating,
    () => query.specialty,
    () => query.sortBy,
    () => query.sortOrder,
  ],
  () => {
    query.page = 1;
  }
);

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
</script>
