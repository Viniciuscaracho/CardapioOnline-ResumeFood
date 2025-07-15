import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isStoreOpen() {
  const now = new Date();
  const openHour = 10; // 10h
  const closeHour = 22; // 22h
  const currentHour = now.getHours();
  return currentHour >= openHour && currentHour < closeHour;
}
