<script setup lang="ts">
import type { Specialty } from "@/types/api";
import { ArrowUpDown } from "lucide-vue-next";

const search = defineModel<string>("search", {
  required: true,
  default: "",
});

const specialtye = defineModel<string>("specialtye", {
  required: true,
  default: "",
});

const sortBy = defineModel<string>("sortBy", {
  required: true,
  default: "",
});

const sortOrder = defineModel<string>("sortOrder", {
  required: true,
  default: "",
});

const minRating = defineModel<number>("minRating", {
  required: true,
  default: 0,
});

defineProps<{
  specialtyes: Specialty[];
}>();

const emit = defineEmits(["reset-filters"]);

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

const resetAll = () => emit("reset-filters");
</script>

<template>
  <Card class="mb-6">
    <CardHeader>
      <CardTitle>Фильтры и поиск</CardTitle>
    </CardHeader>

    <CardContent>
      <div
        class="grid grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div class="py-2">
          <label class="text-sm font-medium">Поиск</label>
          <Input v-model="search" placeholder="Введите имя..." />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Специальность</label>
          <Select v-model="specialtye">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Выберите специальность" />
            </SelectTrigger>

            <SelectContent>
              <SelectLabel>Специальности</SelectLabel>

              <SelectItem
                v-for="item in specialtyes"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="py-2">
          <label class="text-sm font-medium">Сортировка</label>

          <div class="flex gap-2">
            <Select v-model="sortBy">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Выберите сортировку" />
              </SelectTrigger>

              <SelectContent>
                <SelectLabel>Сортировка</SelectLabel>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="experience">По стажу</SelectItem>
                <SelectItem value="price">По цене</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              class="shrink-0"
              @click="toggleSortOrder"
            >
              <ArrowUpDown class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="py-2">
          <p class="text-sm font-medium mb-2">Мин. рейтинг: {{ minRating }}</p>

          <Slider
            :model-value="[minRating]"
            :max="5"
            :step="0.1"
            @update:model-value="(val) => (minRating = val[0])"
          />
        </div>
      </div>

      <div class="mt-4">
        <Button variant="outline" size="sm" @click="resetAll">
          Сбросить фильтры
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
