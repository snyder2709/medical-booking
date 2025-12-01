<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

defineProps<{
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}>();

defineEmits(["change"]);
</script>

<template>
  <Card>
    <CardContent class="py-4">
      <div class="flex items-center justify-between">
        <Button
          variant="outline"
          :disabled="!hasPrev"
          @click="$emit('change', page - 1)"
        >
          Назад
        </Button>

        <span class="text-sm text-muted-foreground">
          Страница {{ page }} из {{ pages }}
        </span>

        <Button
          variant="outline"
          :disabled="!hasNext"
          @click="$emit('change', page + 1)"
        >
          Вперед
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
