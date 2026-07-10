// db/schema.ts
// TypeScript type definitions that mirror the FastAPI / SQLite backend models.
// We use plain objects with $inferSelect so existing code keeps working unchanged.

// ─── Courses ─────────────────────────────────────────────────────────────────
export const courses = {
  $inferSelect: {} as {
    id: number;
    title: string;
    imageSrc: string;
  },
};

// ─── Units ───────────────────────────────────────────────────────────────────
export const units = {
  $inferSelect: {} as {
    id: number;
    title: string;
    description: string;
    order: number;
    courseId: number;
  },
};

// ─── Lessons ─────────────────────────────────────────────────────────────────
export const lessons = {
  $inferSelect: {} as {
    id: number;
    title: string;
    order: number;
    unitId: number;
  },
};

// ─── Challenges (exercises / questions inside a lesson) ───────────────────────
export const challenges = {
  $inferSelect: {} as {
    id: number;
    lessonId: number;
    type: "SELECT" | "ASSIST" | "TYPE_ANSWER" | "MATCH_PAIRS";
    question: string;
    order: number;
  },
};

// ─── Challenge Options (answer choices) ──────────────────────────────────────
export const challengeOptions = {
  $inferSelect: {} as {
    id: number;
    challengeId: number;
    text: string;
    correct: boolean;
    imageSrc: string | null;
    audioSrc: string | null;
  },
};

// ─── User Progress ────────────────────────────────────────────────────────────
export const userProgress = {
  $inferSelect: {} as {
    userId: number;
    activeCourseId: number;
    hearts: number;
    points: number;
    streak: number;
  },
};

// ─── User Subscription (mocked – no Stripe) ──────────────────────────────────
export const userSubscription = {
  $inferSelect: {} as {
    userId: number;
    isActive: boolean;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Date | null;
  },
};
