import { useUserStore } from "@/stores/user";
import type { User, UserBody } from "@/types/api";

export const useAuth = () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const token = useCookie("auth_token");
  const isAuthenticated = computed(() => !token);

  const fetchUser = async (): Promise<User | null> => {
    if (!token.value) {
      userStore.setUser(null);
      return null;
    }

    try {
      const { data, error } = await useApi("/api/auth/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      if (error.value || !data.value) {
        userStore.setUser(null);
        token.value = null;
        return null;
      }

      userStore.setUser(data.value);
      return data.value;
    } catch (e) {
      userStore.setUser(null);
      token.value = null;
      return null;
    }
  };

  const login = async ({ email, password }: UserBody) => {
    const { data, error } = await useApi("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (error.value || !data.value?.success) {
      throw new Error(error.value?.message || "Ошибка авторизации");
    }

    token.value = data.value.token;

    fetchUser();
  };

  const logout = () => {
    userStore.setUser(null);
    token.value = null;
  };

  return {
    user,
    isAuthenticated,
    token,
    fetchUser,
    login,
    logout,
  };
};
