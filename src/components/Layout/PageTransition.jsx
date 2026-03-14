import { motion } from 'framer-motion';




const fadeVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={fadeVariants}
      className={`w-full h-full flex flex-col flex-1 ${className}`}
    >
      {children}
    </motion.div>
  );
}
