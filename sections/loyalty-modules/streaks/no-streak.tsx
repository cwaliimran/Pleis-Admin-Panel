import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

type NoStreakProps = {
  handleCreateNew: () => void;
};

const NoStreak = ({ handleCreateNew }: NoStreakProps) => {
  return (
    <>
      <div className="dark:bg-secondary/40 col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-16 dark:border-gray-600">
        <svg width="72" height="72" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-200">No Streak Rules Yet</span>
        <span className="mb-6 px-2 text-center text-sm text-gray-500 sm:text-[15px] dark:text-gray-400">
          You havent created any streak rules. Start by adding your first one!
        </span>
        <Button className="bg-primary hover:bg-primary/90 rounded-3xl px-6 py-2 text-white shadow" onClick={handleCreateNew} type="button">
          <Plus className="mr-2 h-5 w-5" /> Create Streak Rule
        </Button>
      </div>
    </>
  );
};

export default NoStreak;
