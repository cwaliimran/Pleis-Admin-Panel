'use client';

import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
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
import { MenuItemModalProps } from './types';

const defaultValues = {
  itemVenue: '',
};

const schema = Yup.object({
  itemVenue: Yup.string().required('Venue is required'),
});

const DuplicateMenuModal = ({
  open,
  onClose,
  selectedData,
}: MenuItemModalProps) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
    useGetVenuesQuery({ page: 0, limit: 10000 });

  const { reset } = methods;

  const handleSubmit = (data: any) => {
    console.log('Menu item data:', data);
    reset(defaultValues);
    onClose();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[24vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
          <DialogHeader className="w-full text-start">
            <DialogTitle>Duplicate Menu</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2">
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

                  {/* <div className="col-span-2">
                    <RHFCustomCombobox
                      name="menu"
                      label="Select Menu"
                      placeholder="Select menu"
                      className="w-full flex-1"
                      multiple={true}
                      allowCustom={venuesLoading}
                      options={[
                        { label: 'Vegan', value: 'vegan' },
                        { label: 'Vegetarian', value: 'vegetarian' },
                        { label: 'Gluten-Free', value: 'gluten-free' },
                        { label: 'Dairy-Free', value: 'dairy-free' },
                        { label: 'Nut-Free', value: 'nut-free' },
                        { label: 'Halal', value: 'halal' },
                        { label: 'Kosher', value: 'kosher' },
                        { label: 'Low-Carb', value: 'low-carb' },
                        { label: 'Low-Fat', value: 'low-fat' },
                        { label: 'High-Protein', value: 'high-protein' },
                      ]}
                    />
                  </div> */}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    Duplicate Menu
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

export default DuplicateMenuModal;
