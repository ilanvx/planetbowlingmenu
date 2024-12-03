import React from 'react';
import { motion } from 'framer-motion';

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export function MenuSection({ title, children, icon }: MenuSectionProps) {
  return (
    <section 
      className="mb-16"
      role="region"
      aria-label={title}
    >
      <motion.div 
        className="flex items-center justify-center gap-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-purple-300" aria-hidden="true">
          {icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {title}
        </h2>
        <div className="text-purple-300" aria-hidden="true">
          {icon}
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {children}
      </div>
    </section>
  );
}