'use server';

import { Resend } from 'resend';
import { checkBotId } from 'botid/server';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function submitContact(formData: FormData) {
    // Bot protection (Vercel)
    const { isBot } = await checkBotId().catch(() => ({ isBot: false }));
    if (isBot) return { ok: true };

    // Honeypot
    const hp = (formData.get('company') || '').toString().trim();
    if (hp) return { ok: true };

    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();
    const locale = (formData.get('locale') || 'en').toString();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !isEmail || !message) return { ok: false, error: 'Invalid' };

    // i18n strings
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

    const internalHtml = `
    <h2>${subjInternal}</h2>
    <p><strong>Name/Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message/Mensaje:</strong></p>
    <p>${message.replace(/\n/g, '<br/>')}</p>
  `;

    // Send to internal inbox
    await resend.emails.send({
        from: process.env.CONTACT_FROM!,
        to: process.env.CONTACT_TO!,
        replyTo: email,          // <- fix
        subject: subjInternal,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<h2>${subjInternal}</h2> ...`,
    });

    // Acknowledge to user
    await resend.emails.send({
        from: process.env.CONTACT_FROM!,
        to: email,
        subject: subjAck,
        text: ackText,
        html: `<p>${ackText.replace(/\n/g, '<br/>')}</p>`,
    });

    return { ok: true };
}
