import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col max-w-3xl mx-auto px-2">
			<div className="py-8">
				<h1 className="text-h1 text-center">Invoice in seconds.</h1>
				<h2 className="text-h2 text-center">From the palm of your hand.</h2>
				<p className="text-center p-4">Create and send professional invoices from your phone.<br />No laptop. No spreadsheets. No faff.</p>
			</div>
			<div className="flex flex-col bg-neutral-900 p-4 m-2 rounded-xl border-t border-l">
				<h2 className="text-h4 text-center">Launch Offer: Three for free</h2>
				<p className="text-center">Try AInvoicer now & get three generations for free then simple, transparent pricing afterwards.</p>
				<Button className="justify-center items-center my-2 mx-auto">Create an invoice now</Button>
			</div>
			<h3 className="text-h3 text-center">Pricing</h3>
			<div className="flex flex-col bg-neutral-900 p-4 m-2 rounded-xl border-t border-l">
				<h2 className="text-h4 text-center">£4.99/month</h2>
				<p className="text-center">Try AInvoicer now & get three generations for free then simple, transparent pricing afterwards.</p>
				<li>100 Invoices/month</li>
			</div>
			<Button className="justify-center items-center my-2 mx-auto">Subscribe</Button>
		</div>
	);
}
