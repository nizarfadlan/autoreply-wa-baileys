export function delay() {
  const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1) + 30);
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}
