'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { format, startOfMonth, startOfYear, subDays, subWeeks } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface ChatGreetingProps {
  onOptionSelect: (option: string) => void;
}

interface Option {
  id: string;
  label: string;
  icon: string;
  action?: string; // Final action to send to chat
  nextStep?: string; // Next step to navigate to
  disabled?: boolean; // Whether the option is disabled
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  options: Option[];
  parentStep?: string; // For back navigation
  isDatePicker?: boolean; // Indicates this is a date picker step
  actionType?: string; // Custom action type for special flows
}

// Scalable step configuration
const STEPS: Record<string, Step> = {
  initial: {
    id: 'initial',
    title: 'Hello there!',
    subtitle: 'How can I help you today?',
    options: [
      { id: 'labor-analysis', label: 'Labor Analysis', icon: '📊', nextStep: 'labor' },
      { id: 'pnl-analysis', label: 'P&L Analysis', icon: '💰', nextStep: 'pnl', disabled: true },
    ],
  },
  labor: {
    id: 'labor',
    title: "Okay. Let's help you with Labor Analysis.",
    subtitle: 'What would you like to do?',
    parentStep: 'initial',
    options: [
      { id: 'analyze-spend', label: 'Analyze Spend', icon: '💸', nextStep: 'labor-spend-date' },
      { id: 'plan-schedule', label: 'Plan Schedule', icon: '📅', nextStep: 'labor-schedule-date' },
    ],
  },
  'labor-spend-date': {
    id: 'labor-spend-date',
    title: 'Analyze Spend',
    subtitle: 'Which timeframe would you like to analyze?',
    parentStep: 'labor',
    isDatePicker: true,
    options: [], // Will be handled by date picker
  },
  'labor-schedule-date': {
    id: 'labor-schedule-date',
    title: 'Plan Schedule',
    subtitle: 'What date range are you looking to plan schedule for?',
    parentStep: 'labor',
    isDatePicker: true,
    actionType: 'schedule', // Custom action type for schedule planning
    options: [], // Will be handled by date picker
  },
  'labor-schedule-existing': {
    id: 'labor-schedule-existing',
    title: 'Plan Schedule',
    subtitle: 'Do you have an existing schedule to analyze?',
    parentStep: 'labor-schedule-date',
    options: [
      { id: 'improve-new', label: 'Improve New Schedule', icon: '🆕', action: 'Labor Analysis - Plan Schedule - Improve New Schedule' },
      { id: 'improve-old', label: 'Improve Old Schedule', icon: '📋', action: 'Labor Analysis - Plan Schedule - Improve Old Schedule' },
    ],
  },
  pnl: {
    id: 'pnl',
    title: "Let's analyze your P&L.",
    subtitle: 'Choose an analysis type:',
    parentStep: 'initial',
    options: [
      { id: 'revenue-analysis', label: 'Revenue Analysis', icon: '📈', action: 'P&L Analysis - Revenue' },
      { id: 'expense-analysis', label: 'Expense Analysis', icon: '📉', action: 'P&L Analysis - Expenses' },
      { id: 'profit-margin', label: 'Profit Margins', icon: '💹', action: 'P&L Analysis - Profit Margins' },
    ],
  },
};

