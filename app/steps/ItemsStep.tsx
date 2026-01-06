import { Button } from "@/components/ui/button";
import { StepShell } from "@/components/StepShell";
import { InvoiceMeta, LineItem } from "@/lib/invoice/types";

type Props = {
	items: LineItem[];
	meta: InvoiceMeta;
	symbol: string;
	subtotal: number;

	actions
}

export function ItemsStep({ items, setItems}: Props) {
	return (
		<StepShell
			title="Line items"
			subtitle="What did you do, and how much?"
			hint="Tip: keep it simple. One line item is often enough."
		>
			<div className="grid gap-3">
				{items.map((it, idx) => (
					<div key={it.id} className="rounded-2xl border bg-foreground/5 p-4">
						<div className="flex items-center justify-between gap-3">
							<div className="text-base font-semibold">Item {idx + 1}</div>
							<Button
								variant="destructive"
								className="h-11"
								onClick={() => removeItem(it.id)}
								disabled={items.length <= 1}
							>
								Remove
							</Button>
						</div>

						<div className="mt-4 grid gap-3">
							<Labeled label="Description (required)">
								<Input
									className="h-12 text-base"
									value={it.description}
									onChange={(e) => updateItem(it.id, { description: e.target.value })}
									placeholder="e.g. Call-out + repair"
									inputMode="text"
								/>
							</Labeled>

							<div className="grid grid-cols-2 gap-3">
								<Labeled label="Quantity">
									<Input
										className="h-12 text-base"
										value={String(it.quantity)}
										onChange={(e) =>
											updateItem(it.id, { quantity: Number(e.target.value || 0) })
										}
										inputMode="decimal"
									/>
								</Labeled>

								<Labeled label={`Unit price (${symbol})`}>
									<Input
										className="h-12 text-base"
										value={it.unitPrice}
										onChange={(e) =>
											updateItem(it.id, { unitPrice: e.target.value })
										}
										inputMode="decimal"
									/>

								</Labeled>
							</div>

							<div className="rounded-md border bg-foreground/5 p-3 text-base text-muted-foreground">
								Line total:{" "}
								<span className="text-foreground font-semibold">
									{symbol}
									{toMoney((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}
								</span>
							</div>
							<div>
								<Dialog>
									<DialogTrigger asChild>
										<Button>Add field</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Add field to line item
											</DialogTitle>
											<DialogDescription>
												Add extra context to this line item without affecting totals.
											</DialogDescription>
										</DialogHeader>
										<div className="grid grid-cols-2 gap-3">
											<DialogClose>Cancel</DialogClose>
											<Button>Add</Button>
										</div>

									</DialogContent>
								</Dialog>
							</div>
						</div>
					</div>
				))}

				<Button className="h-12 my-2" onClick={addItem}>
					Add another line item
				</Button>
			</div>

			<div className="rounded-2xl border bg-foreground/4 p-4 flex items-center justify-between text-base">
				<span className="text-muted-foreground font-medium">Subtotal</span>
				<span className="font-bold">
					{symbol}
					{toMoney(subtotal)}
				</span>
			</div>


			<div className="mt-6 rounded-2xl border bg-foreground/5 p-4">
				<div className="grid grid-cols-2 gap-3 p-2 ">
					<Labeled label="Invoice number">
						<Input
							className="h-12 text-base"
							value={meta.invoiceNumber}
							onChange={(e) => setMeta((p) => ({ ...p, invoiceNumber: e.target.value }))}
						/>
					</Labeled>

					<Labeled label="Issue date">
						<Input
							className="h-12 text-base"
							type="date"
							value={meta.issueDate}
							onChange={(e) => setMeta((p) => ({ ...p, issueDate: e.target.value }))}
						/>
					</Labeled>

					<Labeled label="Due date">
						<Input
							className="h-12 text-base"
							type="date"
							value={meta.dueDate}
							onChange={(e) => setMeta((p) => ({ ...p, dueDate: e.target.value }))}
						/>
					</Labeled>
				</div>

				<div className="mt-3 p-2">
					<Labeled label="Notes (optional)">
						<Textarea
							className="min-h-24 text-base"
							value={meta.notes}
							onChange={(e) => setMeta((p) => ({ ...p, notes: e.target.value }))}
							placeholder="e.g. Thanks for your business."
						/>
					</Labeled>
				</div>
			</div>
		</StepShell>
	)
}