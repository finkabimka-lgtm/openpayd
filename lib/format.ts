export function formatEUR(amount: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

export function fullName(user: { name: string; surname: string }) {
  return `${user.name} ${user.surname}`.trim();
}
