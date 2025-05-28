export async function fetchPrice(symbol: string) {
    // Replace with real API/backend
    // For MVP, return dummy data:
    return {
      symbol,
      price: symbol === "AAPL" ? 190.14 : 800.55,
      timestamp: new Date().toISOString(),
    };
  }
  