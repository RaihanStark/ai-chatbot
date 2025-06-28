'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ChatGreetingProps {
  onOptionSelect: (option: string) => void;
}

export function ChatGreeting({ onOptionSelect }: ChatGreetingProps) {
  const options = [
    { id: 'labor-analysis', label: 'Labor Analysis', icon: '📊' },
    { id: 'pnl-analysis', label: 'P&L Analysis', icon: '💰' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-3xl font-semibold mb-2">Hello there!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          How can I help you today?
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {options.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                onClick={() => onOptionSelect(option.label)}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 p-6 text-base hover:scale-105 transition-transform"
              >
                <span className="text-2xl">{option.icon}</span>
                <span>{option.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}