'use client';

interface ProgressHeaderProps {
  step: number;
  title: string;
}

const ProgressHeader = ({ step, title }: ProgressHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-foreground mb-6 text-2xl font-bold">{title} Event</h1>
      <div className="mb-6 w-full">
        <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          {step === 1 ? 'Step 1: Basic Info' : step === 2 ? 'Step 2: Schedule Date and Time' : ' Step 3: Add Ticketing'}
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
          <div className={`h-2 rounded-full bg-blue-700 transition-all duration-300 ${step === 1 ? 'w-[33%]' : step === 2 ? 'w-[66%]' : 'w-full'}`} />
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
