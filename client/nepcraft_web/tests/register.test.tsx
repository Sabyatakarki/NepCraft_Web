import { render, screen } from '@testing-library/react';
import RegisterPage from '../app/(auth)/register/page';

// Mock the RegisterForm component
jest.mock('../app/(auth)/_components/registerform', () => () => (
  <div data-testid="register-form">Register Form</div>
));

describe('Register Page', () => {
  test('renders the register page successfully', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-form')).toBeTruthy();
  });

  test('displays the register form', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-form')).toBeTruthy();
  });

  test('displays the NepCraft image', () => {
    render(<RegisterPage />);
    expect(screen.getByAltText('NepCraft')).toBeTruthy();
  });

  test('contains one image element', () => {
    render(<RegisterPage />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  test('renders without crashing', () => {
    const { container } = render(<RegisterPage />);
    expect(container).toBeTruthy();
  });
});