import { render, screen, fireEvent } from '@testing-library/react';
import AddToCartButton from '../app/(auth)/_components/add_to_cart_button';
import { act } from '@testing-library/react';

describe('AddToCartButton', () => {
  const product = {
    _id: '1',
    name: 'Handmade Basket',
    price: 1200,
    category: 'Basket',
    image: '/basket.jpg',
    quantity: 10,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders the Add to Cart button', () => {
    render(<AddToCartButton product={product} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  test('adds a product to localStorage when clicked', () => {
    render(<AddToCartButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    const cart = JSON.parse(localStorage.getItem('nepcraft_cart') || '[]');

    expect(cart).toHaveLength(1);
    expect(cart[0]._id).toBe(product._id);
    expect(cart[0].cartQuantity).toBe(1);
  });

  test('increments quantity if product already exists', () => {
    localStorage.setItem(
      'nepcraft_cart',
      JSON.stringify([{ ...product, cartQuantity: 1 }])
    );

    render(<AddToCartButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    const cart = JSON.parse(localStorage.getItem('nepcraft_cart') || '[]');

    expect(cart).toHaveLength(1);
    expect(cart[0].cartQuantity).toBe(2);
  });

  test('displays success message after adding product', () => {
    render(<AddToCartButton product={product} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('✅ Added to Cart')).toBeTruthy();
  });


test('removes success message after 2 seconds', () => {
  render(<AddToCartButton product={product} />);

  fireEvent.click(screen.getByRole('button'));

  expect(screen.getByText('✅ Added to Cart')).toBeTruthy();

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(screen.queryByText('✅ Added to Cart')).toBeNull();
});
});
