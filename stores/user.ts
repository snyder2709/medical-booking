import type { User } from "@/types/api";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  const setUser = (data: User | null) => {
    user.value = data;
  };

  return { user, setUser };
});
