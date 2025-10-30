'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAddCustomCategoryMutation,
  useUpdateCustomCategoryMutation,
} from '@/store/Reducer/custom-categories-api';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useGetUserListQuery } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const defaultValues = {
  title: '',
  linkType: '',
  selectedObject: '',
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  linkType: Yup.string().required('Link type is required'),
  selectedObject: Yup.string().required('Please select an option'),
  status: Yup.string().required('Status is required'),
});

const BannerModalV2 = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: any) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset, formState, setValue } = methods;
  const isDirty = formState?.isDirty;
  const linkType = watch('linkType');

  // Fetch Events
  const { data: eventData, isLoading: isLoadingEvents } = useGeteventsQuery({
    page: 0,
    search: '',
    limit: 10000,
    status: '',
  });

  const eventOptions = (eventData?.data || []).map((v: any) => ({
    value: v?._id.toString(),
    label: v?.basicInfo?.title || 'No Title',
  }));

  // Fetch Organizers
  const { data: organizerData, isLoading: isLoadingOrganizers } =
    useGetUserListQuery({
      page: 0,
      search: '',
      limit: 10000,
      userType: 'organizer',
    });

  const organizerOptions =
    organizerData?.data?.map((u: any) => ({
      label: u?.basicInfo?.companyDetails?.name || 'Unknown Company',
      value: u?.basicInfo?._id,
    })) || [];

  const loyaltyDataOptions =
    organizerData?.data?.map((u: any) => ({
      label: u?.basicInfo?.firstName || 'Unknown User',
      value: u?.basicInfo?._id,
    })) || [];

  const [addCategory, { isLoading: addCategoryLoading }] =
    useAddCustomCategoryMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCustomCategoryMutation();

  // Handle link type change
  const handleLinkTypeChange = (value: string) => {
    setValue('linkType', value, { shouldDirty: true, shouldValidate: true });
    setValue('selectedObject', '', { shouldDirty: true });
  };

  // Prepare form data for editing
  const prepareFormData = (data: any) => {
    const formData: any = {
      title: data?.title || '',
      linkType: data?.type || '',
      status: data?.status || 'active',
    };

    let objectId = '';

    if (data?.type === 'Event' || data?.type === 'LoyaltyProgram') {
      objectId = data?.basicInfo?.object?._id?.toString() || '';
    } else if (data?.type === 'Organizations') {
      objectId =
        data?.object?._id?.toString() ||
        (data?.objectModel === 'User' && data?._id)
          ? data._id
          : '';
    }

    formData.selectedObject = objectId;

    return formData;
  };

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const formData = prepareFormData(selectedData);
      reset(formData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  // Reset selectedObject when linkType changes
  useEffect(() => {
    if (linkType) {
      setValue('selectedObject', '', { shouldDirty: true });
    }
  }, [linkType, setValue]);

  const handleSubmit = async (formData: any) => {
    try {
      const payload: any = {
        title: formData.title,
        type: formData.linkType,
        objects: [formData.selectedObject],
      };

      // Add status and id for edit mode
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      const response =
        isEdit && selectedData
          ? await updateCategory(payload).unwrap()
          : await addCategory(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(
        response?.message ||
          (isEdit
            ? 'Category updated successfully'
            : 'Category created successfully')
      );

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

  // Get options based on link type
  const getDynamicOptions = () => {
    switch (linkType) {
      case 'Organizations':
        return organizerOptions;
      case 'Event':
        return eventOptions;
      case 'User':
        return loyaltyDataOptions;
      default:
        return [];
    }
  };

  const getDynamicLabel = () => {
    switch (linkType) {
      case 'Organizations':
        return 'Select Organizer';
      case 'Event':
        return 'Select Event';
      case 'User':
        return 'Select Loyalty Program Event';
      default:
        return 'Select Option';
    }
  };

  const isLoadingOptions = () => {
    switch (linkType) {
      case 'Organizations':
        return isLoadingOrganizers;
      case 'Event':
        return isLoadingEvents;
      case 'User':
        return isLoadingEvents;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]"
        >
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                  {/* Banner Name */}
                  <div className="col-span-2">
                    <RHFTextField
                      name="title"
                      label="Category Name"
                      placeholder="Enter Category Name"
                    />
                  </div>

                  {/* Link Type */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="linkType">
                      Link Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={linkType}
                      onValueChange={handleLinkTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select link type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Organizations">Organizations</SelectItem>
                        <SelectItem value="User">Loyalty Club</SelectItem>
                      </SelectContent>
                    </Select>
                    {formState.errors.linkType && (
                      <p className="text-sm text-red-500">
                        {formState.errors.linkType.message as string}
                      </p>
                    )}
                  </div>

                  {/* Dynamic Dropdown */}
                  {linkType && (
                    <div className="col-span-2">
                      <RHFCustomDropdown
                        name="selectedObject"
                        label={getDynamicLabel()}
                        placeholder={`Select ${getDynamicLabel()}`}
                        options={getDynamicOptions()}
                        isLoading={isLoadingOptions()}
                        showNone={false}
                      />
                    </div>
                  )}

                  {/* Status Field (Only for Edit) */}
                  {isEdit && (
                    <div className="col-span-2">
                      <RHFSelectField
                        name="status"
                        label="Select Status"
                        placeholder="Select Status"
                        className="w-full flex-1"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  {addCategoryLoading || updateCategoryLoading ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary cursor-not-allowed px-6 py-2 text-white"
                    >
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-6 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Category' : 'Create Category'}
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

export default BannerModalV2;
