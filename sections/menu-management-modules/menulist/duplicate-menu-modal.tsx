'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useDuplicateMenuMutation } from '@/store/Reducer/menu-list-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { DuplicateMenuModalProps } from './types';

const defaultValues = {
  name: '',
  organization: '',
};

const schema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  organization: Yup.string().required('Organization is required'),
});

const DuplicateMenuModal = ({ open, onClose, selectedId, organizations, organizationsLoading, companyId, userType }: DuplicateMenuModalProps) => {
  const [duplicateMenu, { isLoading: submitting }] = useDuplicateMenuMutation();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset } = methods;

  const organizationOptions = organizations?.map((org) => ({ value: org._id, label: org.name })) || [];

  const handleSubmit = async (formData: typeof defaultValues) => {
    if (!selectedId) return;

    const payload: any = { id: selectedId, name: formData.name.trim(), organization: formData.organization };
    if (userType === 'super-admin' && companyId) payload.companyOrganizer = companyId;

    try {
      await duplicateMenu(payload).unwrap();
      showSuccess('Menu duplicated successfully');
      reset(defaultValues);
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]"
        >
          <DialogHeader className="w-full text-start">
            <DialogTitle>Duplicate Menu</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    <RHFTextField name="name" label="Name" placeholder="e.g. Summer Menu 2026 (Copy)" />
                  </div>

                  <div className="col-span-2">
                    <RHFCustomDropdown
                      name="organization"
                      label="Organization"
                      placeholder="Select Organization"
                      options={organizationOptions}
                      isLoading={organizationsLoading}
                      showNone={false}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {submitting ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                    <ButtonLoading title="Duplicating" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white">
                    Duplicate Menu
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

export default DuplicateMenuModal;
