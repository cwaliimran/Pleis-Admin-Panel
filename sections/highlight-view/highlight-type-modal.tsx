import ButtonLoading from '@/components/common/button-loading';
import FormProvider, {
  RHFSelectField,
  RHFTextField,
  RHFUploadVideo,
} from '@/components/rhf';
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
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

const HighlightTypeModal: React.FC<HighlightTypeModalProps> = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const { data: apiData } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const organizationOptions = (apiData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.name,
  }));

  // Get isDirty from formState
  const { formState } = methods;
  const isDirty = formState?.isDirty;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="w-full md:!max-w-screen-md dark:bg-[#171717]"
      >
        <DialogHeader>
          <DialogTitle>
            {editMode ? 'Edit Highlight' : 'Create Highlight'}
          </DialogTitle>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <RHFUploadVideo name="video" label="Highlight Video" />
            </div>

            <div className="col-span-12 flex flex-col gap-0 space-y-3 md:col-span-8">
              <RHFTextField
                name="title"
                label="Highlight Title"
                placeholder="Enter Highlight Title"
                className={`${
                  methods.formState.errors.title ? 'border-red-400' : ''
                }`}
              />

              <RHFTextfieldWithSelect
                name="event"
                placeholder="Select Event"
                label="Events"
                options={[
                  { value: 'event1', label: 'Event 1' },
                  { value: 'event2', label: 'Event 2' },
                  { value: 'event3', label: 'Event 3' },
                ]}
              />

              <RHFTextfieldWithSelect
                name="organization"
                label="Organization"
                placeholder="Select Organization"
                options={organizationOptions}
              />

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
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2"
            >
              Cancel
            </Button>

            {isLoading ? (
              <Button
                type="button"
                disabled
                className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
              >
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
