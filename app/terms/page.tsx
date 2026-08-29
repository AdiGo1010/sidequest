import Link from "next/link";

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-12 text-sm leading-7 text-ink-soft">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Terms of Service</h1>
      <p className="mt-6">
        SideQuest is a marketplace connecting Australian university students with people
        who need short tasks done. These terms are a launch stub until counsel reviews
        them against the Australian Consumer Law.
      </p>
      <h2 className="mt-8 text-lg font-semibold text-ink">Accounts</h2>
      <p className="mt-2">
        Student accounts that accept work need a university email (.edu.au).
        International students must provide a visa copy and are capped at 48 hours
        per fortnight. Domestic students have no cap. Clients may use any email to
        post work. You are responsible for gigs you accept; clients are responsible
        for accurate briefs and agreed pay (minimum $40, adult rate).
      </p>
      <h2 className="mt-8 text-lg font-semibold text-ink">Fees</h2>
      <p className="mt-2">
        Live payments and commission (positioned below typical Airtasker client fees)
        will run through Stripe AU once an ABN and dispute process are in place. Demo
        mode records budgets only.
      </p>
      <h2 className="mt-8 text-lg font-semibold text-ink">Equipment</h2>
      <p className="mt-2">
        Rentals are between the renter and SideQuest operations. Return gear on time
        and in the condition you collected it.
      </p>
      <p className="mt-10">
        <Link href="/" className="font-medium text-ink">
          Back home
        </Link>
      </p>
    </article>
  );
}
