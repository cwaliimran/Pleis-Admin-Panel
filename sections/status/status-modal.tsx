'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddStatusMutation, useUpdateStatusMutation } from '@/store/Reducer/status-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type ConditionType = 'count' | 'amount' | 'rank' | 'streakDays';
type CategoryType = 'referral' | 'spending' | 'singlePurchase' | 'topSpender' | 'repeatVisit' | 'venueExplorer' | 'streak';
type StatusType = 'active' | 'inactive';

type StatusFormValues = {
  icon: any;
  title: string;
  description: string;
  category: CategoryType;
  points: number;
  conditionValue: number;
  status: StatusType;
};

type StatusModalProps = {
  open: boolean;
  onClose: () => void;
  editData?: {
    _id: string;
    title: string;
    description: string;
    icon: string;
    category: CategoryType;
    points: number;
    condition: {
      type: ConditionType;
      value: number;
    };
    status?: StatusType;
  } | null;
};

const CATEGORIES = [
  { label: 'Referral', value: 'referral', conditionType: 'count' },
  { label: 'Spending', value: 'spending', conditionType: 'amount' },
  { label: 'Single Purchase', value: 'singlePurchase', conditionType: 'amount' },
  { label: 'Top Spender', value: 'topSpender', conditionType: 'rank' },
  { label: 'Repeat Visit', value: 'repeatVisit', conditionType: 'count' },
  { label: 'Venue Explorer', value: 'venueExplorer', conditionType: 'count' },
  { label: 'Streak', value: 'streak', conditionType: 'streakDays' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// Helper function to get condition type based on category
const getConditionType = (category: CategoryType): ConditionType => {
  const categoryConfig = CATEGORIES.find((cat) => cat.value === category);
  return (categoryConfig?.conditionType as ConditionType) || 'count';
};

const schema = Yup.object().shape({
  icon: Yup.mixed().nullable().required('Badge icon is required').default(null),
  title: Yup.string().required('Title is required').min(3, 'Must be at least 3 characters').default(''),
  description: Yup.string().required('Description is required').min(10, 'Must be at least 10 characters').default(''),
  category: Yup.string()
    .oneOf(['referral', 'spending', 'singlePurchase', 'topSpender', 'repeatVisit', 'venueExplorer', 'streak'], 'Invalid category')
    .required('Category is required')
    .default('referral'),
  points: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Points are required')
    .min(1, 'Points must be at least 1')
    .default(0),
  conditionValue: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Condition value is required')
    .min(1, 'Value must be at least 1')
    .default(0),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required').default('active'),
});

const defaultValues: StatusFormValues = {
  icon: null,
  title: '',
  description: '',
  category: 'referral',
  points: '' as any,
  conditionValue: '' as any,
  status: 'active',
};

const StatusModal = ({ open, onClose, editData }: StatusModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const isInitializingEdit = useRef(false);

  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [addStatus, { isLoading: addLoading }] = useAddStatusMutation();
  const [updateStatus, { isLoading: updateLoading }] = useUpdateStatusMutation();

  const isEditMode = !!editData;
  const isLoading = addLoading || updateLoading || imageUploading || deleting;

  const methods = useForm<StatusFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const selectedCategory = watch('category');

  // Populate form with edit data
  useEffect(() => {
    if (editData) {
      isInitializingEdit.current = true;

      reset({
        icon: editData.icon || null,
        title: editData.title,
        description: editData.description,
        category: editData.category,
        points: editData.points,
        conditionValue: editData.condition.value,
        status: editData.status || 'active',
      });

      setTimeout(() => {
        isInitializingEdit.current = false;
      }, 100);
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const handleSubmit = async (formData: StatusFormValues) => {
    let uploadedIconKey: string | null = null;

    try {
      // Upload icon if it's a file
      if (formData?.icon instanceof FileList && formData?.icon.length > 0) {
        const file = formData.icon[0];
        uploadedIconKey = await uploadImage(file);
      }

      const conditionType = getConditionType(formData.category);

      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        points: Number(formData.points),
        condition: {
          type: conditionType,
          value: Number(formData.conditionValue),
        },
      };

      // Only include icon if it was newly uploaded
      if (uploadedIconKey) {
        payload.icon = uploadedIconKey;
      }

      // Add status only in edit mode
      if (isEditMode) {
        payload.status = formData.status;
      }

      console.log('Status Badge Payload:', payload);

      let response;

      if (isEditMode && editData?._id) {
        payload.id = editData._id;
        response = await updateStatus(payload).unwrap();
      } else {
        response = await addStatus(payload).unwrap();
      }

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || `Status badge ${isEditMode ? 'updated' : 'created'} successfully`);

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      // Clean up uploaded file if there's an error
      if (uploadedIconKey) {
        setDeleting(true);
        try {
          await deleteFileFromAzure(uploadedIconKey);
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
    isInitializingEdit.current = false;
    onClose();
  };

  // Get condition label based on selected category
  const getConditionLabel = () => {
    const conditionType = getConditionType(selectedCategory);
    switch (conditionType) {
      case 'count':
        return 'Count';
      case 'amount':
        return 'Amount';
      case 'rank':
        return 'Rank';
      case 'streakDays':
        return 'Streak Days';
      default:
        return 'Value';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Status Badge' : 'Create Status Badge'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-7 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="icon" label="Badge Icon" />

                <RHFTextField name="title" label="Badge Title" placeholder="e.g., Refer 5 Friends" />

                <RHFTextField name="description" label="Description" placeholder="e.g., Earn points by referring 5 friends" multiline rows={3} />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFCustomDropdown name="category" label="Category" placeholder="Select Category" options={CATEGORIES as any} showNone={false} />

                  <RHFTextField name="points" label="Points" placeholder="e.g., 500" type="number" min="1" />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="conditionValue"
                    label={`Condition ${getConditionLabel()}`}
                    placeholder={`Enter ${getConditionLabel().toLowerCase()}`}
                    type="number"
                    min="1"
                  />

                  {isEditMode && (
                    <RHFSelectField name="status" label="Status" placeholder="Select status" options={STATUS_OPTIONS} />
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6" disabled={isLoading}>
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEditMode ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
                    disabled={isEditMode ? !isDirty : false}
                  >
                    {isEditMode ? 'Update Badge' : 'Create Badge'}
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

export default StatusModal;
