// ==============================
// lib/cookies.ts (helpers for future funnel/home overrides)
// ==============================
'use server'
import { cookies } from 'next/headers'


export async function setHomeCookie(key: 'hl_home', value: 'concierge' | 'car-broker' | 'used-car-broker') {
    cookies().set(key, value, { maxAge: 60 * 60 * 24 * 365, path: '/' })
}


export function getHomeCookie(key: 'hl_home') {
    return cookies().get(key)?.value
}