import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

function money(n: number) {
  return n.toFixed(2);
}

async function main() {
  const templatePath = path.join(process.cwd(), "lib/invoice", "invoice01.html");
  let html = fs.readFileSync(templatePath, "utf8");

  // Minimal mock data (replace only a few placeholders to get a nice PDF)
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const mock = {
    business: {
      name: "AInvoicer",
      initials: "AI",
      address: "10 High Street\nEdinburgh\nEH1 1AA",
      email: "hello@ainvoicer.com",
      phone: "07123 456 789",
      vat: "",
      companyNumber: "",
      logoUrl: "",
    },
    customer: {
      name: "John Brown",
      address: "22 Market Road\nGlasgow\nG1 2AB",
      email: "john@example.com",
      phone: "07xxx xxx xxx",
      vat: "",
    },
    invoice: {
      number: "INV-000123",
      issueDate: `${yyyy}-${mm}-${dd}`,
      dueDate: `${yyyy}-${mm}-${dd}`,
      currency: "GBP",
      symbol: "£",
      terms: "Due on receipt",
      reference: "INV-000123",
      notes: "Thanks for your business.",
      generatedAt: `${yyyy}-${mm}-${dd}`,
      poNumber: "",
    },
    totals: {
      subtotal: money(240),
      vatRate: "",
      vat: "",
      discount: "",
      total: money(240),
      amountDue: money(240),
    },
    payment: {
      link: "https://pay.example.com/inv/INV-000123",
      bankName: "Bank of Scotland",
      accountName: "AInvoicer Ltd",
      sortCode: "12-34-56",
      accountNumber: "12345678",
      iban: "",
      swift: "",
    },
    theme: { accent: "#111827", mode: "theme-bold" },
    itemsHtml: `
      <tr>
        <td class="col-desc"><div style="font-weight:700;">Call-out + repair</div><div class="t-m">Replaced faulty part</div></td>
        <td class="col-qty">1</td>
        <td class="col-rate">£240.00</td>
        <td class="col-amt">£240.00</td>
      </tr>
    `,
  };

  // Simple replacements (enough to visually test)
  // NOTE: Your template currently uses handlebars-style blocks.
  // For quick testing, we replace the major visible fields and inject items rows.
  html = html
    .replaceAll("{{theme.accent}}", mock.theme.accent)
    .replaceAll("{{theme.mode}}", mock.theme.mode)
    .replaceAll("{{business.name}}", mock.business.name)
    .replaceAll("{{business.initials}}", mock.business.initials)
    .replaceAll("{{business.address}}", mock.business.address)
    .replaceAll("{{business.email}}", mock.business.email)
    .replaceAll("{{business.phone}}", mock.business.phone)
    .replaceAll("{{invoice.number}}", mock.invoice.number)
    .replaceAll("{{invoice.issueDate}}", mock.invoice.issueDate)
    .replaceAll("{{invoice.dueDate}}", mock.invoice.dueDate)
    .replaceAll("{{invoice.currency}}", mock.invoice.currency)
    .replaceAll("{{invoice.terms}}", mock.invoice.terms)
    .replaceAll("{{invoice.reference}}", mock.invoice.reference)
    .replaceAll("{{invoice.notes}}", mock.invoice.notes)
    .replaceAll("{{invoice.generatedAt}}", mock.invoice.generatedAt)
    .replaceAll("{{invoice.symbol}}", mock.invoice.symbol)
    .replaceAll("{{customer.name}}", mock.customer.name)
    .replaceAll("{{customer.address}}", mock.customer.address)
    .replaceAll("{{customer.email}}", mock.customer.email)
    .replaceAll("{{customer.phone}}", mock.customer.phone)
    .replaceAll("{{totals.subtotal}}", mock.totals.subtotal)
    .replaceAll("{{totals.total}}", mock.totals.total)
    .replaceAll("{{totals.amountDue}}", mock.totals.amountDue);

  // Quick hack to inject line items:
  // Replace the whole {{#each items}}...{{/each}} block by finding a marker.
  html = html.replace(
    /{{#each items}}[\s\S]*?{{\/each}}/,
    mock.itemsHtml
  );

  // Remove handlebars conditionals for this test (so they don't show in output)
  html = html
    .replace(/{{#if[\s\S]*?}}/g, "")
    .replace(/{{\/if}}/g, "")
    .replace(/{{#unless[\s\S]*?}}/g, "")
    .replace(/{{\/unless}}/g, "");

  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle" });

  // Optional: save an HTML snapshot for quick viewing
  //fs.writeFileSync(path.join(process.cwd(), "scripts", "invoice.preview.html"), html, "utf8");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
  });

  await browser.close();

  const outPath = path.join(process.cwd(), "lib/scripts", "invoice.test.pdf");
  fs.writeFileSync(outPath, pdf);
  console.log("Wrote:", outPath);
  console.log("Also wrote:", path.join(process.cwd(), "scripts", "invoice.preview.html"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
