import type { Specialty } from "@/types/api";

export const useSpecialtyStore = defineStore("specialty", () => {
  const specialtyes = ref<Specialty[]>([]);

  const setSpecialtyes = (data: Specialty[]) => {
    specialtyes.value = data;
  };

  return {
    specialtyes,
    setSpecialtyes,
  };
});
