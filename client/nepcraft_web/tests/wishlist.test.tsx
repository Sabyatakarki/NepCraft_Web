import { render, screen, fireEvent } from '@testing-library/react';
import WishlistButton from '../app/(auth)/_components/wishlist_btn';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('WishlistButton', () => {
  const product = {
    _id: '1',
    name: 'Handmade Vase',
    price: 1200,
  };

  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
    window.alert = jest.fn();
  });

  test('renders the wishlist button', () => {
    render(<WishlistButton product={product} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  test('adds product to localStorage when clicked', () => {
    render(<WishlistButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    const wishlist = JSON.parse(
      localStorage.getItem('nepcraft_wishlist') || '[]'
    );

    expect(wishlist).toHaveLength(1);
    expect(wishlist[0]._id).toBe(product._id);
  });

  test('does not add duplicate products', () => {
    localStorage.setItem('nepcraft_wishlist', JSON.stringify([product]));

    render(<WishlistButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    const wishlist = JSON.parse(
      localStorage.getItem('nepcraft_wishlist') || '[]'
    );

    expect(wishlist).toHaveLength(1);
  });

  test('shows success alert after adding to wishlist', () => {
    render(<WishlistButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    expect(window.alert).toHaveBeenCalledWith('❤️ Added to Wishlist');
  });

  test('redirects user to wishlist page', () => {
    render(<WishlistButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    expect(pushMock).toHaveBeenCalledWith('/wishlist');
  });
});