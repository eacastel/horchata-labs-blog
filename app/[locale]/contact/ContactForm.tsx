"use client";

import { useRef, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { FormState } from "./actions";

export default function ContactForm({
  locale,
  action,
}: {
  locale: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const t = useTranslations("contact");
  const router = useRouter();

  const initialState: FormState = null;
  const [state, formAction] = useFormState<FormState, FormData>(
    action,
    initialState
  );
  const { pending } = useFormStatus();

  // Time-trap: freeze first render time
  const startedAtRef = useRef<string>("");
  if (!startedAtRef.current) {
    startedAtRef.current = Date.now().toString();
  }

  // Redirect after success
  useEffect(() => {
    if (state?.ok) {
      router.push(`/${locale}?contact=ok`);
    }
  }, [state?.ok, router, locale]);

  // Map error codes from FormState -> translation keys
  const errKey =
    state && !state.ok
      ? state.error === "invalid"
        ? "error.invalid"
        : state.error === "tooShort"
        ? "error.tooShort"
        : state.error === "config"
        ? "error.config"
        : "error.generic"
      : null;

  const errMsg = errKey ? t(errKey) : null;

  return (
    <form
      action={formAction}
      method="post"
      noValidate
      className="space-y-3 max-w-md"
    >
      {/* Locale for ES / EN handling in the server action */}
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

      {/* Error inline */}
      {!state?.ok && errMsg && (
        <p className="text-sm text-red-600">{errMsg}</p>
      )}
    </form>
  );
}
