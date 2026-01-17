// Admin configuration
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "adminjack";

// Helper function to check if a user is admin
export function isAdminUser(email: string | null | undefined): boolean {
  return email === ADMIN_USERNAME;
}
