/** Gera um código curto de pedido, ex: #1024 */
export function generateOrderCode(): string {
  const n = 1000 + Math.floor(Math.random() * 9000);
  return `#${n}`;
}
