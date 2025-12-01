import type { TodaySlot } from "@/types/api";

interface DaySlots {
  date: string;
  slots: TodaySlot[];
}

export function buildWeekSchedule(slots: TodaySlot[]): DaySlots[] {
  const map = new Map<string, TodaySlot[]>();

  slots.forEach(slot => {
    const date = slot.startTime.split("T")[0];
    if (!map.has(date)) map.set(date, []);
    map.get(date)?.push(slot);
  });

  return Array.from(map.entries())
    .map(([date, slots]) => ({ date, slots }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