export function ChatGreeting({ onOptionSelect }: ChatGreetingProps) {
  const [currentStepId, setCurrentStepId] = useState<string>('initial');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['initial']);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const currentStep = STEPS[currentStepId];

  const handleOptionClick = (option: Option) => {
    if (option.action) {
      // Final action - send to chat
      let finalAction = option.action;
      
      // For schedule-related actions, append the stored date range
      if (option.action.includes('Plan Schedule') && sessionStorage.getItem('scheduleDateRange')) {
        finalAction = `${option.action} ${sessionStorage.getItem('scheduleDateRange')}`;
        // Clear the stored date range after use
        sessionStorage.removeItem('scheduleDateRange');
      }
      
      onOptionSelect(finalAction);
    } else if (option.nextStep) {
      // Navigate to next step
      setCurrentStepId(option.nextStep);
      setNavigationHistory([...navigationHistory, option.nextStep]);
    }
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current step
      const previousStep = newHistory[newHistory.length - 1];
      setCurrentStepId(previousStep);
      setNavigationHistory(newHistory);
      // Reset date selection when going back
      setDateRange(undefined);
    }
  };

  const handleDateSelect = () => {
    if (dateRange?.from) {
      let dateRangeText = `from ${format(dateRange.from, 'MMM dd, yyyy')}`;
      if (dateRange.to) {
        dateRangeText += ` to ${format(dateRange.to, 'MMM dd, yyyy')}`;
      } else {
        dateRangeText = `for ${format(dateRange.from, 'MMM dd, yyyy')}`;
      }
      
      // Check if this is a schedule flow
      if (currentStep.actionType === 'schedule') {
        // For schedule planning, navigate to the existing schedule question
        setCurrentStepId('labor-schedule-existing');
        setNavigationHistory([...navigationHistory, 'labor-schedule-existing']);
        // Store the date range for later use
        sessionStorage.setItem('scheduleDateRange', dateRangeText);
      } else {
        // For analyze spend, send directly to chat
        onOptionSelect(`Labor Analysis - Analyze Spend ${dateRangeText}`);
      }
    }
  };

  if (!currentStep) {
    return null;
  }

  // Date picker step
  if (currentStep.isDatePicker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-2xl w-full"
        >
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-semibold mb-2">{currentStep.title}</h1>
          <p className="text-muted-foreground text-lg mb-8">
            {currentStep.subtitle}
          </p>
          
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {/* Date range shortcuts - only show for Analyze Spend */}
            {currentStep.actionType !== 'schedule' && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setDateRange({ from: today, to: today });
                  }}
                >
                  Today
                </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const lastWeek = subDays(today, 6);
                  setDateRange({ from: lastWeek, to: today });
                }}
              >
                Last 7 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const last14Weeks = subWeeks(today, 14);
                  setDateRange({ from: last14Weeks, to: today });
                }}
              >
                Last 14 weeks
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const monthStart = startOfMonth(today);
                  setDateRange({ from: monthStart, to: today });
                }}
              >
                This month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const yearStart = startOfYear(today);
                  setDateRange({ from: yearStart, to: today });
                }}
              >
                This year
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const lastYear = new Date(today.getFullYear() - 1, 0, 1);
                  const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
                  setDateRange({ from: lastYear, to: lastYearEnd });
                }}
              >
                Last year
              </Button>
              </div>
            )}

            {/* Calendar for date range selection */}
            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                disabled={currentStep.actionType === 'schedule' ? undefined : (date) => date > new Date()}
                className="rounded-md border"
              />
            </div>

            {/* Selected date range display */}
            {dateRange && (
              <div className="text-sm text-muted-foreground">
                {dateRange.from && !dateRange.to && "Pick an end date"}
                {dateRange.from && dateRange.to && (
                  <>
                    Selected: {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                  </>
                )}
              </div>
            )}

            {/* Submit button */}
            <Button
              onClick={handleDateSelect}
              disabled={!dateRange?.from}
              size="lg"
              className="mt-4"
            >
              <CalendarIcon className="size-4 mr-2" />
              {currentStep.actionType === 'schedule' ? 'Plan Schedule' : 'Analyze Spend'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Regular option selection step
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <motion.div
        key={currentStepId}
        initial={{ opacity: 0, x: currentStep.parentStep ? 20 : 0, y: currentStep.parentStep ? 0 : 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-2xl"
      >
        {currentStep.parentStep && (
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        )}
        
        <h1 className="text-3xl font-semibold mb-2">{currentStep.title}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          {currentStep.subtitle}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {currentStep.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleOptionClick(option)}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 p-6 text-base hover:scale-105 transition-transform"
                disabled={option.disabled}
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