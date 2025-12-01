<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as z from "zod";

const route = useRoute();
const { login } = useAuth();

const isSubmitting = ref(false);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, "Email обязателен")
      .email("Некорректный email адрес"),
    password: z
      .string()
      .min(1, "Пароль обязателен")
      .min(6, "Пароль должен содержать минимум 6 символов"),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: "",
    password: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await login({ email: values.email, password: values.password });
    const redirect = (route.query.redirect as string) || "/";
    await navigateTo(redirect);
  } catch (error: any) {
    errorMessage.value =
      error.message || "Неверный email или пароль. Попробуйте снова.";
  } finally {
    isSubmitting.value = false;
  }
});

useHead({
  title: "Авторизация",
  meta: [
    {
      name: "description",
      content: "Войдите в систему для записи на прием к врачу",
    },
  ],
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-muted/40">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Вход</CardTitle>
        <CardDescription class="text-center">
          Войдите в свой аккаунт для записи на прием
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          v-if="errorMessage"
          class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200"
        >
          {{ errorMessage }}
        </div>

        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  v-bind="componentField"
                  placeholder="example@mail.com"
                  autocomplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  v-bind="componentField"
                  placeholder="password"
                  autocomplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? "Вход..." : "Войти" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
