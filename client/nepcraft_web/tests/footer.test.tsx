import { render, screen } from '@testing-library/react';
import Footer from '../app/(auth)/_components/footer';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

describe('Footer Component', () => {
  test('renders the NepCraft brand name', () => {
    render(<Footer />);
    expect(screen.getByText(/NepCraft/i)).toBeTruthy();
  });

  test('renders all footer section headings', () => {
    render(<Footer />);

    expect(screen.getByText('Shop')).toBeTruthy();
    expect(screen.getByText('Others')).toBeTruthy();
    expect(screen.getByText('Help')).toBeTruthy();
    expect(screen.getByText('Newsletter')).toBeTruthy();
  });

  test('renders newsletter email input', () => {
    render(<Footer />);

    expect(
      screen.getByPlaceholderText('Enter your email')
    ).toBeTruthy();
  });

  test('renders important navigation links', () => {
    render(<Footer />);

    expect(screen.getByText('About Us')).toBeTruthy();
    expect(screen.getByText('Wishlist')).toBeTruthy();
    expect(screen.getByText("FAQ's")).toBeTruthy();
  });

  test('renders copyright text', () => {
    render(<Footer />);

    expect(
      screen.getByText(/2026 NepCraft. All rights reserved./i)
    ).toBeTruthy();
  });
});