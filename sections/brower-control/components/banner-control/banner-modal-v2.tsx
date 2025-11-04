'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddBannerControlMutation, useUpdateBannerControlMutation } from '@/store/Reducer/banner-control-api';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useGetCompanyListQuery, useGetUserListQuery } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const defaultValues = {
  title: '',
  linkType: '',
  selectedObject: '',
  url: '',
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  linkType: Yup.string().required('Link type is required'),
  selectedObject: Yup.string().when('linkType', {
    is: (val: string) => val && val !== 'Other',
    then: (schema) => schema.required('Please select an option'),
    otherwise: (schema) => schema.notRequired(),
  }),
  url: Yup.string().when('linkType', {
    is: 'Other',
    then: (schema) => schema.url('Please enter a valid URL').required('URL is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  status: Yup.string().required('Status is required'),
});

const BannerModalV2 = ({ open, onClose, isEdit = false, selectedData }: any) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const isInitialLoad = useRef(true);

  console.log('selectedData', selectedData);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset, formState, setValue } = methods;
  const isDirty = formState?.isDirty;
  const linkType = watch('linkType');
  const selectedObject = watch('selectedObject');
  const urlValue = watch('url');

  // Debug logs
  useEffect(() => {
    console.log('Current form values:', { linkType, selectedObject, urlValue });
  }, [linkType, selectedObject, urlValue]);

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
  const { data: organizerData, isLoading: isLoadingOrganizers } = useGetUserListQuery({
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

  // Fetch Companies for Loyalty
  const { data: companyList, isLoading: isLoadingCompanies } = useGetCompanyListQuery({});

  const loyaltyDataOptions =
    companyList?.map((data: any) => ({
      label: data?.companyDetails?.name || 'Unknown Company',
      value: data?._id,
    })) || [];

  const [addBanner, { isLoading: addBannerLoading }] = useAddBannerControlMutation();
  const [updateBanner, { isLoading: updateBannerLoading }] = useUpdateBannerControlMutation();

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle link type change
  const handleLinkTypeChange = (value: string) => {
    setValue('linkType', value, { shouldDirty: true, shouldValidate: true });
    setValue('selectedObject', '', { shouldDirty: true });
    setValue('url', '', { shouldDirty: true });
  };

  // Prepare form data for editing
  // const prepareFormData = (data: any) => {
  //   const formData: any = {
  //     title: data?.title || '',
  //     linkType: data?.type || '',
  //     status: data?.status || 'active',
  //   };

  //   // Set the appropriate field based on type
  //   if (data?.type === 'Other') {
  //     formData.url = data?.url || '';
  //   } else {
  //     formData.selectedObject = data?.object || '';
  //   }

  //   return formData;
  // };

  const prepareFormData = (data: any) => {
    const formData: any = {
      title: data?.title || '',
      linkType: data?.type || '',
      status: data?.status || 'active',
    };

    if (data?.type === 'Other') {
      // For "Other" type, the object field contains the URL
      formData.url = data?.object || '';
      formData.selectedObject = '';
    } else {
      // For Event, Organizer, LoyaltyProgram - object contains the ID string
      formData.selectedObject = data?.object || '';
      formData.url = '';
    }

    console.log('Preparing banner form data:', formData);
    console.log('Original banner data:', data);

    return formData;
  };

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const formData = prepareFormData(selectedData);
      reset(formData);
      isInitialLoad.current = true; // Set flag when loading edit data

      // Set image preview if exists
      if (selectedData?.image) {
        setImagePreview(selectedData.image);
      }
    } else if (open && !isEdit) {
      reset(defaultValues);
      setImageFile(null);
      setImagePreview('');
      isInitialLoad.current = true; // Set flag when opening create modal
    }
  }, [open, isEdit, selectedData, reset]);

  // Reset selectedObject when linkType changes (but not during initial load)
  useEffect(() => {
    if (linkType && !isInitialLoad.current) {
      setValue('selectedObject', '', { shouldDirty: true });
      setValue('url', '', { shouldDirty: true });
    }
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [linkType, setValue]);

  // HANDLE SUBMIT
  const handleSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;

    try {
      if (imageFile && imageFile instanceof File) {
        // const file = imageFile[0];
        uploadedFileKey = await uploadImage(imageFile);
      }

      const payload: any = {
        title: formData.title,
        image: uploadedFileKey,
        type: formData.linkType,
      };

      // Add object or url based on type
      if (formData.linkType === 'Other') {
        payload.object = formData.url;
      } else {
        payload.object = formData.selectedObject;
      }

      // Add status and id for edit mode
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData.id;
      }

      const response = isEdit && selectedData ? await updateBanner(payload).unwrap() : await addBanner(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Banner updated successfully' : 'Banner created successfully'));

      methods.reset(defaultValues);
      setImageFile(null);
      setImagePreview('');
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  // Get options based on link type
  const getDynamicOptions = () => {
    switch (linkType) {
      case 'Organizer':
        return organizerOptions;
      case 'Event':
        return eventOptions;
      case 'LoyaltyProgram':
        return loyaltyDataOptions;
      default:
        return [];
    }
  };

  const getDynamicLabel = () => {
    switch (linkType) {
      case 'Organizer':
        return 'Select Organizer';
      case 'Event':
        return 'Select Event';
      case 'LoyaltyProgram':
        return 'Select Loyalty';
      default:
        return 'Select Option';
    }
  };

  const isLoadingOptions = () => {
    switch (linkType) {
      case 'Organizer':
        return isLoadingOrganizers;
      case 'Event':
        return isLoadingEvents;
      case 'LoyaltyProgram':
        return isLoadingCompanies;
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
            <DialogTitle>{isEdit ? 'Edit Banner' : 'Create New Banner'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                  {/* Banner Name */}
                  <div className="col-span-2">
                    <RHFTextField name="title" label="Banner Name" placeholder="Enter Banner Name" />
                  </div>

                  {/* Image Upload */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="image">Banner Image</Label>
                    <div className="flex items-center space-x-4">
                      <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                      {imagePreview && (
                        <div className="h-16 w-16 overflow-hidden rounded-lg border">
                          <Image src={imagePreview} alt="Preview" width={64} height={64} className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Link Type */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="linkType">
                      Link Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={linkType} onValueChange={handleLinkTypeChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select link type" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-secondary">
                        <SelectItem value="LoyaltyProgram">Loyalty Program</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Organizer">Organizer</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formState.errors.linkType && <p className="text-sm text-red-500">{formState.errors.linkType.message as string}</p>}
                  </div>

                  {/* Dynamic Dropdown or URL Field */}
                  {linkType && linkType !== 'Other' && (
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

                  {linkType === 'Other' && (
                    <div className="col-span-2">
                      <RHFTextField name="url" label="Custom URL" placeholder="Enter URL (e.g., https://example.com)" type="url" />
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
                  <Button type="button" variant="outline" onClick={handleClose} className="px-6 py-2">
                    Cancel
                  </Button>
                  {addBannerLoading || updateBannerLoading || imageUploading ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 py-2 text-white">
                      <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-6 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      {isEdit ? 'Update Banner' : 'Create Banner'}
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
