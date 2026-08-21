import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function PageWrapper({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
