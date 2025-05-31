'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useMotionValue, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const count = useMotionValue(from);
  const [displayValue, setDisplayValue] = useState(from.toFixed(decimals));
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration: duration,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(latest.toFixed(decimals));
        },
      });
      return controls.stop;
    }
  }, [from, to, duration, count, inView, decimals]);

  return (
    <motion.span ref={ref} className="text-4xl font-bold text-emerald-400">
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;