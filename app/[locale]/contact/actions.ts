"use server";

import { Resend } from "resend";
import { checkBotId } from "botid/server";

export type FormState = { ok: boolean; error?: string } | null;

const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === "1";
const API_KEY = process.env.RESEND_API_KEY!;
const FROM = process.env.CONTACT_FROM!;
const TO = process.env.CONTACT_TO!;

export async function submitContact(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // BotId check
    const { isBot } = DISABLE_BOTID
      ? { isBot: false }
      : await checkBotId().catch(() => ({ isBot: false }));
    if (isBot) return { ok: true }; // silently drop

    // Honeypots: company + website
    const company = (formData.get("company") || "").toString().trim();
    const website = (formData.get("website") || "").toString().trim();
    if (company || website) {
      // Bot filled hidden fields -> act like success, but don't send
      return { ok: true };
    }

    // Time trap: reject ultra-fast submissions
    const formStartedAtRaw = (formData.get("formStartedAt") || "").toString();
    if (formStartedAtRaw) {
      const startedAt = Number(formStartedAtRaw);
      if (!Number.isNaN(startedAt)) {
        const elapsed = Date.now() - startedAt;
        // < 3 seconds = highly likely bot
        if (elapsed < 3000) {
          return { ok: true }; // again, pretend success
        }
      }
    }

    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const locale = (formData.get("locale") || "en").toString();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !isEmail || !message) {
      return { ok: false, error: "invalid" };
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

    // Internal notification
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: subjInternal,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // Ack to user
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
