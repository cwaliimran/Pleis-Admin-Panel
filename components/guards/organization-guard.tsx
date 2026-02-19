interface OrganizationGuardProps {
  isOrgRequired: boolean;
  children: React.ReactNode;
  message?: string;
}

export const OrganizationGuard = ({
  isOrgRequired,
  children,
  message = 'Please select an organization from the dropdown above to continue',
}: OrganizationGuardProps) => {
  if (isOrgRequired) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-6xl opacity-30">🏢</div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Select an Organization</h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">{message}</p>
      </div>
    );
  }

  return <>{children}</>;
};