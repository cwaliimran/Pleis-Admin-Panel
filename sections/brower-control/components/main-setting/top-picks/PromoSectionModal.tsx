'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useAddTopPicksSectionMutation, useUpdateTopPicksSectionMutation } from '@/store/Reducer/promo-section-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const defaultValues = {
  organization: '',
};

const schema = Yup.object().shape({
  organization: Yup.string().required('Organization is required'),
});

const PromoSectionModal = ({ open, onClose, isEdit = false, selectedData }: any) => {
  const [addToTop10, setAddToTop10] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset } = methods;
  // const isDirty = formState?.isDirty;

  // Load organizations
  const { data: eventData, isLoading: isLoadingEvents } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const eventOptions = (eventData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.name || 'No Name',
  }));

  const [addPromo, { isLoading: addPromoLoading }] = useAddTopPicksSectionMutation();
  const [updatePromo, { isLoading: updatePromoLoading }] = useUpdateTopPicksSectionMutation();

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({
        organization: selectedData?.organization?._id || '',
      });
      setAddToTop10(!!selectedData?.isTop10);
    } else if (open && !isEdit) {
      reset(defaultValues);
      setAddToTop10(false);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        organization: formData?.organization,
        isTop10: addToTop10,
      };

      let response;
      if (isEdit && selectedData?._id) {
        response = await updatePromo({
          id: selectedData?._id,
          ...payload,
        }).unwrap();
      } else {
        response = await addPromo(payload).unwrap();
      }

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Top Picks updated successfully' : 'Top Picks created successfully'));

      reset(defaultValues);
      setAddToTop10(false);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setAddToTop10(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
      >
        <DialogHeader>
          <DialogTitle className="text-start">{isEdit ? 'Edit Top Picks' : 'Add New Top Picks'}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 w-full">
          <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className="mt-0 flex w-full flex-col gap-4">
              <RHFCustomDropdown
                name="organization"
                label="Organization"
                placeholder="Select Organization"
                options={eventOptions}
                isLoading={isLoadingEvents}
                showNone={false}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-to-top10"
                  className="border border-blue-500"
                  checked={addToTop10}
                  onCheckedChange={(checked) => setAddToTop10(!!checked)}
                />
                <Label htmlFor="add-to-top10" className="cursor-pointer text-sm font-medium text-gray-700 dark:text-white">
                  Add To Top 10
                </Label>
              </div>
            </div>

            <div className="mt-5 flex w-full items-center justify-between gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>

              {addPromoLoading || updatePromoLoading ? (
                <Button type="button" disabled className="bg-primary hover:bg-primary flex-1 cursor-not-allowed px-4 py-2 text-white">
                  <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark flex-1 cursor-pointer px-4 py-2 text-white"
                  // disabled={isEdit ? !isDirty : false}
                >
                  {isEdit ? 'Update Top Picks' : 'Create Top Picks'}
                </Button>
              )}
            </div>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoSectionModal;
