import { API_BASE_URL } from "@/constants/api";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  status_code: number;
  data: T;
}

export async function serverFetch<T>(
  endpoint: string,
  options?: { revalidate?: number; searchParams?: Record<string, string> }
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (options?.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: options?.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (json.status === "error") {
    throw new Error(json.message);
  }

  return json.data;
}
