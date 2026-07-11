"use server";
// db/queries.ts – all data fetching from the FastAPI backend

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Course = { id: number; title: string; imageSrc: string };

export type ChallengeOption = {
  id: number; challengeId: number; text: string;
  correct: boolean; imageSrc: string | null; audioSrc: string | null;
};

export type Challenge = {
  id: number; lessonId: number;
  type: "SELECT" | "ASSIST" | "TYPE_ANSWER" | "MATCH_PAIRS" | "FILL_IN_BLANKS" | "WORD_BANK";
  question: string; order: number; completed: boolean;
  challengeOptions: ChallengeOption[];
};

export type LessonWithChallenges = {
  id: number; title: string; order: number; unitId: number;
  challenges: Challenge[];
};

export type LessonSummary = {
  id: number; title: string; order: number; unitId: number; completed: boolean;
};

export type Unit = {
  id: number; title: string; description: string; order: number;
  courseId: number; lessons: LessonSummary[];
};

export type UserProgressType = {
  userId: number; hearts: number; points: number;
  activeCourseId: number; streak: number;
  activeCourse: Course;
};

export type Achievement = {
  id: number; title: string; description: string;
  icon: string; earned: boolean;
  xp_threshold?: number; streak_threshold?: number;
};

export type UserProfile = {
  id: number; username: string; userImageSrc: string;
  xp: number; streak: number; hearts: number;
  activeCourseId: number; activeCourse: Course | null;
  completedLessons: number; completedChallenges: number;
  achievements: Achievement[]; earnedAchievements: number;
  lastActiveDate: string | null;
};

export type LeaderboardEntry = {
  userId: number; userName: string; userImageSrc: string; points: number; streak: number;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getCourses = async (): Promise<Course[]> => {
  try {
    const res = await fetch(`${API}/courses`, { cache: "no-store" });
    return res.ok ? res.json() : [];
  } catch { return []; }
};

export const getUserProgress = async (): Promise<UserProgressType | null> => {
  try {
    const res = await fetch(`${API}/user-progress`, { cache: "no-store" });
    return res.ok ? res.json() : null;
  } catch { return null; }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${API}/users/me`, { cache: "no-store" });
    return res.ok ? res.json() : null;
  } catch { return null; }
};

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const res = await fetch(`${API}/achievements`, { cache: "no-store" });
    return res.ok ? res.json() : [];
  } catch { return []; }
};

export const getUnits = async (): Promise<Unit[]> => {
  try {
    const res = await fetch(`${API}/units`, { cache: "no-store" });
    return res.ok ? res.json() : [];
  } catch { return []; }
};

export const getLesson = async (id?: number): Promise<LessonWithChallenges | null> => {
  try {
    const url = id ? `${API}/lessons/${id}` : `${API}/lesson/active`;
    const res = await fetch(url, { cache: "no-store" });
    return res.ok ? res.json() : null;
  } catch { return null; }
};

export const getCourseProgress = async () => {
  try {
    const units = await getUnits();
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (!lesson.completed) {
          return { activeLesson: { ...lesson, unit }, activeLessonId: lesson.id };
        }
      }
    }
    const first = units[0]?.lessons[0];
    return first ? { activeLesson: { ...first, unit: units[0] }, activeLessonId: first.id } : null;
  } catch { return null; }
};

export const getLessonPercentage = async (): Promise<number> => {
  try {
    const progress = await getCourseProgress();
    if (!progress?.activeLesson) return 0;
    const lesson = await getLesson(progress.activeLessonId);
    if (!lesson) return 0;
    const completed = lesson.challenges.filter(c => c.completed).length;
    return Math.round((completed / lesson.challenges.length) * 100);
  } catch { return 0; }
};

export const getUserSubscription = async (): Promise<{ isActive: boolean } | null> => null; // No subscription in this assignment

export const getTopTenUsers = async (): Promise<LeaderboardEntry[]> => {
  try {
    const res = await fetch(`${API}/leaderboard`, { cache: "no-store" });
    return res.ok ? res.json() : [];
  } catch { return []; }
};
