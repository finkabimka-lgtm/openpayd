import { Decimal } from "@prisma/client/runtime/library";

export function formatEUR(value: Decimal | number | string) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value));
}
