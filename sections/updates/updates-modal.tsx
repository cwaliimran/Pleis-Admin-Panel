'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type UpdateFormValues = {
  image: any;
  title: string;
  description: string;
  linkedEvent: string;
  status: 'active' | 'inactive';
};

type UpdatesModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  organizationId?: string | null;
};

// VALIDATION SCHEMA
const schema = Yup.object().shape({
  image: Yup.mixed().nullable().required('Image is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  linkedEvent: Yup.string().required('Linked event is required'),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
});

// DEFAULT VALUES
const defaultValues: UpdateFormValues = {
  image: null,
  title: '',
  description: '',
  linkedEvent: '',
  status: 'active',
};

// MODAL COMPONENT
const UpdatesModal = ({ open, onClose, isEdit = false, selectedData, organizationId }: UpdatesModalProps) => {
  const methods = useForm<UpdateFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState } = methods;
  const { isDirty } = formState;

  // POPULATE EDIT DATA
  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mapped: UpdateFormValues = {
        image: selectedData?.image || null,
        title: selectedData?.title || '',
        description: selectedData?.description || '',
        linkedEvent: selectedData?.linkedEvent || '',
        status: selectedData?.status || 'active',
      };
      reset(mapped);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const { data: eventData, isLoading: isLoadingEvents } = useGetEventsByOrganizationQuery(
    {
      organization: organizationId,
    },
    {
      skip: !organizationId,
    }
  );

  const eventOptions = (eventData || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.title || 'No Title',
  }));

  // SUBMIT HANDLER
  const handleSubmit = async (formData: UpdateFormValues) => {
    try {
      console.log('FORM SUBMITTED →', formData);

      reset(defaultValues);
      onClose();
    } catch (error) {
      // showError(getErrorMessage(error));
      console.log('ERROR →', error);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // const isLoading = addLoading || updateLoading;
  const isLoading = false; // remove later when API added

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[30vh] w-full flex-col items-center overflow-y-auto md:max-w-[520px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Update' : 'Create Update'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                {/* IMAGE */}
                <RHFUploadAvatar name="image" label="Upload Image" />

                {/* TITLE */}
                <RHFTextField name="title" label="Title" placeholder="Enter title" />

                {/* DESCRIPTION */}
                <RHFTextField name="description" label="Description" multiline rows={3} placeholder="Enter description" />

                {/* LINKED EVENT */}
                <RHFCustomDropdown
                  name="linkedEvent"
                  label="Select linked event"
                  placeholder="Select linked event"
                  options={eventOptions}
                  isLoading={isLoadingEvents}
                  showNone={true}
                />

                {/* Status - Only in edit mode */}
                {isEdit && (
                  <div className="mt-2">
                    <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark px-6 text-white" disabled={isEdit ? !isDirty : false}>
                    {isEdit ? 'Update' : 'Create'}
                  </Button>
                )}
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default UpdatesModal;
