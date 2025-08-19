import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import AdminSpace from "./AdminSpace";

// Mock Auth context
const mockAuthState: any = {
  user: null,
  isAuthenticated: false,
  signOut: vi.fn(),
};
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

// Mock LoginDialog
vi.mock("./auth/LoginDialog", () => ({
  default: () => <div data-testid="login-dialog">Login</div>,
}));

// Mock supabase client
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}));

// Mock toast hook
vi.mock("./ui/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe("AdminSpace", () => {
  test("shows login dialog when not authenticated", () => {
    mockAuthState.isAuthenticated = false;
    mockAuthState.user = null;
    render(<AdminSpace />);
    expect(screen.getByTestId("login-dialog")).toBeInTheDocument();
  });

  test("shows login dialog when authenticated but not admin", () => {
    mockAuthState.isAuthenticated = true;
    mockAuthState.user = { role: "client" };
    render(<AdminSpace />);
    expect(screen.getByTestId("login-dialog")).toBeInTheDocument();
  });

  test("shows admin space after successful admin login", async () => {
    mockAuthState.isAuthenticated = false;
    mockAuthState.user = null;
    const { rerender } = render(<AdminSpace />);
    expect(screen.getByTestId("login-dialog")).toBeInTheDocument();

    mockAuthState.isAuthenticated = true;
    mockAuthState.user = { role: "admin" };
    rerender(<AdminSpace />);
    expect(await screen.findByText(/Espace Administration/i)).toBeInTheDocument();
  });
});
