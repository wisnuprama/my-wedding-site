/**
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    return Promise.all([
      import("@/core/instrumentation").then((m) => m.default),
    ]);
  }
}
