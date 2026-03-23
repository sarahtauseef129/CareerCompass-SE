import { AssessmentData } from "@/types/assessment";
import { Bookmark, Feedback, User, RoadmapStatus } from "@/types/career";
import { getCurrentUserFromStorage as getBackendUser, logoutUserApi } from "./authApi";

const KEYS = {
  USER: "cc_user",
  ASSESSMENT: "cc_assessment",
  BOOKMARKS: "cc_bookmarks",
  FEEDBACK: "cc_feedback",
  ROADMAP_PROGRESS: "cc_roadmap_progress",
  STARTED_ROADMAPS: "cc_started_roadmaps",
  USERS_DB: "cc_users_db",
};

function getUserScopedKey(baseKey: string): string {
  const user = getCurrentUser();
  if (!user) return baseKey;
  return `${baseKey}_${user.id}`;
}

function migrateLegacyUserData(): void {
  // Disabled on purpose.
  // Old global localStorage data does not belong safely to any one user.
}

// Generate simple UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Simple local auth
export function registerUser(email: string, password: string, name: string): User | null {
  const db: Record<string, { password: string; user: User }> = JSON.parse(
    localStorage.getItem(KEYS.USERS_DB) || "{}"
  );

  if (db[email]) return null;

  const user: User = { id: generateId(), email, name };
  db[email] = { password, user };

  localStorage.setItem(KEYS.USERS_DB, JSON.stringify(db));

  // Do not auto-login on signup
  return user;
}

export function loginUser(email: string, password: string): User | null {
  const db: Record<string, { password: string; user: User }> = JSON.parse(
    localStorage.getItem(KEYS.USERS_DB) || "{}"
  );

  const entry = db[email];
  if (!entry || entry.password !== password) return null;

  localStorage.setItem(KEYS.USER, JSON.stringify(entry.user));
  return entry.user;
}

export function logoutUser(): void {
  // Try backend logout first
  try {
    logoutUserApi();
  } catch (error) {
    console.error("Backend logout failed:", error);
  }
  
  // Always clear local storage
  localStorage.removeItem(KEYS.USER);
}

export function getCurrentUser(): User | null {
  // Try backend user first
  const backendUser = getBackendUser();
  if (backendUser) return backendUser;
  
  // Fallback to local storage
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
}

// Assessment
export function saveAssessment(data: AssessmentData): void {
  const key = getUserScopedKey(KEYS.ASSESSMENT);
  localStorage.setItem(key, JSON.stringify(data));
}

export function getAssessment(): AssessmentData | null {
  const key = getUserScopedKey(KEYS.ASSESSMENT);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Bookmarks
export function getBookmarks(): Bookmark[] {
  const key = getUserScopedKey(KEYS.BOOKMARKS);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function addBookmark(careerId: string): void {
  const key = getUserScopedKey(KEYS.BOOKMARKS);
  const bookmarks = getBookmarks();

  if (!bookmarks.find((b) => b.careerId === careerId)) {
    bookmarks.push({ careerId, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(careerId: string): void {
  const key = getUserScopedKey(KEYS.BOOKMARKS);
  const bookmarks = getBookmarks().filter((b) => b.careerId !== careerId);
  localStorage.setItem(key, JSON.stringify(bookmarks));
}

export function isBookmarked(careerId: string): boolean {
  return getBookmarks().some((b) => b.careerId === careerId);
}

// Roadmap progress — 3-state: not_started / in_progress / completed
export function getAllRoadmapProgress(): Record<string, Record<number, RoadmapStatus>> {
  const key = getUserScopedKey(KEYS.ROADMAP_PROGRESS);
  return JSON.parse(localStorage.getItem(key) || "{}");
}

export function getRoadmapProgress(careerId: string): Record<number, RoadmapStatus> {
  const key = getUserScopedKey(KEYS.ROADMAP_PROGRESS);
  const all = JSON.parse(localStorage.getItem(key) || "{}");
  const raw = all[careerId] || {};

  const result: Record<number, RoadmapStatus> = {};

  for (const k of Object.keys(raw)) {
    const val = raw[k];
    if (val === true) result[Number(k)] = "completed";
    else if (val === false) result[Number(k)] = "not_started";
    else if (typeof val === "string") result[Number(k)] = val as RoadmapStatus;
    else result[Number(k)] = "not_started";
  }

  return result;
}

export function setRoadmapStepStatus(
  careerId: string,
  orderIndex: number,
  status: RoadmapStatus
): void {
  const key = getUserScopedKey(KEYS.ROADMAP_PROGRESS);
  const all = JSON.parse(localStorage.getItem(key) || "{}");

  if (!all[careerId]) all[careerId] = {};
  all[careerId][orderIndex] = status;

  localStorage.setItem(key, JSON.stringify(all));
}

export function cycleRoadmapStep(careerId: string, orderIndex: number): RoadmapStatus {
  const progress = getRoadmapProgress(careerId);
  const current = progress[orderIndex] || "not_started";

  const next: RoadmapStatus =
    current === "not_started"
      ? "in_progress"
      : current === "in_progress"
      ? "completed"
      : "not_started";

  setRoadmapStepStatus(careerId, orderIndex, next);
  return next;
}

// Started roadmaps — explicit user action to begin a roadmap
export function getStartedRoadmaps(): string[] {
  const key = getUserScopedKey(KEYS.STARTED_ROADMAPS);
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function isRoadmapStarted(careerId: string): boolean {
  return getStartedRoadmaps().includes(careerId);
}

export function startRoadmap(careerId: string): void {
  const key = getUserScopedKey(KEYS.STARTED_ROADMAPS);
  const started = getStartedRoadmaps();

  if (!started.includes(careerId)) {
    started.push(careerId);
    localStorage.setItem(key, JSON.stringify(started));
  }
}

// Feedback
export function saveFeedback(feedback: Feedback): void {
  const key = getUserScopedKey(KEYS.FEEDBACK);
  const all: Feedback[] = JSON.parse(localStorage.getItem(key) || "[]");
  all.push(feedback);
  localStorage.setItem(key, JSON.stringify(all));
}

export function getAllFeedback(): Feedback[] {
  const key = getUserScopedKey(KEYS.FEEDBACK);
  return JSON.parse(localStorage.getItem(key) || "[]");
}