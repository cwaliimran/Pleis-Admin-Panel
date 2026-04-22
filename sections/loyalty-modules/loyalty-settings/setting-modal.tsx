'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import FieldSkeleton from '@/components/ui/field-skeleton';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useUpdateUserMutation } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type SettingsFormValues = {
  logo: any;
  coverImage: any;
  title: string;
  description: string;
  category: string;
  model: 'essential' | 'preferred' | 'premier';
  pointValuePercentage: number;
  status: 'active' | 'suspended';
};

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  selectedCompanyId: string;
  companyDetails: any;
  handleSuccess: () => void;
  user: any;
  status: 'active' | 'suspended';
};

const schema = Yup.object().shape({
  logo: Yup.mixed().nullable().default(null),
  coverImage: Yup.mixed().nullable().default(null),
  title: Yup.string().required('Club title is required').min(3, 'Must be at least 3 characters').default(''),
  description: Yup.string().required('Description is required').min(10, 'Must be at least 10 characters').default(''),
  category: Yup.string().required('Category is required').default(''),
  model: Yup.string()
    .oneOf(['essential', 'preferred', 'premier'] as const)
    .required('Loyalty model is required')
    .default('essential'),
  pointValuePercentage: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Point value percentage is required')
    .min(0, 'Must be at least 0%')
    .max(20, 'Cannot exceed 20%')
    .default(0),
  status: Yup.mixed<'active' | 'suspended'>()
    .oneOf(['active', 'suspended'])
    .default('active'),
});

const defaultValues: SettingsFormValues = {
  logo: null,
  coverImage: null,
  title: '',
  description: '',
  category: '',
  model: 'essential',
  pointValuePercentage: 0,
  status: 'active'
};

