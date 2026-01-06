export function StepShell(props: { title: string; subtitle: string; hint: string; children: React.ReactNode }) {
	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">{props.title}</h1>
				<p className="mt-2 text-base text-muted-foreground">{props.subtitle}</p>
				<p className="mt-2 text-base text-muted-foreground">{props.hint}</p>
			</div>

			<div className="space-y-4">{props.children}</div>
		</div>
	);
}