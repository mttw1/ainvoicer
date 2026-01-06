import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StepShell } from "@/components/StepShell"
import { Labeled } from "@/components/Labeled"
import { CustomerDetails } from "@/lib/invoice/types"

type Props = {
	customer: CustomerDetails;
	setCustomer: React.Dispatch<React.SetStateAction<CustomerDetails>>;
}

export function CustomerStep({ customer, setCustomer }: Props) {
	return (
		<StepShell title="Customer details" subtitle="Who are you billing?" hint="Swipe left to continue.">
			<Labeled label="Customer name (required)">
				<Input
					className="h-12 text-base"
					value={customer.customerName}
					onChange={(e) => setCustomer((p) => ({ ...p, customerName: e.target.value }))}
					placeholder="e.g. John Brown"
					inputMode="text"
					autoComplete="name"
				/>
			</Labeled>

			<Labeled label="Email">
				<Input
					className="h-12 text-base"
					value={customer.customerEmail}
					onChange={(e) => setCustomer((p) => ({ ...p, customerEmail: e.target.value }))}
					placeholder="customer@email.com"
					inputMode="email"
					autoComplete="email"
				/>
			</Labeled>

			<Labeled label="Phone">
				<Input
					className="h-12 text-base"
					value={customer.customerPhone}
					onChange={(e) => setCustomer((p) => ({ ...p, customerPhone: e.target.value }))}
					placeholder="e.g. 07..."
					inputMode="tel"
					autoComplete="tel"
				/>
			</Labeled>

			<Labeled label="Address">
				<Textarea
					className="min-h-24 text-base"
					value={customer.customerAddress}
					onChange={(e) => setCustomer((p) => ({ ...p, customerAddress: e.target.value }))}
					placeholder="Street, town, postcode"
				/>
			</Labeled>
		</StepShell>
	)
}