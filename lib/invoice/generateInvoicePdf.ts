import { chromium } from "@playwright/test";

export async function generateInvoicePdf(html: string): Promise<Buffer> {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle",
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "14mm",
      right: "14mm",
      bottom: "14mm",
      left: "14mm",
    },
  });

  await browser.close();

  return pdf;
}
