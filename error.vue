<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div
          class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
        >
          <AlertCircle class="h-10 w-10 text-destructive" />
        </div>
        <CardTitle class="text-2xl">
          {{
            error?.statusCode === 404
              ? "Страница не найдена"
              : "Произошла ошибка"
          }}
        </CardTitle>
        <CardDescription class="text-base">
          {{ errorMessage }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div v-if="error?.statusCode" class="rounded-lg bg-muted p-4">
          <p class="text-sm text-muted-foreground">
            <span class="font-semibold">Код ошибки:</span>
            {{ error.statusCode }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Button @click="handleError" class="w-full">
            <Home class="mr-2 h-4 w-4" />
            Вернуться на главную
          </Button>

          <Button variant="outline" @click="reload" class="w-full">
            <RefreshCw class="mr-2 h-4 w-4" />
            Перезагрузить страницу
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-vue-next";

interface NuxtError {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
}

const props = defineProps<{
  error: NuxtError;
}>();

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return "Запрашиваемая страница не существует или была перемещена.";
  }

  if (props.error?.statusMessage) {
    return props.error.statusMessage;
  }

  if (props.error?.message) {
    return props.error.message;
  }

  return "Что-то пошло не так. Пожалуйста, попробуйте позже.";
});

const handleError = () => clearError({ redirect: "/" });

const reload = () => {
  clearError();
  if (process.client) {
    window.location.reload();
  }
};
</script>
