// api/auth.ts

// Get JWT token from localStorage
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }
  
  // Set JWT token to localStorage
  export function setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  }
  
  // Remove JWT token from localStorage (logout)
  export function removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
  }
  