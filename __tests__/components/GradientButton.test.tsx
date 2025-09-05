import { render, screen, fireEvent } from '@testing-library/react';
import { GradientButton } from '@/components/ui/common/GradientButton';

describe('GradientButton', () => {
  it('should render with default props', () => {
    render(<GradientButton>Click me</GradientButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<GradientButton onClick={handleClick}>Click me</GradientButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<GradientButton disabled>Click me</GradientButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<GradientButton variant='brand'>Brand</GradientButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r from-brand-500 to-accent-600');

    rerender(<GradientButton variant='success'>Success</GradientButton>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r from-green-500 to-emerald-600'
    );

    rerender(<GradientButton variant='warning'>Warning</GradientButton>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-gradient-to-r from-yellow-500 to-orange-500'
    );
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<GradientButton size='sm'>Small</GradientButton>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5 text-xs');

    rerender(<GradientButton size='lg'>Large</GradientButton>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-base');

    rerender(<GradientButton size='xl'>Extra Large</GradientButton>);
    expect(screen.getByRole('button')).toHaveClass('px-8 py-4 text-lg');
  });

  it('should render with icon on the left', () => {
    render(
      <GradientButton icon={<span data-testid='icon'>🚀</span>} iconPosition='left'>
        Launch
      </GradientButton>
    );

    const button = screen.getByRole('button');
    const icon = screen.getByTestId('icon');

    expect(button).toContainElement(icon);
    expect(button.firstChild?.firstChild).toBe(icon);
  });

  it('should render with icon on the right', () => {
    render(
      <GradientButton icon={<span data-testid='icon'>→</span>} iconPosition='right'>
        Next
      </GradientButton>
    );

    const button = screen.getByRole('button');
    const icon = screen.getByTestId('icon');

    expect(button).toContainElement(icon);
    expect(button.firstChild?.lastChild).toBe(icon);
  });

  it('should be full width when fullWidth prop is true', () => {
    render(<GradientButton fullWidth>Full Width</GradientButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('should have correct button type', () => {
    render(<GradientButton type='submit'>Submit</GradientButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should apply custom className', () => {
    render(<GradientButton className='custom-class'>Custom</GradientButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