const SettingsModal = ({ open, onClose, selectedCompanyId, companyDetails, handleSuccess, user, status }: SettingsModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const [pointValue, setPointValue] = useState(0);

  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  const methods = useForm<SettingsFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty, isValid },
  } = methods;

  const selectedModel = watch('model');

  const loyaltyModels = [
    {
      value: 'essential',
      title: 'Essential',
      desc: 'Ideal for smaller venues like bars or casual spots. Lower entry requirements and more frequent rewards.',
    },
    {
      value: 'preferred',
      title: 'Preferred',
      desc: 'Suitable for mid-range venues like restaurants or small clubs. Balanced tier requirements and reward frequency.',
    },
    {
      value: 'premier',
      title: 'Premier',
      desc: 'Designed for premium venues such as high-end clubs or restaurants. Higher thresholds and slower progression.',
    },
  ];

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({
    page: 0,
    limit: 10000,
  });

  const categoryOptions = useMemo(
    () =>
      (categoriesData?.data || []).map((v: any) => ({
        value: String(v?._id ?? ''),
        label: v?.title ?? 'No Title',
      })),
    [categoriesData]
  );

  // Helper function to check if image is valid
  const isValidImage = (img: string | null | undefined): string | null => {
    if (!img) return null;
    if (img === noImageUrl || img === noImageUrlDev) return null;
    if (img.toLowerCase().includes('noimage.png')) return null;
    return img;
  };

  // Populate form when modal opens with companyDetails data
  useEffect(() => {
    if (open && companyDetails) {
      const loyaltySettings = companyDetails?.loyaltySettings;

      const mappedValues: SettingsFormValues = {
        logo: isValidImage(companyDetails?.logo),
        coverImage: isValidImage(companyDetails?.coverImage),
        title: loyaltySettings?.title || '',
        description: companyDetails?.description || '',
        category: companyDetails?.category?._id || '',
        model: loyaltySettings?.model || 'essential',
        pointValuePercentage: loyaltySettings?.pointValuePercentage ?? 0,
        status: status ?? 'active',
      };

      setPointValue(loyaltySettings?.pointValuePercentage ?? 0);
      reset(mappedValues);
    } else if (open && !companyDetails) {
      reset(defaultValues);
      setPointValue(0);
    }
  }, [open, companyDetails, reset]);

  // Sync point value with slider
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'pointValuePercentage') {
        setPointValue(value.pointValuePercentage ?? 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleSubmit = async (formData: SettingsFormValues) => {
    if (!selectedCompanyId) {
      showError('No company selected. Please select a company from the header dropdown.');
      return;
    }

    let uploadedLogoKey: string | null = null;
    let uploadedCoverImageKey: string | null = null;

    try {
      // Upload logo if changed
      if (formData?.logo instanceof FileList && formData?.logo.length > 0) {
        const file = formData.logo[0];
        uploadedLogoKey = await uploadImage(file);
      }

      // Upload cover image if changed
      if (formData?.coverImage instanceof FileList && formData?.coverImage.length > 0) {
        const file = formData.coverImage[0];
        uploadedCoverImageKey = await uploadImage(file);
      }

      const payload: any = {
        status: formData.status,
        companyDetails: {
          ...(uploadedLogoKey && { logo: uploadedLogoKey }),
          ...(uploadedCoverImageKey && { coverImage: uploadedCoverImageKey }),
          description: formData.description,
          category: formData.category,
          loyaltySettings: {
            title: formData.title,
            model: formData.model,
            pointValuePercentage: Number(formData.pointValuePercentage),
          },
        },
      };

      const response = await updateUser({ id: selectedCompanyId, body: payload }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Settings updated successfully');
      methods.reset(defaultValues);
      setPointValue(0);
      onClose();
      handleSuccess();
    } catch (error) {
      // Cleanup uploaded files on error
      if (uploadedLogoKey || uploadedCoverImageKey) {
        setDeleting(true);
        try {
          if (uploadedLogoKey) await deleteFileFromAzure(uploadedLogoKey);
          if (uploadedCoverImageKey) await deleteFileFromAzure(uploadedCoverImageKey);
        } finally {
          setDeleting(false);
        }
      }

      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setPointValue(0);
    onClose();
  };

  const isLoading = updateLoading || imageUploading || deleting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[700px]!"
        >
          <DialogHeader>
            <DialogTitle>Edit Club Settings</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-6">
                {/* Logo Upload */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Club Logo</Label>
                  <RHFUploadAvatar name="logo" label="" initialImage={isValidImage(companyDetails?.logo)} />
                </div>

                {/* Cover Image Upload with Button */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Cover Image</Label>
                  <div className="flex max-w-48 items-center justify-start">
                    <RHFUploadButton name="coverImage" label="Upload Cover Image" initialImage={isValidImage(companyDetails?.coverImage)} />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Recommended size: 1200x400px. Supports JPG, PNG, WebP.</p>
                </div>

                {/* Club Title */}
                <RHFTextField name="title" label="Club Title" placeholder="e.g., Pearl Continental Lahore" />

                {/* Description */}
                <RHFTextField name="description" label="Description" placeholder="Enter club description..." multiline rows={3} />

                {/* Category */}
                {/* <RHFSelectField name="category" label="Category" placeholder="Select category" options={categoryOptions} /> */}

                {categoriesLoading ? (
                  <FieldSkeleton />
                ) : (
                  <RHFCustomDropdown
                    name="category"
                    label="Category"
                    placeholder="Select category"
                    options={categoryOptions}
                    isLoading={categoriesLoading}
                    showNone={false}
                  />
                )}
                <RHFSelectField
                  name="status"
                  label="Select Status"
                  placeholder="Select Status"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'suspended' },
                  ]}
                />

                {/* Loyalty Model Selection */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Loyalty Tier Model</Label>
                  {user?.accountState?.userType === 'admin' && (
                    <RadioGroup
                      value={selectedModel}
                      onValueChange={(value) =>
                        setValue('model', value as 'essential' | 'preferred' | 'premier', { shouldValidate: true, shouldDirty: true })
                      }
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {loyaltyModels.map((modelItem) => (
                        <label key={modelItem.value} htmlFor={`modal-${modelItem.value}`} className="cursor-pointer">
                          <Card
                            className={`dark:bg-secondary cursor-pointer border transition ${selectedModel === modelItem.value ? 'border-primary shadow-lg dark:border-gray-300' : 'border-muted'
                              }`}
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <RadioGroupItem value={modelItem.value} id={`modal-${modelItem.value}`} className="mt-0.5" />
                                <span className="text-lg">{modelItem.title}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground text-xs">{modelItem.desc}</p>
                            </CardContent>
                          </Card>
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                  {/* <p className="text-muted-foreground mt-3 text-xs">To switch your business model, please reach out to the admin team for support.</p> */}
                </div>

                {/* Point Value Percentage */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Point Value Percentage</Label>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl font-semibold">{Number(pointValue).toFixed(1)}%</span>
                  </div>
                  <div>
                    <Slider
                      min={0}
                      max={20}
                      step={0.1}
                      value={[pointValue]}
                      onValueChange={(val) => {
                        const rounded = Math.round(val[0] * 10) / 10;
                        setPointValue(rounded);
                        setValue('pointValuePercentage', rounded, { shouldValidate: true, shouldDirty: true });
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground mt-3 text-xs">
                    Each euro spent returns between <span className="font-medium">{Number(pointValue).toFixed(1)}%</span> -{' '}
                    <span className="font-medium">{Number(pointValue * 2).toFixed(1)}%</span> of its value back in loyalty points.
                  </p>
                </div>

                {/* Info Box */}
                <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                  <p className="font-medium text-blue-900 dark:text-blue-300">💡 Note:</p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                    All settings will be applied to the selected club. Make sure to review before saving.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title="Saving" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white" disabled={!isDirty || !isValid}>
                    Save Settings
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

export default SettingsModal;
