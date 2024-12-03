import React from 'react';
import { motion } from 'framer-motion';

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
  isShared?: boolean;
  isPopular?: boolean;
  gradient: string;
}

export function MenuItem({ name, price, description, image, isShared, isPopular, gradient }: MenuItemProps) {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
        role="article"
        aria-label={`${name} - ₪${price}`}
        tabIndex={0}
      >
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div 
            className={`absolute top-4 left-4 bg-gradient-to-r ${gradient} px-4 py-1 rounded-full text-white text-lg font-bold z-20`}
            aria-label={`מחיר: ${price} שקלים`}
          >
            ₪{price}
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            {isShared && (
              <span 
                className="bg-white/90 text-purple-900 px-3 py-1 rounded-full text-sm font-bold"
                role="status"
                aria-label="מנה זוגית"
              >
                לזוג
              </span>
            )}
            {isPopular && (
              <span 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse"
                role="status"
                aria-label="מנה פופולרית"
              >
                פופולרי
              </span>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {name}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}