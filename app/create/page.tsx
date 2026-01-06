"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Labeled } from "@/components/Labeled";
import { StepShell } from "@/components/StepShell";
import { useSwipe } from "@/hooks/useSwipe";
import {
	BusinessDetails,
	CustomerDetails,
	LineItem,
	InvoiceMeta,
	steps,
	Step,
	currencySymbol
} from "@/lib/invoice/types";
import { uid } from "@/lib/uid";

import { clamp, toMoney, calcSubtotal } from "@/lib/invoice/maths";
import { BusinessStep } from "../steps/BusinessStep";
import { CustomerStep } from "../steps/CustomerStep";

export default function CreateInvoicePage() {
	const today = React.useMemo(() => new Date(), []);
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const dd = String(today.getDate()).padStart(2, "0");
	const isoToday = `${yyyy}-${mm}-${dd}`;

	const [stepIndex, setStepIndex] = React.useState(0);

	const [business, setBusiness] = React.useState<BusinessDetails>({
		businessName: "",
		email: "",
		phone: "",
		address: "",
		vatNumber: "",
	});

	const [customer, setCustomer] = React.useState<CustomerDetails>({
		customerName: "",
		customerEmail: "",
		customerPhone: "",
		customerAddress: "",
	});

	const [meta, setMeta] = React.useState<InvoiceMeta>({
		invoiceNumber: `AIX-000001`,
		issueDate: isoToday,
		dueDate: isoToday,
		notes: "",
		currency: "GBP",
	});

	const [items, setItems] = React.useState<LineItem[]>([
		{ id: uid(), description: "", quantity: 1, unitPrice: "0" },
	]);

	const step: Step = steps[stepIndex];
	const progress = ((stepIndex + 1) / steps.length) * 100;

	const canGoBack = stepIndex > 0;
	const canGoNext = stepIndex < steps.length - 1;

	const subtotal = calcSubtotal(items);
	const symbol = currencySymbol[meta.currency];

	const validation = React.useMemo(() => {
		const hasBusiness = business.businessName.trim().length > 0;
		const hasCustomer = customer.customerName.trim().length > 0;
		const hasAtLeastOneLine = items.some(
			(it) => it.description.trim().length > 0 && (Number(it.quantity) || 0) > 0
		);

		const businessOk = hasBusiness; // keep lean: only require business name
		const customerOk = hasCustomer; // only require customer name
		const itemsOk = hasAtLeastOneLine;

		const stepOk =
			step === "Business" ? businessOk : step === "Customer" ? customerOk : step === "Items" ? itemsOk : true;

		return { businessOk, customerOk, itemsOk, stepOk };
	}, [business.businessName, customer.customerName, items, step]);

	function goTo(i: number) {
		setStepIndex(clamp(i, 0, steps.length - 1));
	}

	function next() {
		if (step === "Business" && !validation.businessOk) return;
		if (step === "Customer" && !validation.customerOk) return;
		if (step === "Items" && !validation.itemsOk) return;
		if (canGoNext) goTo(stepIndex + 1);
	}

	function back() {
		if (canGoBack) goTo(stepIndex - 1);
	}

	const swipe = useSwipe(
		() => {
			// swipe left -> next
			if (canGoNext) next();
		},
		() => {
			// swipe right -> back
			if (canGoBack) back();
		}
	);

	function updateItem(id: string, patch: Partial<LineItem>) {
		setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
	}

	function addItem() {
		setItems((prev) => [...prev, { id: uid(), description: "", quantity: 1, unitPrice: "0" }]);
	}

	function removeItem(id: string) {
		setItems((prev) => (prev.length <= 1 ? prev : prev.filter((it) => it.id !== id)));
	}

	function generateInvoice() {
		// Replace this with your real generation flow (PDF, email, save to DB, etc.)
		const payload = {
			business,
			customer,
			meta,
			items: items.filter((it) => it.description.trim().length > 0),
			totals: { subtotal },
		};

		console.log("INVOICE_PAYLOAD", payload);
		alert("Invoice generated (placeholder). Check console for payload.");
	}

	const variants = {
		enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
	};

	const [dir, setDir] = React.useState(1);
	React.useEffect(() => setDir(1), [stepIndex]);

	return (
		<div className="min-h-dvh bg-background text-foreground">
			{/* Top progress */}
			<header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
				<div className="mx-auto max-w-xl px-4 py-3">
					<div className="flex items-center justify-between">
						<div className="text-base font-semibold tracking-tight">Create invoice</div>
						<div className="text-base text-muted-foreground">
							{stepIndex + 1}/{steps.length}
						</div>
					</div>

					<div className="mt-3">
						<div className="h-2 w-full rounded-full bg-foreground/10">
							<div
								className="h-2 rounded-full bg-foreground/30 transition-[width] duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<div className="mt-2 flex justify-between text-base text-muted-foreground">
							{steps.map((s, i) => (
								<p
									key={s}
									className={`underline-offset-4 ${i === stepIndex ? "text-foreground" : ""}`}
								>
									{s}
								</p>
							))}
						</div>
					</div>
				</div>
			</header>

			{/* Full-screen carousel */}
			<main className="mx-auto max-w-xl px-4">
				<div
					className="relative overflow-hidden"
					style={{ minHeight: "calc(100dvh - 160px)" }} // header + footer space
					{...swipe}
				>
					<AnimatePresence mode="popLayout" initial={false} custom={dir}>
						<motion.section
							key={step}
							custom={dir}
							variants={variants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.2 }}
							className="py-6"
						>
							{step === "Business" && (
								<BusinessStep business={business} setBusiness={setBusiness} />
							)}

							{step === "Customer" && (
								<CustomerStep customer={customer} setCustomer={setCustomer} />
							)}

							{step === "Items" && (
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
							)}

							{step === "Generate" && (
								<StepShell
									title="Generate"
									subtitle="Quick check before you send."
									hint="Tap Generate to finish."
								>
									<div className="rounded-2xl border bg-foreground/4 p-4">

										<div className="justify-end">
											<div className="text-lg font-semibold">{business.businessName || "Your business"}</div>
											<div className="mt-1 text-base text-muted-foreground">
												{business.email || "Email"} • {business.phone || "Phone"}
											</div>
											{business.address ? (
												<div className="mt-2 text-base text-muted-foreground whitespace-pre-line">
													{business.address}
												</div>
											) : null}
										</div>
										<div className="border my-4" />
										<div className="text-right">
											<div className="flex justify-between items-center">
												<div className="text-base text-muted-foreground">Invoice</div>
												<div className="text-lg font-semibold">{meta.invoiceNumber}</div>
											</div>
											<div className="flex justify-between items-center">

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
												<div className="mt-2 text-base text-muted-foreground whitespace-pre-line">
													{customer.customerAddress}
												</div>
											) : null}
										</div>

										<div className="mt-6 space-y-3">
											{items
												.filter((it) => it.description.trim().length > 0)
												.map((it) => (
													<div key={it.id} className="rounded-2xl border bg-background p-4">
														<div className="flex items-start justify-between gap-4">
															<div className="text-base font-semibold">{it.description}</div>
															<div className="text-base text-muted-foreground">
																{it.quantity} × {symbol}
																{toMoney(parseFloat(it.unitPrice))}
															</div>
														</div>
														<div className="mt-2 text-base">
															Line total:{" "}
															<span className="font-semibold">
																{symbol}
																{toMoney((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}
															</span>
														</div>
													</div>
												))}
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
											<Button
												className="h-11 text-lg"
												onClick={generateInvoice}
												disabled={!validation.businessOk || !validation.customerOk || !validation.itemsOk}
											>
												Generate invoice
											</Button>

											<div className="rounded-2xl text-base text-center text-muted-foreground">
												You can edit anything before sending. Swipe right to go back.
											</div>
										</div>
									</div>
								</StepShell>
							)}
						</motion.section>
					</AnimatePresence>
				</div>
			</main>

			{/* Bottom controls */}
			<footer className="sticky bottom-0 z-40 border-t bg-background/90 backdrop-blur">
				<div className="mx-auto max-w-xl px-4 py-3">
					<div className="flex items-center justify-between gap-3">
						<Button className="h-12 flex-1" variant="secondary" onClick={back} disabled={!canGoBack}>
							Back
						</Button>

						<Button
							className="h-12 flex-1"
							onClick={() => {
								setDir(1);
								next();
							}}
							disabled={!canGoNext || !validation.stepOk}
						>
							{stepIndex === steps.length - 2 ? "Review" : "Next"}
						</Button>
					</div>

					<div className="mt-2 text-center text-base text-muted-foreground">
						Swipe left/right to move between steps
					</div>
				</div>
			</footer>
		</div>
	);
}