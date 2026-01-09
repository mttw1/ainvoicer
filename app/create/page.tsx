"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
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
import { clamp, calcSubtotal } from "@/lib/invoice/maths";
import { BusinessStep } from "../steps/BusinessStep";
import { CustomerStep } from "../steps/CustomerStep";
import { ItemsStep } from "../steps/ItemsStep";
import { GenerateStep } from "../steps/GenerateStep";

export default function CreateInvoicePage() {
	const today = React.useMemo(() => new Date(), []);
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const dd = String(today.getDate()).padStart(2, "0");
	const isoToday = `${yyyy}-${mm}-${dd}`;

	const [stepIndex, setStepIndex] = React.useState(0);
	const [dir, setDir] = React.useState(1);

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
		if (canGoNext) {
			setDir(1);
			goTo(stepIndex + 1);
		}
	}

	function back() {
		if (canGoBack) {
			setDir(-1);
			goTo(stepIndex - 1);
		}
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

	const updateItem = React.useCallback((id: string, patch: Partial<LineItem>) => {
		setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
	}, []);

	const addItem = React.useCallback(() => {
		setItems((prev) => [...prev, { id: uid(), description: "", quantity: 1, unitPrice: "0" }]);
	}, []);

	const removeItem = React.useCallback((id: string) => {
		setItems((prev) => (prev.length <= 1 ? prev : prev.filter((it) => it.id !== id)));
	}, []);

	const updateMeta = React.useCallback((patch: Partial<InvoiceMeta>) => {
		setMeta((p) => ({ ...p, ...patch }));
	}, []);

	const actions = React.useMemo(
		() => ({ updateItem, addItem, removeItem, updateMeta }),
		[updateItem, addItem, removeItem, updateMeta]
	);

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
								<ItemsStep
									items={items}
									meta={meta}
									symbol={symbol}
									subtotal={subtotal}
									actions={actions}
								/>
							)}

							{step === "Generate" && (
								<GenerateStep
									business={business}
									customer={customer}
									meta={meta}
									items={items}
									symbol={symbol}
									subtotal={subtotal}
									validation={validation}
									onGenerate={generateInvoice}
								/>
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