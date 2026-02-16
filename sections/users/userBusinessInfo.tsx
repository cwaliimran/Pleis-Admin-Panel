import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BusinessInfoProps {
  organizationData?: any;
}

const UserBusinessInfo = ({ organizationData }: BusinessInfoProps) => {
  const location = organizationData?.location;

  const formatSuppliers = () => {
    if (organizationData?.suppliers?.length) {
      return organizationData.suppliers;
    }
    return null;
  };

  return (
    <Card className="mt-4 gap-1 dark:bg-[#171717]">
      <CardHeader>
        <h1 className="text-xl font-bold">Business Info</h1>
      </CardHeader>

      <CardContent className="flex flex-col space-y-1 text-sm">
        {/* Company Name */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">Company Name:</p>
          <p className="text-gray-800 dark:text-white">{organizationData?.name || 'N/A'}</p>
        </div>

        {/* Representative Name */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">Representative Full Name:</p>
          <p className="text-gray-800 dark:text-white">{organizationData?.representativeName || 'N/A'}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">Postal Code:</p>
          <p className="text-gray-800 dark:text-white">{location?.postalCode || 'N/A'}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">City:</p>
          <p className="text-gray-800 dark:text-white">{location?.city || 'N/A'}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">State:</p>
          <p className="text-gray-800 dark:text-white">{location?.state || 'N/A'}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">Country:</p>
          <p className="text-gray-800 dark:text-white">{location?.country || 'N/A'}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <p className="font-bold text-slate-500">Full Address:</p>
          {/* <p className="text-gray-800 dark:text-white">{getFullAddress()}</p> */}
          <p className="text-gray-800 dark:text-white">{location?.fullAddress || 'N/A'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <p className="font-bold text-slate-500">Suppliers:</p>
          <div className="flex flex-wrap gap-2">
            {formatSuppliers() ? (
              formatSuppliers().map((supplier: any, index: number) => (
                <span
                  key={supplier?._id || index}
                  className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  {supplier?.title || supplier?.name || supplier}
                </span>
              ))
            ) : (
              <span className="text-gray-800 dark:text-white">N/A</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBusinessInfo;
