import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';

interface VenueTypeModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

const VenueTypeModal: React.FC<VenueTypeModalProps> = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
  selectedVenueType,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Get isDirty from formState
  const { formState } = methods;
  const isDirty = formState?.isDirty;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center">
        <DialogContent
          aria-describedby={undefined}
          className="mx-4 w-full max-w-md dark:bg-[#171717]"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {editMode ? 'Edit Venue Type' : 'Create Venue Type'}
            </DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex flex-col gap-4">
              <div className="space-y-2">
                <RHFUploadAvatar
                  name="image"
                  label="Venue Type Icon"
                  initialImage={(() => {
                    if (!editMode) return null;
                    const img =
                      methods.getValues('image') &&
                      typeof methods.getValues('image') === 'string'
                        ? methods.getValues('image')
                        : selectedVenueType?.imageInfo?.url;
                    if (
                      !img ||
                      img ===
                        'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
                    ) {
                      return null;
                    }
                    return img;
                  })()}
                />
              </div>

              <div className="space-y-2">
                <RHFTextField
                  name="title"
                  label="Venue Type Name"
                  placeholder="Enter Venue Type Name"
                  className={`${
                    methods.formState.errors.title
                      ? 'border-red-400 focus:border-red-400'
                      : ''
                  }`}
                  disabled={isLoading}
                />
                {methods.formState.errors.title && (
                  <p className="text-sm text-red-500">
                    {methods.formState.errors.title.message}
                  </p>
                )}
              </div>

              {editMode && (
                <RHFSelectField
                  name="status"
                  placeholder="Select Status"
                  className="w-full flex-1"
                  label="Status"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  disabled={isLoading}
                />
              )}

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
                    {editMode ? 'Update Venue Type' : 'Create Venue Type'}
                  </Button>
                )}
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default VenueTypeModal;
