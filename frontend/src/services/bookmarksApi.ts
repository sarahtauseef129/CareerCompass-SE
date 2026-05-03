import { apiCall } from './api';

export interface BookmarkResponseDto {
  id: number;
  careerId: number;
  careerTitle: string;
  careerDescription?: string;
  createdAt: string;
}

// module-level cache so we only fetch once per session
let bookmarkCache: BookmarkResponseDto[] | null = null;

export async function getCachedBookmarks(): Promise<BookmarkResponseDto[]> {
  if (bookmarkCache !== null) return bookmarkCache;
  bookmarkCache = await apiCall<BookmarkResponseDto[]>('/bookmarks');
  return bookmarkCache;
}

export function invalidateBookmarkCache(): void {
  bookmarkCache = null;
}

export async function addBookmark(careerId: number): Promise<BookmarkResponseDto> {
  const result = await apiCall<BookmarkResponseDto>('/bookmarks', {
    method: 'POST',
    body: JSON.stringify({ careerId }),
  });
  invalidateBookmarkCache();
  return result;
}

export async function getBookmarks(): Promise<BookmarkResponseDto[]> {
  return getCachedBookmarks();
}

export async function removeBookmark(careerId: number): Promise<void> {
  await apiCall<void>(`/bookmarks/${careerId}`, {
    method: 'DELETE',
  });
  invalidateBookmarkCache();
}