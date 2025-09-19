// "use client"
// import SidebarToggleButton from "@/app/common/siebarToggleButton";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import React, { FC } from "react";

// interface DashboardLayoutProps {
//     left?: React.ReactNode;
//     right?: React.ReactNode;
//     children: React.ReactNode;
// }

// const DashboardLayout: FC<DashboardLayoutProps> = ({ left, right, children }) => {
//     return (
//         <div className="flex min-h-screen ">
//             <SidebarProvider >
//                 <aside className=" border-r">{left}</aside>

//                 <SidebarToggleButton fromOrganizer={true}/>
//                 <main className="flex-1 dark:bg-black md:px-5 px-2  bg-[#f8f6f7]">{children}</main>

//                 <aside className="fixed top-5 right-5 md:top-10 md:right-10">
//                     {right}
//                 </aside>
//             </SidebarProvider>

//         </div>
//     );
// };

// export default DashboardLayout;

'use client';

import SidebarToggleButton from '@/app/common/siebarToggleButton';
import { SidebarProvider } from '@/components/ui/sidebar';
import { OrganizerGuard } from '@/components/guards';
import React, { FC, useEffect, useState } from 'react';
import '../../common/terms-html.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useUpdateUserMutation } from '@/store/Reducer/user-list';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import { setUser } from '@/store/slice/userSlice';
import { useGetTermsAndConditionQuery } from '@/store/Reducer/settings';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({
  left,
  right,
  children,
}) => {
  const dispatch = useDispatch();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { user } = useSelector((state: RootState) => state.userSlice);
  const userTerm = user?.accountState?.termsAccepted;
  const userType = user?.accountState?.userType;

  // Only call API if termsAccepted is false and userType is not 'admin'
  const shouldCallTermsApi = userTerm === false && userType !== 'admin';
  const { data: apiData, isLoading } = useGetTermsAndConditionQuery(
    {},
    { skip: !shouldCallTermsApi }
  );

  useEffect(() => {
    if (userTerm === false && userType !== 'admin') {
      setShowTermsModal(true);
    } else {
      setShowTermsModal(false);
    }
  }, [userTerm, userType]);

  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  const handleTermsSubmit = async () => {
    if (acceptedTerms) {
      try {
        const payload = {
          id: user?.basicInfo?._id,
          body: {
            termsAccepted: true,
          },
        };
        const response = await updateUser(payload).unwrap();
        if (response.error) {
          const errorMessage = getErrorMessage(response.error);
          showError(errorMessage);
          return;
        }
        const updatedUser = response?.data;
        if (!updatedUser) {
          showError('No updated user returned from server');
        }
        const role = updatedUser?.accountState?.userType || user?.role || '';
        const newUser = {
          ...user,
          ...updatedUser,
          role,
          key: process.env.NEXT_PUBLIC_PROJECT_KEY,
        };
        dispatch(setUser(newUser));
        showSuccess(response?.message || 'Terms accepted successfully');
        setShowTermsModal(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        showError(errorMessage);
      }
    }
  };

  return (
    <OrganizerGuard>
      <div className="flex min-h-screen">
        <SidebarProvider>
          {/* Sidebar */}
          <aside className="sticky top-0 z-20 h-screen">{left}</aside>
          <SidebarToggleButton />

          <main className="flex-1 bg-[#f8f6f7] px-2 md:px-5 dark:bg-black">
            {children}
          </main>

          <aside className="fixed top-5 right-5 md:top-10 md:right-10">
            {right}
          </aside>
        </SidebarProvider>

        {/* Terms and Conditions Modal */}
        <Dialog open={showTermsModal} onOpenChange={() => {}}>
          <DialogContent
            aria-describedby={undefined}
            // className="dark:bg-secondary max-h-[80vh] max-w-2xl border-none p-0 [&>button]:hidden"
            className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col overflow-y-auto pb-3 md:!max-w-[700px]"
          >
            <DialogHeader className="p-2 pb-0 sm:p-3 sm:pb-0">
              <DialogTitle className="text-2xl font-bold">
                Terms and Conditions
              </DialogTitle>
            </DialogHeader>

            <div className="p-2 sm:p-3">
              {!apiData?.data?.terms_and_conditions ? (
                <div className="my-3 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />

                  <Skeleton className="mt-6 h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />

                  <Skeleton className="mt-8 h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto pr-4">
                  <div
                    className="terms-html"
                    dangerouslySetInnerHTML={{
                      __html:
                        apiData?.data?.terms_and_conditions ||
                        'Loading terms...',
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-between gap-y-4 border-t p-3 pt-5 sm:flex-row sm:p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accept-terms"
                  checked={acceptedTerms}
                  className={`cursor-pointer border border-black ${acceptedTerms ? 'dark:border-primary' : 'dark:border-white'}`}
                  onCheckedChange={(checked) =>
                    setAcceptedTerms(checked as boolean)
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor="accept-terms"
                  className={`cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed`}
                >
                  I accept the Terms and Conditions
                </label>
              </div>

              <div className="flex">
                <Button
                  onClick={handleTermsSubmit}
                  disabled={!acceptedTerms || updateUserLoading || isLoading}
                  className="w-full md:w-auto"
                >
                  {updateUserLoading
                    ? 'Processing...'
                    : 'Continue to Dashboard'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OrganizerGuard>
  );
};

export default DashboardLayout;
