import { render, screen, waitFor } from '@testing-library/react';
import OrdersPage from '../app/(protected)/order/page';

const pushMock = jest.fn();

// Mock Header
jest.mock('../app/(auth)/_components/header', () => () => (
  <div data-testid="header">Header</div>
));

// Mock Footer
jest.mock('../app/(auth)/_components/footer', () => () => (
  <div data-testid="footer">Footer</div>
));

// Mock Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('OrdersPage', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              {
                _id: '123',
                totalAmount: 2500,
                status: 'Delivered',
                address: 'Kathmandu',
                city: 'Kathmandu',
                paymentMethod: 'COD',
                items: [
                  {
                    _id: '1',
                    quantity: 2,
                    price: 1250,
                    product: {
                      name: 'Wooden Mask',
                      image: 'mask.jpg',
                    },
                  },
                ],
              },
            ],
          }),
      })
    ) as jest.Mock;
  });

  test('renders header and footer', async () => {
    render(<OrdersPage />);

    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  test('renders page heading', () => {
    render(<OrdersPage />);

    expect(screen.getByText('My Purchase History')).toBeTruthy();
  });

  test('fetches and displays order details', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Wooden Mask')).toBeTruthy();
    });
  });

  test('displays total amount', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/Rs 2,500/i)).toHaveLength(2);
    });
  });

  test('displays shipping location', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Kathmandu, Kathmandu/i)).toBeTruthy();
    });
  });

  test('displays payment method', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('COD')).toBeTruthy();
    });
  });

  test('displays order status', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Delivered')).toBeTruthy();
    });
  });
});