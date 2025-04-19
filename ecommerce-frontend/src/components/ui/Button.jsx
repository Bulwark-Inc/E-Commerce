import { cn } from '../../utils/classnames';

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  ghost: 'text-blue-600 hover:underline focus:ring-0',
};

const BASE_STYLE = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1';

const DISABLED_STYLE = 'opacity-60 cursor-not-allowed pointer-events-none';

const Button = ({
  children,
  type = 'button',
  isLoading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) => {
  const classes = cn(
    BASE_STYLE,
    VARIANTS[variant],
    (isLoading || disabled) && DISABLED_STYLE,
    className
  );

  return (
    <button type={type} disabled={isLoading || disabled} className={classes} {...props}>
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
