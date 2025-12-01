export const useModal = <T = any>() => {
  const isOpen = ref(false);
  const payload = ref<T | null>(null);

  const open = (data?: T) => {
    payload.value = data ?? null;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    payload.value = null;
  };

  return {
    isOpen,
    payload,
    open,
    close,
  };
};
