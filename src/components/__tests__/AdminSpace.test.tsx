import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AdminSpace from '../AdminSpace';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'admin@lecompasolfactif.com', role: 'admin' },
    isAuthenticated: true,
    register: vi.fn(),
  }),
}));

vi.mock('../auth/LoginDialog', () => ({ default: () => null }));
vi.mock('../HomeLayout', () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock('../ui/button', () => ({ Button: ({ children, ...props }: any) => <button {...props}>{children}</button> }));
vi.mock('../ui/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: async () => ({ data: null, error: { message: 'fail' } }),
      }),
    }),
  },
}));

test('renders error message when data loading fails', async () => {
  render(<AdminSpace />);
  const message = await screen.findByText('Erreur lors du chargement des utilisateurs');
  expect(message).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByText(/Chargement des données/)).not.toBeInTheDocument();
  });
});
