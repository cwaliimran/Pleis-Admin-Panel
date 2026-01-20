export const NoFeedback = () => {
  return (
    <div className="flex min-h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-secondary">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2l-4 4z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Feedback</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There is no feedback available at the moment.</p>
      </div>
    </div>
  );
};
