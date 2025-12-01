"use client";

import { useEffect, useRef } from "react";
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

  // Freeze first render time for time-trap
  const startedAtRef = useRef<string>("");
  if (!startedAtRef.current) {
    startedAtRef.current = Date.now().toString();
  }

  const errMsg =
    state?.error === "invalid"
      ? t("error.invalid")
      : state?.error === "config"
      ? t("error.config")
      : state?.error
      ? t("error.generic")
      : null;

  // Soft redirect after success
  useEffect(() => {
    if (state?.ok) {
      const timer = setTimeout(() => {
        router.push("/"); // change to "/gracias" if you create a thank-you page
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state?.ok, router]);

  return (
    <div className="space-y-3 max-w-md">
      {/* Success banner */}
      {state?.ok && (
        <div className="mb-3 rounded-md border border-green-600 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300">
          {t("success")}
        </div>
      )}

      {/* Error banner */}
      {!state?.ok && errMsg && (
        <div className="mb-3 rounded-md border border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
          {errMsg}
        </div>
      )}

      <form action={formAction} method="post" noValidate className="space-y-3">
        {/* Locale for ES / EN handling in the server action */}
        <input type="hidden" name="locale" value={locale} />

        {/* Time trap */}
        <input
          type="hidden"
          name="formStartedAt"
          value={startedAtRef.current}
        />

        {/* Honeypots (hidden from humans, bots love these) */}
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
          className="inline-flex items-center justify-center px-5 py-2 rounded-md border font-medium hover:opacity-90 disabled:opacity-60"
        >
          {pending ? t("sending") : t("send")}
        </button>
      </form>
    </div>
  );
}
