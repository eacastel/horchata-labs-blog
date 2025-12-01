"use client";

import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import type { FormState } from "./actions";

export default function ContactForm({
  locale,
  action,
}: {
  locale: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const t = useTranslations("contact");
  const initialState: FormState = null;

  const [state, formAction] = useFormState<FormState, FormData>(
    action,
    initialState
  );

  const { pending } = useFormStatus();

  // Freeze first render time for time-trap
  const startedAtRef = useRef<string>("");
  if (!startedAtRef.current) {
    startedAtRef.current = Date.now().toString();
  }

  // Map error codes from server → translation keys
  let errKey: "invalid" | "config" | "spam" | "generic" | null = null;

  if (state?.error === "invalid") errKey = "invalid";
  else if (state?.error === "config") errKey = "config";
  else if (state?.error === "spam") errKey = "spam";
  else if (state?.error) errKey = "generic";

  const errMsg = errKey ? t(`error.${errKey}`) : null;

  return (
    <form
      action={formAction}
      method="post"
      noValidate
      className="space-y-3 max-w-md"
    >
      {/* Locale for ES / EN handling on the server */}
      <input type="hidden" name="locale" value={locale} />

      {/* Time trap */}
      <input
        type="hidden"
        name="formStartedAt"
        value={startedAtRef.current}
      />

      {/* Honeypots */}
      <input
        type="text"
        name="company"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Real fields */}
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
        disabled={pending}
        className="inline-flex items-center justify-center px-5 py-2 rounded-md border font-medium hover:opacity-90"
      >
        {pending ? t("sending") : t("send")}
      </button>

      {state?.ok && (
        <p className="text-sm text-green-600">{t("success")}</p>
      )}
      {!state?.ok && errMsg && (
        <p className="text-sm text-red-600">{errMsg}</p>
      )}
    </form>
  );
}
