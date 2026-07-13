import { render, screen } from '@testing-library/react';
import LoginPage from '../app/(auth)/login/page';

jest.mock('../app/(auth)/_components/loginfrom', () => () => (
  <div data-testid="login-form">Login Form</div>
));

describe('Login Page', () => {
  test('renders the login page successfully', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeTruthy();
  });

  test('displays the login form', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeTruthy();
  });

  test('displays the login image', () => {
    render(<LoginPage />);
    expect(screen.getByAltText('login')).toBeTruthy();
  });

  test('contains one image element', () => {
    render(<LoginPage />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  test('renders without crashing', () => {
    const { container } = render(<LoginPage />);
    expect(container).toBeTruthy();
  });
});