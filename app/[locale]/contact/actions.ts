'use server';

import { Resend } from 'resend';
import { checkBotId } from 'botid/server';

const API_KEY = process.env.RESEND_API_KEY!;
const FROM = process.env.CONTACT_FROM!;
const TO = process.env.CONTACT_TO!;

export async function submitContact(formData: FormData) {
  try {
    if (!API_KEY || !FROM || !TO) {
      console.error('Missing env: RESEND_API_KEY/CONTACT_FROM/CONTACT_TO');
      return { ok: false, error: 'Server not configured' };
    }

    const { isBot } = await checkBotId().catch(() => ({ isBot: false }));
    if (isBot) return { ok: true };

    // Honeypot
    if ((formData.get('company') || '').toString().trim()) return { ok: true };

    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();
    const locale = (formData.get('locale') || 'en').toString();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !isEmail || !message) return { ok: false, error: 'Invalid form' };

    const resend = new Resend(API_KEY);

    const subjInternal =
      locale === 'es'
        ? `Nuevo contacto — Horchata Labs (${name})`
        : `New contact — Horchata Labs (${name})`;

    const subjAck =
      locale === 'es'
        ? 'Hemos recibido tu mensaje — Horchata Labs'
        : 'We received your message — Horchata Labs';

    const ackText =
      locale === 'es'
        ? `Hola ${name},\n\nGracias por escribirnos. Hemos recibido tu mensaje y te responderemos en breve.\n\n— Horchata Labs`
        : `Hi ${name},\n\nThanks for reaching out. We’ve received your message and will reply shortly.\n\n— Horchata Labs`;

    // Send to us
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email, // <- correct key
      subject: subjInternal,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<h2>${subjInternal}</h2>
             <p><b>Name/Nombre:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message/Mensaje:</b></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>`
    });

    // Acknowledge to user
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: subjAck,
      text: ackText,
      html: `<p>${ackText.replace(/\n/g, '<br/>')}</p>`
    });

    return { ok: true };
  } catch (err) {
    console.error('contact action failed:', err);
    return { ok: false, error: 'Send failed' };
  }
}
