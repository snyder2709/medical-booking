<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import * as z from "zod";

interface Props {
  open: boolean;
  scheduleSlotId?: string;
  slotTime?: string;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isSubmitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const errorMessage = ref("");
const successMessage = ref("");

const { isAuthenticated, token } = useAuth();

const handleUnauthorized = () => {
  const currentPath = useRoute().fullPath;
  navigateTo(`/login?redirect=${currentPath}`);
};

const formSchema = toTypedSchema(
  z.object({
    complaints: z.string().min(1, 'Поле "Жалобы" обязательно для заполнения'),
    chronicDiseases: z.string().optional(),
    height: z
      .number({
        required_error: "Укажите рост",
        invalid_type_error: "Рост должен быть числом",
      })
      .min(50, "Минимальный рост: 50 см")
      .max(250, "Максимальный рост: 250 см"),
    weight: z
      .number({
        required_error: "Укажите вес",
        invalid_type_error: "Вес должен быть числом",
      })
      .min(20, "Минимальный вес: 20 кг")
      .max(300, "Максимальный вес: 300 кг"),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    complaints: "",
    chronicDiseases: "",
    height: undefined,
    weight: undefined,
  },
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      errorMessage.value =
        "Недопустимый формат файла. Разрешены: PDF, JPG, JPEG, PNG, DOC, DOCX, TXT";
      setTimeout(() => (errorMessage.value = ""), 5000);
      return;
    }

    selectedFile.value = file;
  }
};

const resetForm = () => {
  form.resetForm();
  selectedFile.value = null;
  errorMessage.value = "";
  successMessage.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleClose = () => {
  resetForm();
  emit("update:open", false);
};

const onSubmit = form.handleSubmit(async (values) => {
  if (!props.scheduleSlotId) {
    errorMessage.value = "Не указан ID слота для консультации";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const formData = new FormData();

    formData.append("scheduleSlotId", props.scheduleSlotId);

    formData.append("complaints", values.complaints);
    formData.append("height", String(values.height));
    formData.append("weight", String(values.weight));

    if (values.chronicDiseases) {
      formData.append("chronicDiseases", values.chronicDiseases);
    }

    if (selectedFile.value) {
      formData.append("testResults", selectedFile.value);
    }

    const { data } = await useApi("/api/appointments", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: formData,
    });

    if (!data.value.success) {
      errorMessage.value =
        data.value.message || "Не удалось создать запись на прием";
      return;
    }

    successMessage.value = "Запись на прием успешно создана";

    setTimeout(() => {
      emit("success");
      handleClose();
    }, 1500);
  } catch (error: any) {
    errorMessage.value = "Не удалось создать запись на прием";
  } finally {
    isSubmitting.value = false;
  }
});

watch(
  () => props.open,
  (newVal) => {
    if (newVal && !isAuthenticated.value) {
      handleUnauthorized();
      emit("update:open", false);
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Запись на прием</DialogTitle>
        <DialogDescription v-if="slotTime">
          Время приема: {{ slotTime }}
        </DialogDescription>
      </DialogHeader>

      <div
        v-if="errorMessage"
        class="rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200"
      >
        {{ errorMessage }}
      </div>
      <div
        v-if="successMessage"
        class="rounded-lg bg-green-50 p-3 text-sm text-green-800 border border-green-200"
      >
        {{ successMessage }}
      </div>

      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="complaints">
          <FormItem>
            <FormLabel>Жалобы <span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Боли в груди, одышка"
                class="min-h-[80px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="chronicDiseases">
          <FormItem>
            <FormLabel>Хронические заболевания</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Гипертония"
                class="min-h-[60px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="height">
            <FormItem>
              <FormLabel
                >Рост (см) <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <Input
                  type="number"
                  v-bind="componentField"
                  placeholder="175"
                  min="50"
                  max="250"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="weight">
            <FormItem>
              <FormLabel
                >Вес (кг) <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <Input
                  type="number"
                  v-bind="componentField"
                  placeholder="70"
                  min="20"
                  max="300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Результаты анализов
          </label>
          <Input
            ref="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            @change="handleFileChange"
          />
          <p class="text-xs text-muted-foreground">
            Форматы: PDF, JPG, JPEG, PNG, DOC, DOCX, TXT
          </p>
          <p v-if="selectedFile" class="text-sm text-green-600">
            Выбран файл: {{ selectedFile.name }}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="handleClose"
            :disabled="isSubmitting"
          >
            Отмена
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Отправка..." : "Записаться" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
