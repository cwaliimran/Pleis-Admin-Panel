'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddMenuListMutation, useUpdateMenuListMutation } from '@/store/Reducer/menu-list-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { getOrgId } from './menulist-utils';
import { MenuItemFormValues, MenuItemModalProps } from './types';

const defaultValues: MenuItemFormValues = {
  title: '',
  description: '',
  organization: '',
  validFrom: undefined,
  status: 'draft',
};

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const isFutureDate = (value?: Date | string | null) => {
  if (!value) return false;

  const selected = new Date(value);
  if (isNaN(selected.getTime())) return false;

  selected.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() > today.getTime();
};

const schema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
  description: Yup.string().optional(),
  organization: Yup.string().required('Organization is required'),
  validFrom: Yup.date().required('Valid from date is required'),
  status: Yup.mixed<'draft' | 'active' | 'inactive'>()
    .oneOf(['draft', 'active', 'inactive'])
    .required('Status is required')
    .test('status-allowed-for-date', 'A menu starting in the future cannot be set to Active', function (value) {
      return !(value === 'active' && isFutureDate(this.parent?.validFrom));
    }),
});

const MenuItemModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
  organizations,
  organizationsLoading,
  companyId,
  userType,
}: MenuItemModalProps) => {
  const [addMenuList, { isLoading: addLoading }] = useAddMenuListMutation();
  const [updateMenuList, { isLoading: updateLoading }] = useUpdateMenuListMutation();
  const submitting = addLoading || updateLoading;

  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
    defaultValues,
  });

  const { reset, watch, setValue, getValues, formState } = methods;
  const isDirty = formState?.isDirty;

  const validFrom = watch('validFrom');
  const startsInFuture = isFutureDate(validFrom);
  const statusOptions = startsInFuture ? STATUS_OPTIONS.filter((option) => option.value !== 'active') : STATUS_OPTIONS;

  const prepareFormData = (data: any): MenuItemFormValues => {
    // API returns the date as `startDate`; the form field is named `validFrom`
    const rawDate = data?.startDate ?? data?.validFrom;
    const parsedDate = rawDate ? new Date(rawDate) : undefined;

    return {
      title: data?.title || '',
      description: data?.description || '',
      organization: getOrgId(data?.organization),
      validFrom: parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined,
      status: data?.status || 'active',
    };
  };

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset(prepareFormData(selectedData));
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  useEffect(() => {
    if (open && startsInFuture && getValues('status') === 'active') {
      setValue('status', 'draft', { shouldDirty: true, shouldValidate: true });
    }
  }, [open, startsInFuture, getValues, setValue]);

  const organizationOptions = organizations?.map((org) => ({ value: org._id, label: org.name })) || [];

  const handleSubmit = async (formData: MenuItemFormValues) => {
    const payload: any = {
      title: formData.title,
      description: formData.description,
      organization: formData.organization,
      status: formData.status,
      startDate: formatDate(formData.validFrom),
    };
    if (userType === 'super-admin' && companyId) payload.companyOrganizer = companyId;

    try {
      if (isEdit && selectedData?._id) {
        await updateMenuList({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Menu updated successfully');
      } else {
        await addMenuList(payload).unwrap();
        showSuccess('Menu created successfully');
      }
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFTextField name="title" label="Name" placeholder="e.g. Summer Menu 2026" />

                <RHFTextField name="description" label="Description" placeholder="Brief description of this menu" multiline rows={2} />

                <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                  <RHFDate name="validFrom" label="Valid From" placeholder="Select date" displayFormat="dd/MM/yyyy" />

                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    className="w-full flex-1"
                    options={statusOptions}
                  />
                </div>

                {validFrom && startsInFuture && (
                  <div className="-mt-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200">
                    <p className="text-xs leading-relaxed">
                      💡 A menu starting in the future can&apos;t be set Active yet. Save it as <span className="font-semibold">Draft</span> and it
                      will activate automatically on <span className="font-semibold">{format(validFrom, 'dd/MM/yyyy')}</span>.
                    </p>
                  </div>
                )}

                <RHFCustomDropdown
                  name="organization"
                  label="Organization"
                  placeholder="Select Organization"
                  options={organizationOptions}
                  isLoading={organizationsLoading}
                  showNone={false}
                />

              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {submitting ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Menu' : 'Create Menu'}
                    </Button>
                  )}
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default MenuItemModal;
