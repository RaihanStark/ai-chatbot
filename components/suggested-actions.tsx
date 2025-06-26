'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({
  chatId,
  append,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Create a bar chart showing',
      label: 'employee count by department',
      action: 'Create a bar chart showing the number of employees in each department (kitchen, front-of-house, bar, management) from the employee database.',
    },
    {
      title: 'Plot a pie chart of',
      label: 'salary distribution by position',
      action: 'Create a pie chart showing the salary distribution across different employee positions (manager, chef, sous-chef, line-cook, server, bartender, host, busser, dishwasher).',
    },
    {
      title: 'Generate a line chart for',
      label: 'hiring trends over time',
      action: 'Create a line chart showing the hiring trends over time by plotting the number of employees hired each year from the hireDate field.',
    },
    {
      title: 'Make a scatter plot of',
      label: 'salary vs experience',
      action: 'Create a scatter plot showing the relationship between employee salaries and their experience (calculated from hireDate) to see if there\'s a correlation.',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;

    return true;
  },
);
