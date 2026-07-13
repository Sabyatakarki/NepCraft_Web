import { render, screen, waitFor } from '@testing-library/react';
import ArtisansPage from '../app/(auth)/artisans/page';

// Mock Header
jest.mock('../app/(auth)/_components/header', () => () => (
  <div data-testid="header">Header</div>
));

// Mock Footer
jest.mock('../app/(auth)/_components/footer', () => () => (
  <div data-testid="footer">Footer</div>
));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('ArtisansPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            artisans: [
              {
                _id: '1',
                name: 'Ram Bahadur',
                role: 'Pottery',
                location: 'Bhaktapur',
                bio: 'Experienced pottery artisan',
                image: '/artisan.jpg',
                experience: 10,
              },
            ],
          }),
      })
    ) as jest.Mock;

    localStorage.clear();
  });

  test('renders header and footer', async () => {
    render(<ArtisansPage />);

    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  test('renders hero section title', async () => {
    render(<ArtisansPage />);

    expect(
      screen.getByText('The Heart Behind Every Handmade Piece')
    ).toBeTruthy();
  });

  test('fetches and displays artisan data', async () => {
    render(<ArtisansPage />);

    await waitFor(() => {
      expect(screen.getByText('Ram Bahadur')).toBeTruthy();
    });
  });

  test('renders search input', () => {
    render(<ArtisansPage />);

    expect(
      screen.getByPlaceholderText('Search artisans...')
    ).toBeTruthy();
  });

  test('renders View Profile button', async () => {
    render(<ArtisansPage />);

    await waitFor(() => {
      expect(screen.getByText('View Profile')).toBeTruthy();
    });
  });
});