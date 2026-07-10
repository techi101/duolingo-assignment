"use server";

import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const upsertChallengeProgress = async (challengeId: number) => {
  try {
    const res = await fetch(`${API}/challenge-progress`, {
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
    throw new Error("Failed to update challenge progress");
  }
};
