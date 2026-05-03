import { getAllCareers, CareerResponseDto } from './careersApi';

let cache: CareerResponseDto[] | null = null;

export async function getCachedCareers(): Promise<CareerResponseDto[]> {
  if (cache) return cache;
  cache = await getAllCareers();
  return cache;
}
export function titleToBackendId(
  title: string,
  careers: CareerResponseDto[]
): number | null {
  const normalized = title.toLowerCase().trim();
  const match = careers.find(
    (c) => c.title.toLowerCase().trim() === normalized
  );
  return match ? match.id : null;
}