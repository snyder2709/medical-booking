import type { Specialiti } from "@/types/api";

export const useSpecialtyStore = defineStore("specialty", () => {
  const specialities = ref<Specialiti[]>([]);

  const setSpecialities = (data: Specialiti[]) => {
    specialities.value = data;
  };

  return {
    specialities,
    setSpecialities,
  };
});
