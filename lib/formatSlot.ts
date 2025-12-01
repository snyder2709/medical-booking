import type { TodaySlot } from "@/types/api";

export const formatSlot = (slot: TodaySlot) => {
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);

  const format = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return `${format(start)} – ${format(end)}`;
};
