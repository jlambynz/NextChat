import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryString(
  searchParams: URLSearchParams,
  name: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);

  return `?${params.toString()}`;
}

export function removeQueryString(searchParams: URLSearchParams, name: string) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(name);
  const newParams = params.toString();

  return newParams ? `?${params.toString()}` : "";
}
