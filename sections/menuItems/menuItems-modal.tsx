'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type MenuItemFormValues = {
  image?: any;
  name: string;
  type: string;
  itemCategory: string;
  itemVenue: string;
  basePrice: string;
  discountPrice: string | null;
  description: string;
};

const defaultValues: MenuItemFormValues = {
  image: null,
  name: '',
  type: '',
  itemCategory: '',
  itemVenue: '',
  basePrice: '',
  discountPrice: '',
  description: '',
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
});

type MenuItemModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuItemFormValues;
};

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

  const { reset, setValue } = methods;

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
  const presets = [
    { name: 'Coca Cola 1.5L' },
    { name: 'Pepsi 500ml' },
    { name: 'Chicken Burger' },
    { name: 'French Fries' },
  ];

  const handlePresetClick = (presetName: string) => {
    setValue('name', presetName);
  };

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
                    name="itemVenue"
                    label="Select Venue"
                    placeholder="Select Venue"
                    className="w-full flex-1"
                    options={[
                      { value: 'type1', label: 'Main Hall' },
                      { value: 'type2', label: 'Garden Area' },
                      { value: 'type3', label: 'Coffee Bar' },
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
                  <div className="flex flex-wrap gap-2">
                    {presets?.map((preset, idx) => (
                      <div
                        key={idx}
                        className="cursor-pointer rounded-full py-1 text-sm"
                        onClick={() => handlePresetClick(preset.name)}
                      >
                        <CustomBadge>{preset.name}</CustomBadge>
                      </div>
                    ))}
                  </div>
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
