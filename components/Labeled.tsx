export function Labeled(props: { label: string; children: React.ReactNode }) {
	return (
		<label className="block">
			<div className="mb-2 text-base font-medium">{props.label}</div>
			{props.children}
		</label>
	);
}