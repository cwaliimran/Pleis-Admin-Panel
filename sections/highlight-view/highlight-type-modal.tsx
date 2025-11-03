import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField, RHFUploadVideo } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import * as React from 'react';

interface HighlightTypeModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

const HighlightTypeModal: React.FC<HighlightTypeModalProps> = ({ open, onClose, editMode, methods, onSubmit, isLoading }) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const { data: apiData, isLoading: isLoadingOrganizations } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const { data: eventData, isLoading: isLoadingEvents } = useGeteventsQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const organizationOptions = (apiData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.name || 'No Name',
  }));

  const eventOptions = (eventData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.title || 'No Title',
  }));

  // Get isDirty from formState
  const { formState } = methods;
  const isDirty = formState?.isDirty;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent aria-describedby={undefined} className="w-full md:!max-w-screen-md dark:bg-[#171717]">
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit Highlight' : 'Create Highlight'}</DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <RHFUploadVideo name="video" label="Highlight Video" />
            </div>

            <div className="col-span-12 flex flex-col gap-0 space-y-4 md:col-span-8">
              <RHFTextField
                name="title"
                label="Highlight Title"
                placeholder="Enter Highlight Title"
                className={`${methods.formState.errors.title ? 'border-red-400' : ''}`}
              />

              {isLoadingEvents ? (
                <div className="mt-2 w-full space-y-2 md:w-[100%]">
                  <Skeleton className="ml-1 h-[12px] w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                  <Skeleton className="h-[32px] flex-1 cursor-not-allowed rounded-lg border-gray-200 px-5" />
                </div>
              ) : (
                <RHFCustomDropdown
                  name="event"
                  label="Event"
                  placeholder="Select Event"
                  options={eventOptions}
                  isLoading={isLoadingEvents}
                  disabled={!!methods.watch('organization')}
                  showNone={true}
                />
              )}

              {isLoadingOrganizations ? (
                <div className="mt-2 w-full space-y-2 md:w-[100%]">
                  <Skeleton className="ml-1 h-[12px] w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                  <Skeleton className="h-[32px] flex-1 cursor-not-allowed rounded-lg border-gray-200 px-5" />
                </div>
              ) : (
                <RHFCustomDropdown
                  name="organization"
                  label="Organization"
                  placeholder="Select Organization"
                  options={organizationOptions}
                  isLoading={isLoadingOrganizations}
                  disabled={!!methods.watch('event')}
                  showNone={true}
                />
              )}

              <RHFSelectField
                name="status"
                label="Status"
                placeholder="Select Status"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="px-4 py-2">
              Cancel
            </Button>

            {isLoading ? (
              <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                <ButtonLoading title={editMode ? 'Updating' : 'Creating'} />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                disabled={editMode ? !isDirty : false}
              >
                {editMode ? 'Update Highlight' : 'Create Highlight'}
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default HighlightTypeModal;

// <Dialog open={open} onOpenChange={handleClose}>
//   <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center">
//     <DialogContent
//       aria-describedby={undefined}
//       className="mx-4 w-full max-w-md dark:bg-[#171717]"
//     >
//       <DialogHeader className="flex flex-row items-center justify-between">
//         <DialogTitle className="text-lg font-semibold">
//           {editMode ? 'Edit Highlight' : 'Create Highlight'}
//         </DialogTitle>
//       </DialogHeader>

//       <FormProvider methods={methods} onSubmit={onSubmit}>
//         <div className="mt-4 flex flex-col gap-4">

//           <div className="flex justify-end gap-2 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleClose}
//               disabled={isLoading}
//               className="px-4 py-2"
//             >
//               Cancel
//             </Button>

//             {isLoading ? (
//               <Button
//                 type="button"
//                 disabled
//                 className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
//               >
//                 <ButtonLoading title={editMode ? 'Updating' : 'Creating'} />
//               </Button>
//             ) : (
//               <Button
//                 type="submit"
//                 className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
//                 disabled={editMode ? !isDirty : false}
//               >
//                 {editMode ? 'Update Category' : 'Create Category'}
//               </Button>
//             )}
//           </div>
//         </div>
//       </FormProvider>
//     </DialogContent>
//   </DialogOverlay>
// </Dialog>
