"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { FormEvent } from "react";

type SubmitFn = (formData: FormData) => Promise<{ ok: boolean; error?: string }>;

export default function ContactForm({
  locale,
  action,
  t,
}: {
  locale: string;
  action: SubmitFn;
  t: (k: string) => string;
}) {
  const [state, formAction] = useFormState(action as any, null);
  const { pending } = useFormStatus();

  // map server error codes -> localized messages
  const errMsg = state?.error
    ? state.error === "invalid"
      ? t("error.invalid")
      : state.error === "config"
      ? t("error.config")
      : t("error.generic")
    : null;

  return (
    <form action={formAction} noValidate className="space-y-3 max-w-md">
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <input
        name="name"
        placeholder={t("namePlaceholder")}
        className="w-full border p-2 rounded bg-white dark:bg-neutral-900"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="you@company.com"
        className="w-full border p-2 rounded bg-white dark:bg-neutral-900"
        required
      />
      <textarea
        name="message"
        placeholder={t("messagePlaceholder")}
        className="w-full border p-2 rounded h-32 bg-white dark:bg-neutral-900"
        required
      />

      <button
        type="submit"
        className="inline-flex items-center justify-center px-5 py-2 rounded-md border font-medium hover:opacity-90"
        disabled={pending}
      >
        {pending ? t("sending") : t("send")}
      </button>

      {state?.ok && <p className="text-sm text-green-600">{t("success")}</p>}
      {!state?.ok && errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
    </form>
  );
}
