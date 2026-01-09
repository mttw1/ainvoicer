import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Labeled } from "@/components/Labeled";
import { StepShell } from "@/components/StepShell";
import { LineItemCard } from "@/components/LineItemCard";

type LineItem = { id: string; description: string; quantity: number; unitPrice: string };
type InvoiceMeta = { invoiceNumber: string; issueDate: string; dueDate: string; notes: string; currency: "GBP" };

function toMoney(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

type Props = {
  items: LineItem[];
  meta: InvoiceMeta;
  symbol: string;
  subtotal: number;
  actions: {
    updateItem: (id: string, patch: Partial<LineItem>) => void;
    addItem: () => void;
    removeItem: (id: string) => void;
    updateMeta: (patch: Partial<InvoiceMeta>) => void;
  };
};

export function ItemsStep({ items, meta, symbol, subtotal, actions }: Props) {
  return (
    <StepShell
      title="Line items"
      subtitle="What did you do, and how much?"
      hint="Tip: keep it simple. One line item is often enough."
    >
      <div className="grid gap-3">
        {items.map((it, idx) => (
          <LineItemCard
            key={it.id}
            item={it}
            index={idx}
            symbol={symbol}
            canRemove={items.length > 1}
            onRemove={() => actions.removeItem(it.id)}
            onUpdate={(patch) => actions.updateItem(it.id, patch)}
          />
        ))}

        <Button className="h-12 my-2" onClick={actions.addItem}>
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
        <div className="grid grid-cols-2 gap-3 p-2">
          <Labeled label="Invoice number">
            <Input
              className="h-12 text-base"
              value={meta.invoiceNumber}
              onChange={(e) => actions.updateMeta({ invoiceNumber: e.target.value })}
            />
          </Labeled>

          <Labeled label="Issue date">
            <Input
              className="h-12 text-base"
              type="date"
              value={meta.issueDate}
              onChange={(e) => actions.updateMeta({ issueDate: e.target.value })}
            />
          </Labeled>

          <Labeled label="Due date">
            <Input
              className="h-12 text-base"
              type="date"
              value={meta.dueDate}
              onChange={(e) => actions.updateMeta({ dueDate: e.target.value })}
            />
          </Labeled>
        </div>

        <div className="mt-3 p-2">
          <Labeled label="Notes (optional)">
            <Textarea
              className="min-h-24 text-base"
              value={meta.notes}
              onChange={(e) => actions.updateMeta({ notes: e.target.value })}
              placeholder="e.g. Thanks for your business."
            />
          </Labeled>
        </div>
      </div>
    </StepShell>
  );
}
