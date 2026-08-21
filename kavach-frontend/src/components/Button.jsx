import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-safetyLime text-brandDark hover:bg-[#b3ff33] font-semibold',
    dark: 'bg-brandDark text-white hover:bg-slate-800 font-semibold',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 font-medium',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-full transition-colors duration-150 inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
