"use server";

import { Resend } from "resend";
import { checkBotId } from "botid/server";

export type FormState =
  | { ok: true }
  | { ok: false; error: "invalid" | "config" | "generic" }
  | null;

const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === "1";
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.CONTACT_FROM;
const TO = process.env.CONTACT_TO;

export async function submitContact(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // 1) BotId check (soft-fail to "not bot" on error)
    const { isBot } = DISABLE_BOTID
      ? { isBot: false }
      : await checkBotId().catch((err) => {
          console.error("checkBotId failed:", err);
          return { isBot: false };
        });

    if (isBot) {
      console.warn("Blocked by BotId");
      // Treat this as invalid so UI uses the generic invalid text
      return { ok: false, error: "invalid" };
    }

    // 2) Honeypots
    const company = (formData.get("company") || "").toString().trim();
    const website = (formData.get("website") || "").toString().trim();
    if (company || website) {
      console.warn("Honeypot triggered:", { company, website });
      // Quietly fail as "invalid" to avoid giving hints to bots
      return { ok: false, error: "invalid" };
    }

    // 3) Time trap: require at least 1s between render + submit
    const startedAtRaw = formData.get("formStartedAt");
    const startedAt = startedAtRaw ? Number(startedAtRaw) : 0;
    const now = Date.now();

    if (!startedAtRaw) {
      console.warn("Missing formStartedAt – skipping time trap but continuing");
    } else if (Number.isFinite(startedAt) && now - startedAt < 1000) {
      console.warn("Blocked by time trap (submitted too fast)");
      return { ok: false, error: "invalid" };
    }

    // 4) Basic field validation
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const locale = (formData.get("locale") || "en").toString();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Keep this simple: just require some chars, valid email, and non-empty message
    if (!name || !isEmail || !message) {
      console.warn("Invalid fields:", {
        name,
        email,
        messageLen: message.length,
      });
      return { ok: false, error: "invalid" };
    }

    // 5) Env checks
    if (!API_KEY || !FROM || !TO) {
      console.error("Missing mail env vars", {
        hasAPI_KEY: !!API_KEY,
        FROM,
        TO,
      });
      return { ok: false, error: "config" };
    }

    const resend = new Resend(API_KEY);

    // 6) Subjects & texts (ES/EN)
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

    // 7) Internal notification
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: subjInternal,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // 8) Auto-reply
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: subjAck,
      text: ackText,
    });

    console.log("submitContact completed OK");
    return { ok: true };
  } catch (err) {
    console.error("submitContact failed:", err);
    // Don’t leak internal error messages into the UI – use generic
    return { ok: false, error: "generic" };
  }
}
