// ==============================
// app/[locale]/contact/page.tsx
// ==============================
export default function Contact() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Contact</h1>
      <p className="text-neutral-600">
        Drop your email and what you need. (Wire up to Formspark/Resend later.)
      </p>
      <form className="space-y-3 max-w-md">
        <input
          name="email"
          placeholder="you@company.com"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Tell us about your funnel/site."
          className="w-full border p-2 rounded h-32"
        />
        <button
          className="px-4 py-2 border rounded hover:bg-brand hover:text-black"
          formAction="#"
        >
          Send
        </button>
      </form>
    </section>
  );
}
