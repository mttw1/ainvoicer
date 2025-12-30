import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Top bar */}
			<header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
					<div className="flex items-center gap-2">
						<div className="h-7 w-7 rounded-lg bg-foreground/10" />
						<span className="text-base font-semibold tracking-tight">AInvoicer</span>
					</div>
					<Link href="/create">
						<Button className="px-2">Create your first invoice</Button>
					</Link>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4">
				{/* Hero */}
				<section className="pt-12 pb-10">
					<div className="grid gap-8 lg:grid-cols-2 lg:items-center">
						<div>
							<h1 className="text-h1 leading-tight tracking-tight">
								Beautiful invoices.
								<br />
								Instantly.
								<br />
								From your phone.
							</h1>

							<p className="mt-4 text-lg text-muted-foreground">
								Built for self-employed professionals who want to get paid.
								<br />
								No laptop. No spreadsheets. No faff.
							</p>

							<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
								<Button className="h-11 px-6">Create your first invoice now</Button>
								<p className="text-base text-muted-foreground">
									Free • No credit card • Takes 60 seconds
								</p>
							</div>

							{/* Trust chips */}
							<div className="mt-6 flex flex-wrap gap-2">
								{["No subscription", "Credits never expire", "Made for trades & solo workers"].map(
									(t) => (
										<span
											key={t}
											className="rounded-full border bg-foreground/5 px-3 py-1 text-base text-muted-foreground"
										>
											{t}
										</span>
									)
								)}
							</div>
						</div>

						{/* Product visual placeholder */}
						<div className="rounded-2xl border bg-foreground/5 p-4">
							<div className="rounded-xl border bg-background p-4">
								<div className="flex items-center justify-between">
									<div className="h-3 w-24 rounded bg-foreground/10" />
									<div className="h-3 w-16 rounded bg-foreground/10" />
								</div>

								<div className="mt-6 space-y-3">
									<div className="h-3 w-32 rounded bg-foreground/10" />
									<div className="h-3 w-44 rounded bg-foreground/10" />
									<div className="h-3 w-40 rounded bg-foreground/10" />
								</div>

								<div className="mt-6 rounded-lg border bg-foreground/5 p-3">
									<div className="flex items-center justify-between">
										<div className="h-3 w-24 rounded bg-foreground/10" />
										<div className="h-3 w-20 rounded bg-foreground/10" />
									</div>
									<div className="mt-3 space-y-2">
										<div className="h-3 w-full rounded bg-foreground/10" />
										<div className="h-3 w-5/6 rounded bg-foreground/10" />
									</div>
								</div>

								<div className="mt-6 flex items-center justify-between">
									<div className="h-8 w-28 rounded-md bg-foreground/10" />
									<div className="h-8 w-28 rounded-md bg-foreground/10" />
								</div>
							</div>

							<p className="mt-3 text-center text-base text-muted-foreground">
								(Swap this placeholder for a real screenshot/mock when ready.)
							</p>
						</div>
					</div>
				</section>

				{/* How it works */}
				<section className="py-10">
					<div className="flex flex-col justify-between gap-2">
						<h2 className="text-h2">How it works</h2>
						<p className="text-base text-muted-foreground">No setup. No learning curve.</p>
					</div>

					<div className="mt-6 grid gap-4 md:grid-cols-3">
						{[
							{ title: "Finish the job.", desc: "You’re done — don’t leave money on the table." },
							{ title: "Create the invoice.", desc: "One minute on your phone." },
							{ title: "Send it. Get paid.", desc: "Professional invoice, sent instantly." },
						].map((s) => (
							<div key={s.title} className="rounded-2xl border bg-foreground/4 p-4">
								<h3 className="text-lg font-semibold">{s.title}</h3>
								<p className="mt-2 text-base text-muted-foreground">{s.desc}</p>
							</div>
						))}
					</div>

					<p className="mt-6 text-center text-base">It’s that simple.</p>
				</section>

				{/* Built for */}
				<section className="py-10">
					<h2 className="text-h2">Built for people who do the work</h2>

					<div className="mt-6 rounded-2xl border bg-foreground/5 p-2">
						<div className="grid gap-2 sm:grid-cols-2">
							{["Tradespeople", "Contractors", "Freelancers", "Self-employed professionals"].map(
								(t) => (
									<div key={t} className="rounded-xl border bg-background p-4">
										<p className="text-lg font-medium">{t}.</p>
									</div>
								)
							)}
						</div>

						<div className="mt-4 rounded-xl border bg-background p-4">
							<p className="text-lg font-medium">Anyone who invoices after the work is done.</p>
							<p className="mt-2 text-base text-muted-foreground">
								If you send hundreds of invoices a month, this probably isn’t for you.
							</p>
						</div>
					</div>
				</section>

				{/* Pricing */}
				<section className="py-10">
					<div className="flex flex-col items-start justify-between gap-2">
						<h2 className="text-h2">Pricing</h2>
						<p className="text-base text-muted-foreground">No subscription • Pay per invoice</p>
					</div>

					<div className="mt-6 grid gap-4 md:grid-cols-3">
						<div className="rounded-2xl border bg-foreground/5 p-6">
							<p className="text-base text-muted-foreground">Try it</p>
							<p className="mt-2 text-2xl font-semibold">3 invoices</p>
							<p className="mt-1 text-lg text-muted-foreground">Free</p>
							<p className="mt-3 text-base text-muted-foreground">No card required.</p>
						</div>

						<div className="rounded-2xl border bg-foreground/5 p-6">
							<p className="text-base text-muted-foreground">Most popular</p>
							<p className="mt-2 text-2xl font-semibold">10 invoices</p>
							<p className="mt-1 text-lg text-muted-foreground">£4</p>
							<p className="mt-3 text-base text-muted-foreground">Credits never expire.</p>
						</div>

						<div className="rounded-2xl border bg-foreground/5 p-6">
							<p className="text-base text-muted-foreground">For regular work</p>
							<p className="mt-2 text-2xl font-semibold">30 invoices</p>
							<p className="mt-1 text-lg text-muted-foreground">£9</p>
							
							<p className="mt-3 text-base text-muted-foreground">Better value per invoice.</p>
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className="pb-16 pt-4">
					<div className="rounded-2xl border bg-foreground/5 p-4 text-center">
						<h2 className="text-2xl font-semibold tracking-tight">Create your first invoice now</h2>
						<p className="mt-2 text-base text-muted-foreground">
							Free • No credit card • Takes 60 seconds
						</p>
						<Button className="mt-6 px-8">Create your first invoice</Button>
					</div>
				</section>
			</main>
		</div>
	);
}
