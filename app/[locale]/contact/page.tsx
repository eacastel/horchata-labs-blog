
// app/[locale]/contact/page.tsx

export default function Contact() {
  return (
    <section className="space-y-4">
      <h1>Contact</h1>
      <p>
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
          formAction="#"
        >
          Send
        </button>
      </form>
    </section>
  );
}
