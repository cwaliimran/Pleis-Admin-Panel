import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const BusinessInfo = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <Card className="dark:bg-[#171717] gap-0">
        <CardHeader>
          <h1 className="mb-2 font-bold text-xl">Business Info</h1>
        </CardHeader>
        <CardContent className="gap-4 flex flex-col items-start">
          <div className="grid grid-cols-1 text-sm md:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                First Name
              </span>
              <span className="text-slate-500">John</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Last Name
              </span>
              <span className="text-slate-500">Doe</span>
            </div>
            <div className="flex flex-col col-span-2 gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </span>
              <span className="text-slate-500">john.doe@example.com</span>
            </div>
            <div className="flex flex-col col-span-2 gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone Number
              </span>
              <span className="text-slate-500">+385 98 123 4567</span>
            </div>

            {showAll && (
              <>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Organization Name
                  </span>
                  <span className="text-slate-500">Example Organization</span>
                </div>
                <div className="flex flex-col col-span-2 gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company Name
                  </span>
                  <span className="text-slate-500">Example Company Ltd.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    OIB
                  </span>
                  <span className="text-slate-500">12345678901</span>
                </div>
                <div className="flex flex-col col-span-2 gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Bank Account Number
                  </span>
                  <span className="text-slate-500">HR1234567890123456789</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Postal Code
                  </span>
                  <span className="text-slate-500">10000</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Country
                  </span>
                  <span className="text-slate-500">Croatia</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    City
                  </span>
                  <span className="text-slate-500">Zadar</span>
                </div>
                <div className="flex flex-col col-span-2 gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Representative Full Name
                  </span>
                  <span className="text-slate-500">John Doe</span>
                </div>
                <div className="flex flex-col col-span-2 gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subscription Status
                  </span>
                  <span className="text-slate-500">Basic</span>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Address
                  </span>
                  <span className="text-slate-500">
                    123 Main Street, Zagreb
                  </span>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    List of Suppliers
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm text-slate-600 dark:text-slate-400">
                      Clubbing
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm text-slate-600 dark:text-slate-400">
                      Techno
                    </span>
                  </div>
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
            {showAll ? "Show Less" : "View All"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInfo;
