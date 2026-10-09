import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'border-[#F4B41A] bg-[#F4B41A] text-[#07111F] shadow-lg shadow-[#F4B41A]/15 hover:border-[#FFD166] hover:bg-[#FFD166] hover:shadow-[#F4B41A]/25',
  secondary: 'border-white/15 bg-white/5 text-white hover:border-[#F4B41A]/50 hover:bg-[#F4B41A]/10 hover:text-[#FFD166]',
};

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'secondary',
  className = '',
}) => {
  const classes = [
    'inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-200 active:scale-[0.98]',
    variantClasses[variant] ?? variantClasses.secondary,
    className,
  ]
    .join(' ')
    .trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
};

export default Button;