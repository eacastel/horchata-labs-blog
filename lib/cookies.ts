// lib/cookies.ts (helpers for future funnel/home overrides)

"use server";

import { cookies } from "next/headers";

type HomeCookieKey = "hl_home";
type HomeCookieValue = "concierge" | "car-broker" | "used-car-broker";

export async function setHomeCookie(
  key: HomeCookieKey,
  value: HomeCookieValue
) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}

export async function getHomeCookie(key: HomeCookieKey) {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}
