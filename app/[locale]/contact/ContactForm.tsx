"use server";

import { Resend } from "resend";
import { checkBotId } from "botid/server";

export type FormState = { ok: boolean; error?: string } | null;

const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === "1";
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.CONTACT_FROM;
const TO = process.env.CONTACT_TO;

// Minimum length for a “real” message
const MIN_MSG_LEN = 60;

/**
 * Very conservative spam heuristic.
 * We only block if it's clearly junk (lots of URLs or classic spam phrases).
 */
function looksClearlySpammy(message: string): boolean {
  const lower = message.toLowerCase();

  // Too many URLs
  const urlMatches = message.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches && urlMatches.length > 3) return true;

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
    // Debug summary (safe to keep, or comment out later)
    console.log("submitContact formData summary:", {
      company: formData.get("company"),
      website: formData.get("website"),
      formStartedAt: formData.get("formStartedAt"),
      name: formData.get("name"),
      email: formData.get("email"),
      messageLen: (formData.get("message") || "").toString().length,
      locale: formData.get("locale"),
    });

    // 1) BotId check
    const { isBot } = DISABLE_BOTID
      ? { isBot: false }
      : await checkBotId().catch((err) => {
          console.error("checkBotId failed:", err);
          return { isBot: false };
        });

    if (isBot) {
      console.warn("Blocked by BotId");
      // Pretend OK to bots, avoid error UI
      return { ok: true };
    }

    // 2) Honeypots
    const company = (formData.get("company") || "").toString().trim();
    const website = (formData.get("website") || "").toString().trim();
    if (company || website) {
      console.warn("Honeypot triggered:", { company, website });
      // Silent success: don’t send email, don’t show error
      return { ok: true };
    }

    // 3) Time trap: require at least 1s between render + submit
    const startedAtRaw = formData.get("formStartedAt");
    const startedAt = startedAtRaw ? Number(startedAtRaw) : 0;
    const now = Date.now();

    if (!startedAtRaw) {
      console.warn("Missing formStartedAt – skipping time trap but continuing");
    } else if (Number.isFinite(startedAt) && now - startedAt < 1000) {
      console.warn("Blocked by time trap, submitted too fast");
      // Again: silent success, looks OK to bots
      return { ok: true };
    }

    // 4) Basic field validation
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const locale = (formData.get("locale") || "en").toString();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !isEmail || !message) {
      console.warn("Invalid fields:", {
        name,
        email,
        messageLen: message.length,
      });
      return { ok: false, error: "invalid" };
    }

    // 5) Enforce minimum message length (UX-visible error)
    if (message.length < MIN_MSG_LEN) {
      console.warn("Message too short:", { messageLen: message.length });
      return { ok: false, error: "tooShort" };
    }

    // 6) Heuristic spam check (silent discard if obviously spam)
    if (looksClearlySpammy(message)) {
      console.warn("Blocked by spam heuristic");
      return { ok: true };
    }

    // 7) Env sanity check
    if (!API_KEY || !FROM || !TO) {
      console.error("Missing mail env vars", {
        hasAPI_KEY: !!API_KEY,
        FROM,
        TO,
      });
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

    console.log("Calling Resend for internal + ack");

    // 8) Internal notification
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: subjInternal,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // 9) Auto-reply
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: subjAck,
      text: ackText,
    });

    console.log("submitContact completed OK");
    return { ok: true };
  } catch (err: any) {
    console.error("submitContact failed:", err);
    const msg = err?.message || err?.response?.data?.message || "send-failed";
    return { ok: false, error: msg };
  }
}
