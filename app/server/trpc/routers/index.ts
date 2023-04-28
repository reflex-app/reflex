import { procedure, router } from '../trpc'

export const appRouter = router({
  // greeting: procedure
  //   .input(z.object({ name: z.string() }).nullish())
  //   .query(({ input }) => {
  //     return `hello ${input?.name ?? "world"}!`;
  //   }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
