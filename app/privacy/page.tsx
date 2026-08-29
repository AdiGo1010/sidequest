import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-12 text-sm leading-7 text-ink-soft">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Privacy Policy</h1>
      <p className="mt-6">
        Draft notice for the Privacy Act 1988 (Cth). We collect the email, profile, and
        task data you submit so the marketplace can function.
      </p>
      <h2 className="mt-8 text-lg font-semibold text-ink">Calendar</h2>
      <p className="mt-2">
        If you connect Google Calendar we read event times to suggest gigs and, with
        your confirmation, create SideQuest events. We do not sell calendar contents.
      </p>
      <h2 className="mt-8 text-lg font-semibold text-ink">Demo mode</h2>
      <p className="mt-2">
        Without Supabase, profile and task data stay in your browser (localStorage).
        With Supabase, they live in your project — pick an AU region at setup.
      </p>
      <p className="mt-10">
        <Link href="/" className="font-medium text-ink">
          Back home
        </Link>
      </p>
    </article>
  );
}
