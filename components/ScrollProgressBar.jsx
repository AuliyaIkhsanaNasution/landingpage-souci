"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  // Get scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();

  // Add spring physics for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 transform-origin-left z-100"
      style={{ scaleX }}
    />
  );
}
