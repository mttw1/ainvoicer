import * as React from "react";
import { StepShell } from "@/components/StepShell";
import { BusinessDetails, CustomerDetails, InvoiceMeta, LineItem } from "@/lib/invoice/types";
import { toMoney } from "@/lib/invoice/maths";
import { Button } from "@/components/ui/button";

type ValidationState = {
	businessOk: boolean;
	customerOk: boolean;
	itemsOk: boolean;
};

type Props = {
	business: BusinessDetails;
	meta: InvoiceMeta;
	customer: CustomerDetails;
	items: LineItem[];
	symbol: string;
	subtotal: number;
	onGenerate: () => void;
	validation: ValidationState;
};

export function GenerateStep({
	business,
	meta,
	customer,
	items,
	symbol,
	subtotal,
	onGenerate,
	validation,
}: Props) {
	const displayItems = React.useMemo(
		() => items.filter((it) => it.description.trim().length > 0),
		[items]
	);

	const canGenerate = validation.businessOk && validation.customerOk && validation.itemsOk;

	return (
		<StepShell title="Generate" subtitle="Quick check before you send." hint="Tap Generate to finish.">
			<div className="rounded-2xl border bg-foreground/4 p-4">
				<div>
					<div className="text-lg font-semibold">{business.businessName || "Your business"}</div>
					<div className="mt-1 text-base text-muted-foreground">
						{business.email || "Email"} • {business.phone || "Phone"}
					</div>
					{business.address ? (
						<div className="mt-2 text-base text-muted-foreground whitespace-pre-line">{business.address}</div>
					) : null}
				</div>

				<div className="border my-4" />

				<div className="text-right">
					<div className="flex justify-between items-center">
						<div className="text-base text-muted-foreground">Invoice</div>
						<div className="text-lg font-semibold">{meta.invoiceNumber}</div>
					</div>

					<div className="mt-1 text-base text-center text-muted-foreground">
						Issue: {meta.issueDate}
						<br />
						Due: {meta.dueDate}
					</div>
				</div>

				<div className="mt-4 rounded-2xl border bg-background p-4">
					<div className="text-base text-muted-foreground">Bill to</div>
					<div className="mt-1 text-lg font-semibold">{customer.customerName || "Customer"}</div>
					<div className="mt-1 text-base text-muted-foreground">
						{customer.customerEmail || "Email"} • {customer.customerPhone || "Phone"}
					</div>
					{customer.customerAddress ? (
						<div className="mt-2 text-base text-muted-foreground whitespace-pre-line">{customer.customerAddress}</div>
					) : null}
				</div>

				<div className="mt-6 space-y-3">
					{displayItems.map((it) => {
						const unit = Number(it.unitPrice) || 0;
						const qty = Number(it.quantity) || 0;
						const lineTotal = qty * unit;

						return (
							<div key={it.id} className="rounded-2xl border bg-background p-4">
								<div className="flex items-start justify-between gap-4">
									<div className="text-base font-semibold">{it.description}</div>
									<div className="text-base text-muted-foreground">
										{qty} × {symbol}
										{toMoney(unit)}
									</div>
								</div>

								<div className="mt-2 text-base">
									Line total:{" "}
									<span className="font-semibold">
										{symbol}
										{toMoney(lineTotal)}
									</span>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-6 rounded-2xl border bg-foreground/5 p-4">
					<div className="flex items-center justify-between text-base">
						<span className="font-semibold">Subtotal</span>
						<span className="font-semibold">
							{symbol}
							{toMoney(subtotal)}
						</span>
					</div>
				</div>

				{meta.notes ? (
					<div className="mt-6 rounded-2xl border bg-background p-4">
						<div className="text-base text-muted-foreground">Notes</div>
						<div className="mt-2 text-base whitespace-pre-line">{meta.notes}</div>
					</div>
				) : null}

				<div className="mt-4 grid gap-3">
					<Button className="h-11 text-lg" onClick={onGenerate} disabled={!canGenerate}>
						Generate invoice
					</Button>

					{!canGenerate ? (
						<div className="rounded-2xl text-base text-center text-muted-foreground">
							Missing required details — swipe back and complete the earlier steps.
						</div>
					) : (
						<div className="rounded-2xl text-base text-center text-muted-foreground">
							You can edit anything before sending. Swipe right to go back.
						</div>
					)}
				</div>
			</div>
		</StepShell>
	);
}
