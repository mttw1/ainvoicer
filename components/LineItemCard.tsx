import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Labeled } from "@/components/Labeled";

type LineItem = {
  id: string;
  description: string;
  quantity: number;     // (later make this string)
  unitPrice: string;
};

function toMoney(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

type Props = {
  item: LineItem;
  index: number;
  symbol: string;
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (patch: Partial<LineItem>) => void;
};

export function LineItemCard({ item, index, symbol, canRemove, onRemove, onUpdate }: Props) {
  const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

  return (
    <div className="rounded-2xl border bg-foreground/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-base font-semibold">Item {index + 1}</div>
        <Button variant="destructive" className="h-11" onClick={onRemove} disabled={!canRemove}>
          Remove
        </Button>
      </div>

      <div className="mt-4 grid gap-3">
        <Labeled label="Description (required)">
          <Input
            className="h-12 text-base"
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="e.g. Call-out + repair"
            inputMode="text"
          />
        </Labeled>

        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Quantity">
            <Input
              className="h-12 text-base"
              value={String(item.quantity)}
              onChange={(e) => onUpdate({ quantity: Number(e.target.value || 0) })}
              inputMode="decimal"
            />
          </Labeled>

          <Labeled label={`Unit price (${symbol})`}>
            <Input
              className="h-12 text-base"
              value={item.unitPrice}
              onChange={(e) => onUpdate({ unitPrice: e.target.value })}
              inputMode="decimal"
            />
          </Labeled>
        </div>

        <div className="rounded-md border bg-foreground/5 p-3 text-base text-muted-foreground">
          Line total:{" "}
          <span className="text-foreground font-semibold">
            {symbol}
            {toMoney(lineTotal)}
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'secondary'}>Add field</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add field to line item</DialogTitle>
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
  );
}
