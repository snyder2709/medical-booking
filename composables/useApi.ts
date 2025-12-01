import type { NuxtApp } from "nuxt/app";

type ApiResponse<K extends keyof NuxtApp["$apiTypes"]> =
  NuxtApp["$apiTypes"][K] extends { response: infer R }
    ? R
    : NuxtApp["$apiTypes"][K];

export function useApi<K extends keyof NuxtApp["$apiTypes"]>(
  url: K,
  opts?: Parameters<typeof useFetch<ApiResponse<K>>>[1]
) {
  return useFetch<ApiResponse<K>>(url, opts);
}
