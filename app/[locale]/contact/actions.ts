"use server";

import { Resend } from "resend";
import { checkBotId } from "botid/server";

export type FormState = { ok: boolean; error?: string } | null;

const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === "1";
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.CONTACT_FROM;
const TO = process.env.CONTACT_TO;

function looksLikeSpamMessage(message: string): boolean {
  const lower = message.toLowerCase();

  // Very short / low-info
  if (message.length < 25) return true;

  // Needs at least 4 "words"
  const words = message.split(/\s+/).filter(Boolean);
  if (words.length < 4) return true;

  // Too many URLs
  const urlMatches = message.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches && urlMatches.length > 2) return true;

  // Huge proportion of non-letters (symbols, numbers)
  const letters = message.match(/[a-zA-Záéíóúñü]/g)?.length ?? 0;
  if (letters / Math.max(message.length, 1) < 0.4) return true;

  // Common spam phrases you can tune over time
  const spamPhrases = [
    "guest post",
    "backlinks",
    "seo services",
    "crypto",
    "investment opportunity",
    "porn",
    "adult site",
    "onlyfans",
  ];

  if (spamPhrases.some((p) => lower.includes(p))) return true;

  return false;
}

export async function submitContact(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // 1) Botid check
    const { isBot } = DISABLE_BOTID
      ? { isBot: false }
      : await checkBotId().catch(() => ({ isBot: false }));
    if (isBot) {
      return { ok: true };
    }

    // 2) Honeypots
    const company = (formData.get("company") || "").toString().trim();
    const website = (formData.get("website") || "").toString().trim();
    if (company || website) {
      // Silent success: don't send mail, pretend OK
      return { ok: true };
    }

    // 3) Time trap: require at least 3s between render + submit
    const startedAtRaw = formData.get("formStartedAt");
    const startedAt = startedAtRaw ? Number(startedAtRaw) : 0;
    const now = Date.now();

    if (!startedAt || now - startedAt < 3000) {
      // Too fast, likely bot/script; silently ignore
      return { ok: true };
    }

    // 4) Basic field validation
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const locale = (formData.get("locale") || "en").toString();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !isEmail || !message) {
      return { ok: false, error: "invalid" };
    }

    // 5) Anti-spam heuristics
    if (looksLikeSpamMessage(message)) {
      // Silent ok to not give bots feedback
      return { ok: true };
    }

    if (!API_KEY || !FROM || !TO) {
      return { ok: false, error: "config" };
    }

    const resend = new Resend(API_KEY);

    const subjInternal =
      locale === "es"
        ? `Nuevo contacto — Horchata Labs (${name})`
        : `New contact — Horchata Labs (${name})`;

    const subjAck =
      locale === "es"
        ? "Hemos recibido tu mensaje — Horchata Labs"
        : "We received your message — Horchata Labs";

    const ackText =
      locale === "es"
        ? `Hola ${name},\n\nGracias por escribirnos. Hemos recibido tu mensaje y te responderemos en breve.\n\n— Horchata Labs`
        : `Hi ${name},\n\nThanks for reaching out. We’ve received your message and will reply shortly.\n\n— Horchata Labs`;

    // 6) Internal notification
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: subjInternal,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // 7) Auto-reply
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: subjAck,
      text: ackText,
    });

    return { ok: true };
  } catch (err: any) {
    console.error("submitContact failed:", err);
    const msg = err?.message || err?.response?.data?.message || "send-failed";
    return { ok: false, error: msg };
  }
}
