/**
 * Simulates API delay by returning a Promise that resolves after the specified milliseconds
 * @param ms - Delay time in milliseconds (0-10000)
 */
export const simulateDelay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
