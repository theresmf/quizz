import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const teamSounds: Record<number, string> = {
  1: "/sounds/cow.mp3", // Path for Team 1's sound
  2: "/sounds/team2.mp3", // Path for Team 2's sound
};
