'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useDuplicateMenuMutation } from '@/store/Reducer/menu-list-api';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const defaultValues = {
  organization: '',
};

const schema = Yup.object({
  organization: Yup.string().required('Organization is required'),
});

const DuplicateMenuModal = ({ open, selectedId, onClose, selectedData }: any) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const [duplicateMenu, { isLoading: duplicateMenuLoading }] = useDuplicateMenuMutation();
  const { data: { data: organizations = [] } = {}, isLoading: organizationsLoading } = useGetOrganizationQuery({ page: 0, limit: 10000 });

  const { reset } = methods;

  const handleSubmit = async (formData: any) => {
    try {
      const payload: any = {
        id: selectedId,
        organization: formData?.organization,
      };

      const response = await duplicateMenu(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Menu duplicated successfully');

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
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
                    <RHFCustomDropdown
                      name="organization"
                      label="Organization"
                      placeholder="Select Organization"
                      options={organizations?.map((val: any) => ({
                        value: val?._id,
                        label: val?.basicInfo?.name,
                      }))}
                      isLoading={organizationsLoading}
                      showNone={false}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {duplicateMenuLoading ? (
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
