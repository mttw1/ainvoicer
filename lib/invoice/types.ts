export type BusinessDetails = {
	businessName: string;
	email: string;
	phone: string;
	address: string;
	vatNumber: string;
};

export type CustomerDetails = {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerAddress: string;
};

export type LineItem = {
	id: string;
	description: string;
	quantity: number;
	unitPrice: string;
};

export type InvoiceMeta = {
	invoiceNumber: string;
	issueDate: string; // YYYY-MM-DD
	dueDate: string; // YYYY-MM-DD
	notes: string;
	currency: "GBP";
};

export const steps = ["Business", "Customer", "Items", "Generate"] as const;
export type Step = (typeof steps)[number];

export const currencySymbol: Record<InvoiceMeta["currency"], string> = { GBP: "£" };