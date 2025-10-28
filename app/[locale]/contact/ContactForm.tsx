"use client";

import { useFormState, useFormStatus } from "react-dom";
// ✅ named type import (not default)
import type { FormState } from "./actions";

export default function ContactForm({
  locale,
  action,
  t,
}: {
  locale: string;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  t: (k: string) => string;
}) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState<FormState, FormData>(action, initialState);
  const { pending } = useFormStatus();

  const errMsg =
    state?.error === "invalid"
      ? t("error.invalid")
      : state?.error === "config"
      ? t("error.config")
      : state?.error
      ? t("error.generic")
      : null;

  return (
    <form action={formAction} method="post" noValidate className="space-y-3 max-w-md">
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* fields… */}

      <button type="submit" disabled={pending}
        className="inline-flex items-center justify-center px-5 py-2 rounded-md border font-medium hover:opacity-90">
        {pending ? t("sending") : t("send")}
      </button>

      {state?.ok && <p className="text-sm text-green-600">{t("success")}</p>}
      {!state?.ok && errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
    </form>
  );
}
