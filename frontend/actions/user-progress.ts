"use server";

import { revalidatePath } from "next/cache";
import { POINTS_TO_REFILL } from "@/constants";

const API = "http://localhost:8000";

export const upsertUserProgress = async (courseId: number) => {
  try {
    await fetch(`${API}/user-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch {
    throw new Error("Failed to update course");
  }
};

export const reduceHearts = async (challengeId: number) => {
  try {
    const res = await fetch(`${API}/reduce-hearts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId }),
    });
    const data = await res.json();
    if (data.error) return { error: data.error };
    revalidatePath("/lesson");
    revalidatePath("/learn");
    return {};
  } catch {
    throw new Error("Failed to reduce hearts");
  }
};

export const refillHearts = async () => {
  try {
    const res = await fetch(`${API}/refill-hearts`, { method: "POST" });
    const data = await res.json();
    if (data.error) return { error: data.error };
    revalidatePath("/shop");
    revalidatePath("/learn");
    return {};
  } catch {
    throw new Error("Failed to refill hearts");
  }
};
