"use server";

import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const updateUserProfile = async (username?: string, userImageSrc?: string) => {
  try {
    const res = await fetch(`${API}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        userImageSrc,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    revalidatePath("/profile");
    revalidatePath("/leaderboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
};
