import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTagTypeQuery } from '@/store/Reducer/tag-type-api';
import * as React from 'react';

interface TagsTypeModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

const TagsTypeModal: React.FC<TagsTypeModalProps> = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
  // selectedVenueType,
}) => {
  const { data: tagTypeData, isLoading: tagTypeLoading } = useGetTagTypeQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: 'active',
    date: undefined,
  });

  const tagTypeOptions =
    tagTypeData?.data?.map((tier: any) => ({
      label: tier?.title,
      value: tier?._id,
    })) || [];

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
        <DialogContent aria-describedby={undefined} className="mx-4 w-full max-w-md dark:bg-[#171717]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{editMode ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex flex-col gap-4">
              <div className="space-y-3">
                <RHFTextField
                  name="title"
                  label="Tag Name"
                  placeholder="Enter Tag Name"
                  className={`$${methods.formState.errors.title ? 'border-red-400 focus:border-red-400' : ''}`}
                  disabled={isLoading}
                />
              </div>

              <div className="flex w-full flex-1 flex-col">
                {tagTypeLoading ? (
                  <div className="mt-2 w-full space-y-2">
                    <Skeleton className="ml-1 h-3 w-20 rounded-4xl border-gray-200 px-5" />
                    <Skeleton className="h-8 rounded-4xl border-gray-200 px-5" />
                  </div>
                ) : (
                  <RHFCustomDropdown
                    name="type"
                    label="Tag Type"
                    placeholder="Enter Tag Type"
                    options={tagTypeOptions}
                    isLoading={tagTypeLoading}
                    showNone={false}
                  />
                )}
              </div>

              {editMode && (
                <RHFSelectField
                  name="status"
                  placeholder="Select Status"
                  label="Status"
                  className="w-full flex-1"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  disabled={isLoading}
                />
              )}

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
                    {editMode ? 'Update Tag' : 'Create Tag'}
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

export default TagsTypeModal;
