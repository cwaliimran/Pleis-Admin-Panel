'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { MenuItemFormValues, MenuItemModalProps } from './types';

const defaultValues: MenuItemFormValues = {
  image: null,
  name: '',
  type: '',
  itemCategory: '',
  itemVenue: '',
  basePrice: '',
  discountPrice: '',
  description: '',
  preset: null,
};

const schema: Yup.ObjectSchema<MenuItemFormValues> = Yup.object({
  image: Yup.mixed().nullable(),
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  itemCategory: Yup.string().required('Item category is required'),
  itemVenue: Yup.string().required('Venue is required'),
  basePrice: Yup.string().required('Base price is required'),
  discountPrice: Yup.string().nullable().default(''),
  description: Yup.string().required('Description is required'),
  preset: Yup.number().nullable(),
});

const MenuItemModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: MenuItemModalProps) => {
  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
    useGetVenuesQuery({ page: 0, limit: 10000 });

  const { reset, setValue, watch } = methods;

  const handleSubmit = (data: any) => {
    console.log('Menu item data:', data);
    reset(defaultValues);
    onClose();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // Preset items
  const presets = React.useMemo(
    () => [
      { _id: 1, title: 'Coca Cola 1.5L' },
      { _id: 2, title: 'Pepsi 500ml' },
      { _id: 3, title: 'Chicken Burger' },
      { _id: 4, title: 'French Fries' },
      { _id: 5, title: 'Veg Pizza' },
      { _id: 6, title: 'Grilled Sandwich' },
      { _id: 7, title: 'Orange Juice' },
      { _id: 8, title: 'Chocolate Cake' },
      { _id: 9, title: 'Caesar Salad' },
      { _id: 10, title: 'Mineral Water 1L' },
    ],
    []
  );

  const presetOptions =
    presets?.map((preset: any) => ({
      label: preset?.title,
      value: preset?._id,
    })) || [];

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'preset' && value.preset) {
        const selectedPreset = presets.find((p) => p._id === value.preset);
        if (selectedPreset) {
          setValue('name', selectedPreset.title);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, presets]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Menu Item' : 'Create Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="image" label="Image" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                  />
                  <RHFTextField
                    name="type"
                    label="Type"
                    placeholder="Enter Type"
                  />
                  <RHFSelectField
                    name="itemCategory"
                    label="Item Category"
                    placeholder="Select Item Category"
                    className="w-full flex-1"
                    options={[
                      { label: 'Type 1', value: 'type1' },
                      { label: 'Type 2', value: 'type2' },
                      { label: 'Type 3', value: 'type3' },
                    ]}
                  />

                  <RHFSelectField
                    name="menu"
                    label="Select Menu"
                    placeholder="Select Menu"
                    className="w-full flex-1"
                    options={[
                      { value: 'type1', label: 'Main Hall Lunch Menu' },
                      { value: 'type2', label: 'Garden Area Lunch Menu' },
                      { value: 'type3', label: 'Coffee Bar Lunch Menu' },
                    ]}
                  />

                  <RHFTextField
                    name="basePrice"
                    label="Base Price"
                    placeholder="Enter Base Price"
                  />

                  <RHFTextField
                    name="discountPrice"
                    label="Discount Price"
                    placeholder="Enter Discount Price"
                  />

                  <div className={`${isEdit ? 'col-span-1' : 'col-span-2'}`}>
                    <RHFCustomDropdown
                      name="itemVenue"
                      label="Venue"
                      placeholder="Select Venue"
                      options={venues?.map((val: any) => ({
                        value: val?._id,
                        label: val?.title,
                      }))}
                      isLoading={venuesLoading}
                      showNone={false}
                    />
                  </div>

                  {isEdit && (
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
                  )}
                </div>

                {/* Description */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    multiline
                    rows={2}
                  />
                </div>

                {/* Preset Section */}
                <div className="mt-2">
                  <h4 className="mb-2 text-sm font-semibold">Presets</h4>
                  <RHFCustomDropdown
                    name="preset"
                    placeholder="Select Preset"
                    options={presetOptions}
                    isLoading={false}
                    showNone={false}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    {isEdit ? 'Update' : 'Create'} Menu Item
                  </Button>
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
