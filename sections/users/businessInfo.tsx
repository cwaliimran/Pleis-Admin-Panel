import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const BusinessInfo = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <Card className="gap-0 dark:bg-[#171717]">
        <CardHeader>
          <h1 className="mb-2 text-xl font-bold">Business Info</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <div className="grid w-full grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                First Name
              </span>
              <span className="text-slate-500">-</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Last Name
              </span>
              <span className="text-slate-500">-</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </span>
              <span className="text-slate-500">-</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone Number
              </span>
              <span className="text-slate-500">-</span>
            </div>

            {showAll && (
              <>
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Organization Name
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company Name
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    OIB
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Bank Account Number
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Postal Code
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Country
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    City
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Representative Full Name
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subscription Status
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Address
                  </span>
                  <span className="text-slate-500">-</span>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    List of Suppliers
                  </span>
                  <div className="flex flex-wrap gap-2"></div>
                  <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    -
                  </span>
                </div>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="mt-2"
          >
            {showAll ? 'Show Less' : 'View All'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInfo;
