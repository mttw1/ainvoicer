import { Input } from "@/components/ui/input";
import { Labeled } from "@/components/Labeled";
import { Textarea } from "@/components/ui/textarea";
import { StepShell } from "@/components/StepShell";
import { BusinessDetails } from "@/lib/invoice/types";

type Props = {
	business: BusinessDetails;
	setBusiness: React.Dispatch<React.SetStateAction<BusinessDetails>>;
}

export function BusinessStep({ business, setBusiness }: Props) {
	return (
		<StepShell
			title="Business details"
			subtitle="These appear at the top of your invoice."
			hint="Swipe left to continue."
		>
			<Labeled label="Business name (required)">
				<Input
					className="h-12 text-base"
					value={business.businessName}
					onChange={(e) => setBusiness((p) => ({ ...p, businessName: e.target.value }))}
					placeholder="e.g. Smith Electrical"
					inputMode="text"
					autoComplete="organization"
				/>
			</Labeled>

			<Labeled label="Email">
				<Input
					className="h-12 text-base"
					value={business.email}
					onChange={(e) => setBusiness((p) => ({ ...p, email: e.target.value }))}
					placeholder="you@business.com"
					inputMode="email"
					autoComplete="email"
				/>
			</Labeled>

			<Labeled label="Phone">
				<Input
					className="h-12 text-base"
					value={business.phone}
					onChange={(e) => setBusiness((p) => ({ ...p, phone: e.target.value }))}
					placeholder="e.g. 07..."
					inputMode="tel"
					autoComplete="tel"
				/>
			</Labeled>

			<Labeled label="Address">
				<Textarea
					className="min-h-24 text-base"
					value={business.address}
					onChange={(e) => setBusiness((p) => ({ ...p, address: e.target.value }))}
					placeholder="Street, town, postcode"
				/>
			</Labeled>

			<Labeled label="VAT number (optional)">
				<Input
					className="h-12 text-base"
					value={business.vatNumber}
					onChange={(e) => setBusiness((p) => ({ ...p, vatNumber: e.target.value }))}
					placeholder="GB..."
					inputMode="text"
				/>
			</Labeled>
		</StepShell>
	)
}