'use client';

interface ProgressHeaderProps {
  step: number;
  title: string;
  totalSteps: number;
  isEditMode?: any;
}

const getStepLabel = (step: number, totalSteps: number) => {
  if (totalSteps === 2) {
    if (step === 1) return 'Step 1: Basic Info';
    if (step === 2) return 'Step 2: Schedule Date and Time';
    return '';
  }
  // Default to 3 steps
  if (step === 1) return 'Step 1: Basic Info';
  if (step === 2) return 'Step 2: Schedule Date and Time';
  if (step === 3) return 'Step 3: Add Ticketing';
  return '';
};

const getProgressWidth = (step: number, totalSteps: number) => {
  if (totalSteps === 2) {
    if (step === 1) return 'w-1/2';
    if (step === 2) return 'w-full';
    return 'w-0';
  }
  // Default to 3 steps
  if (step === 1) return 'w-[33%]';
  if (step === 2) return 'w-[66%]';
  if (step === 3) return 'w-full';
  return 'w-0';
};

const ProgressHeader = ({ step, title, totalSteps }: ProgressHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-foreground mb-6 text-2xl font-bold">{title} Event</h1>
      <div className="mb-6 w-full">
        <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">{getStepLabel(step, totalSteps)}</div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
          <div className={`h-2 rounded-full bg-blue-700 transition-all duration-300 ${getProgressWidth(step, totalSteps)}`} />
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
