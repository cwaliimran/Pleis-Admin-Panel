'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider, {
  RHFDate,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import PromotionTable from './promotionsTable';
import RHFDatePicker from '@/components/rhf/rhf-date';

type PromotionsFormValues = {
  photo: any;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  tierLimit: string;
  repeatSettings: string;
  type: string;
  // Happy Hour specific fields
  timeRangeStart: string;
  timeRangeEnd: string;
  pointMultiplier: string;
  repeatOptions: string;
  // Extra Points for Buying Menu Item fields
  menuItem: string;
  extraPoints: string;
  // Product Sale fields
  saleMenuItem: string;
  discountedPrice: string;
};

const defaultValues = {
  photo: null,
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  tierLimit: '',
  repeatSettings: '',
  type: '',
  // Happy Hour specific fields
  timeRangeStart: '',
  timeRangeEnd: '',
  pointMultiplier: '',
  repeatOptions: '',
  // Extra Points for Buying Menu Item fields
  menuItem: '',
  extraPoints: '',
  // Product Sale fields
  saleMenuItem: '',
  discountedPrice: '',
};

const schema = Yup.object().shape({
  photo: Yup.mixed().nullable().required('Photo is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startTime: Yup.string().required('Start Time is required'),
  endTime: Yup.string().required('End Time is required'),
  tierLimit: Yup.string().required('Tier Limit is required'),
  repeatSettings: Yup.string().required('Repeat Settings is required'),
  type: Yup.string().required('Type is required'),
  // Fields for different promotion types
  timeRangeStart: Yup.string(),
  timeRangeEnd: Yup.string(),
  pointMultiplier: Yup.string(),
  repeatOptions: Yup.string(),
  menuItem: Yup.string(),
  extraPoints: Yup.string(),
  saleMenuItem: Yup.string(),
  discountedPrice: Yup.string(),
});

const PromotionsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const methods = useForm<PromotionsFormValues>({
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;
  const photo = watch('photo');
  const selectedType = watch('type');

  const imagePreviewUrl = useMemo(() => {
    return photo instanceof File ? URL.createObjectURL(photo) : null;
  }, [photo]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onSubmit = (data: any) => {
    // Custom validation based on promotion type
    let errors: string[] = [];

    if (data.type === 'Happy Hour') {
      if (!data.timeRangeStart)
        errors.push('Time Range Start is required for Happy Hour');
      if (!data.timeRangeEnd)
        errors.push('Time Range End is required for Happy Hour');
      if (!data.pointMultiplier)
        errors.push('Point Multiplier is required for Happy Hour');
      if (!data.repeatOptions)
        errors.push('Repeat Options is required for Happy Hour');
    } else if (data.type === 'Extra Points for Buying Menu Item') {
      if (!data.menuItem)
        errors.push('Menu Item is required for Extra Points promotion');
      if (!data.extraPoints)
        errors.push('Extra Points is required for Extra Points promotion');
    } else if (data.type === 'Product Sale') {
      if (!data.saleMenuItem)
        errors.push('Menu Item is required for Product Sale');
      if (!data.discountedPrice)
        errors.push('Discounted Price is required for Product Sale');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    console.log('data', data);
  };

  const closeModal = () => {
    reset(defaultValues);
    openModal.onFalse();
    editModal.onFalse();
  };
  const handleEdit = (id: string) => {
    console.log('id', id);
    openModal.onTrue();
    editModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log('id', id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    deleteModal.onFalse();
  };

  const handleCreate = () => {
    editModal.onFalse();
    openModal.onTrue();
  };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="mr-1" />
          Create Promotion
        </Button>
      </div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <PromotionTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING ------------- */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editModal.value ? 'Edit Promotion' : 'Create Promotion'}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="photo" label="Photo" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFSelectField
                    name="type"
                    label="Promotion Type"
                    placeholder="Select Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Happy Hour', value: 'Happy Hour' },
                      {
                        label: 'Extra Points for Buying Menu Item',
                        value: 'Extra Points for Buying Menu Item',
                      },
                      { label: 'Product Sale', value: 'Product Sale' },
                    ]}
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="title"
                    label="Title"
                    placeholder="Enter Title"
                  />

                  <RHFSelectField
                    name="tierLimit"
                    label="Tier Limit"
                    placeholder="Select Tier Limit"
                    className="w-full flex-1"
                    options={[
                      { label: 'Bronze', value: 'Bronze' },
                      { label: 'Silver', value: 'Silver' },
                      { label: 'Gold', value: 'Gold' },
                      { label: 'Platinum', value: 'Platinum' },
                    ]}
                  />

                  <RHFDate
                    name="startTime"
                    label="Start Time"
                    placeholder="Select Start Date"
                    className="cursor-pointe h-10 w-full"
                  />

                  <RHFDate
                    name="endTime"
                    label="End Time"
                    placeholder="Select End Date"
                    className="cursor-pointe h-10 w-full"
                  />

                  <RHFSelectField
                    name="repeatSettings"
                    label="Repeat Settings"
                    placeholder="Select Repeat Settings"
                    className="w-full flex-1"
                    options={[
                      { label: 'None', value: 'None' },
                      { label: 'Daily', value: 'Daily' },
                      { label: 'Weekly', value: 'Weekly' },
                      { label: 'Monthly', value: 'Monthly' },
                    ]}
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    multiline
                    rows={2}
                  />
                </div>

                {/* Dynamic fields based on promotion type */}
                {selectedType === 'Happy Hour' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField
                      name="timeRangeStart"
                      label="Promotion Time Start"
                      placeholder="Enter Start Time (e.g. 17:00)"
                      type="time"
                    />
                    <RHFTextField
                      name="timeRangeEnd"
                      label="Promotion Time End"
                      placeholder="Enter End Time (e.g. 20:00)"
                      type="time"
                    />
                    <RHFSelectField
                      name="pointMultiplier"
                      label="Point Multiplier"
                      placeholder="Select Multiplier"
                      className="w-full flex-1"
                      options={[
                        { label: '1.1x', value: '1.1' },
                        { label: '1.5x', value: '1.5' },
                        { label: '2x', value: '2' },
                        { label: '3x', value: '3' },
                      ]}
                    />
                    <RHFSelectField
                      name="repeatOptions"
                      label="Repeat Options"
                      placeholder="Select Repeat Options"
                      className="w-full flex-1"
                      options={[
                        { label: 'Daily', value: 'Daily' },
                        { label: 'Monday', value: 'Monday' },
                        { label: 'Tuesday', value: 'Tuesday' },
                        { label: 'Wednesday', value: 'Wednesday' },
                        { label: 'Thursday', value: 'Thursday' },
                        { label: 'Friday', value: 'Friday' },
                        { label: 'Saturday', value: 'Saturday' },
                        { label: 'Sunday', value: 'Sunday' },
                      ]}
                    />
                  </div>
                )}

                {selectedType === 'Extra Points for Buying Menu Item' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFSelectField
                      name="menuItem"
                      label="Menu Item"
                      placeholder="Select Menu Item"
                      className="w-full flex-1"
                      options={[
                        { label: 'Coffee', value: 'Coffee' },
                        { label: 'Tea', value: 'Tea' },
                        { label: 'Sandwich', value: 'Sandwich' },
                        { label: 'Pizza', value: 'Pizza' },
                        { label: 'Burger', value: 'Burger' },
                      ]}
                    />
                    <RHFTextField
                      name="extraPoints"
                      label="Extra Points"
                      placeholder="Enter Extra Points"
                      type="number"
                    />
                  </div>
                )}

                {selectedType === 'Product Sale' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFSelectField
                      name="saleMenuItem"
                      label="Menu Item"
                      placeholder="Select Menu Item"
                      className="w-full flex-1"
                      options={[
                        { label: 'Coffee', value: 'Coffee' },
                        { label: 'Tea', value: 'Tea' },
                        { label: 'Sandwich', value: 'Sandwich' },
                        { label: 'Pizza', value: 'Pizza' },
                        { label: 'Burger', value: 'Burger' },
                      ]}
                    />
                    <RHFTextField
                      name="discountedPrice"
                      label="Discounted Price"
                      placeholder="Enter Discounted Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Promotion"
        content="Are you sure you want to delete this promotion?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default PromotionsView;
