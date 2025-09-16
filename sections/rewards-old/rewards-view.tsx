'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { Calculator, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import RewardsTable from './rewardsTable';

type RewardFormValues = {
  image: any;
  name: string;
  type: string;
  pointValue: string;
  limit: string;
  tierLimit: string;
  description: string;
  creationMethod: string;
  percentOff: string;
  menuItems: string[];
  eventId: string;
};

const defaultValues: RewardFormValues = {
  image: null,
  name: '',
  type: '',
  pointValue: '',
  limit: '',
  tierLimit: 'none',
  description: '',
  creationMethod: 'custom',
  percentOff: '',
  menuItems: [],
  eventId: '',
};

const RewardsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Calculator state
  const [itemPrice, setItemPrice] = useState<string>('');
  const [loyaltyReturn, setLoyaltyReturn] = useState<string>('');
  const [lowestPointsPerEur, setLowestPointsPerEur] = useState<string>('');

  // Calculate points reactively
  const calculatedPoints = useMemo(() => {
    const price = parseFloat(itemPrice);
    const returnPercent = parseFloat(loyaltyReturn);
    const pointsPerEur = parseFloat(lowestPointsPerEur);
    if (price && returnPercent && pointsPerEur) {
      return Math.round(price * (100 / returnPercent) * pointsPerEur);
    }
    return null;
  }, [itemPrice, loyaltyReturn, lowestPointsPerEur]);

  const methods = useForm<RewardFormValues>({
    defaultValues,
  });

  const { watch, reset, handleSubmit, setValue } = methods;
  const image = watch('image');
  const creationMethod = watch('creationMethod');

  // Function to copy calculated points to form
  const useCalculatedPoints = () => {
    if (calculatedPoints !== null) {
      setValue('pointValue', calculatedPoints.toString());
    }
  };

  // Function to reset calculator
  const resetCalculator = () => {
    setItemPrice('');
    setLoyaltyReturn('');
    setLowestPointsPerEur('1');
  };

  const imagePreviewUrl = useMemo(() => {
    return image instanceof File ? URL.createObjectURL(image) : null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onSubmit = (data: RewardFormValues) => {
    console.log('Reward data:', data);
    closeModal();
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
      <div className="mt-3 flex w-full items-center justify-end gap-3 md:mt-0">
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="mr-1" />
          Create Reward
        </Button>
      </div>

      {/* --- REWARD CALCULATOR --- */}
      <Card className="dark:bg-secondary mt-3 max-w-5xl gap-2 rounded-lg p-6">
        <div className="mb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <span className="text-lg font-semibold">Reward Calculator</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetCalculator}
            className="text-xs"
          >
            Reset
          </Button>
        </div>

        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Use this calculator to determine the appropriate point value for menu
          item rewards.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Item Price (€)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Enter item price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Points
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Enter points"
              value={lowestPointsPerEur}
              onChange={(e) => setLowestPointsPerEur(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        {/* Result Display */}
        {calculatedPoints !== null && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                Calculated Point Value:
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {calculatedPoints} points
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use this value when creating menu item rewards
              </p>
              {openModal.value && (
                <Button
                  type="button"
                  onClick={useCalculatedPoints}
                  className="mt-2 bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                >
                  Use This Value
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ------------- TABLE ------------- */}
      <RewardsTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING ------------- */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editModal.value ? 'Edit Reward' : 'Create Reward'}
              </DialogTitle>
            </DialogHeader>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                {/* Creation Method Selection */}
                <RHFSelectField
                  name="creationMethod"
                  label="Creation Method"
                  placeholder="Select creation method"
                  className="w-full"
                  options={[
                    { label: 'From Menu Items', value: 'menu-items' },
                    { label: 'Create Custom Reward', value: 'custom' },
                    { label: 'Add Ticket Reward', value: 'ticket' },
                  ]}
                />

                {/* Helper text based on creation method */}
                {creationMethod === 'menu-items' && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 Select menu items to link directly for easier scanning
                      and fulfillment. Use the calculator above to determine
                      point values.
                    </p>
                  </div>
                )}

                {creationMethod === 'custom' && (
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <p className="text-xs text-green-800 dark:text-green-200">
                      💡 Create custom rewards for items not in your menu
                      (merchandise, entry perks, etc.). Set your own point value
                      and description.
                    </p>
                  </div>
                )}

                {creationMethod === 'ticket' && (
                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <p className="text-xs text-purple-800 dark:text-purple-200">
                      💡 Create exclusive tickets available only through loyalty
                      rewards. These are not for sale and provide special access
                      to events.
                    </p>
                  </div>
                )}

                {/* Conditional Fields based on Creation Method */}
                {creationMethod === 'menu-items' && (
                  <div className="grid w-full grid-cols-1 gap-4">
                    <RHFMultiSelect
                      name="menuItems"
                      label="Select Menu Items"
                      placeholder="Choose menu items"
                      options={[
                        { label: 'Pepperoni Pizza', value: 'pizza-1' },
                        { label: 'Caesar Salad', value: 'salad-1' },
                        { label: 'Cappuccino', value: 'coffee-1' },
                        { label: 'Vanilla Ice Cream', value: 'dessert-1' },
                      ]}
                    />
                  </div>
                )}

                {creationMethod === 'ticket' && (
                  <div className="grid w-full grid-cols-1 gap-4">
                    <RHFSelectField
                      name="eventId"
                      label="Select Event"
                      placeholder="Choose event for ticket reward"
                      className="w-full"
                      options={[
                        { label: 'Summer Music Festival', value: 'event-1' },
                        { label: 'Food & Wine Expo', value: 'event-2' },
                        {
                          label: 'Business Networking Night',
                          value: 'event-3',
                        },
                      ]}
                    />
                  </div>
                )}

                {/* Image Upload - Optional but recommended */}
                <RHFUploadAvatar
                  name="image"
                  label="Image (Optional but recommended)"
                />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="Enter reward name"
                  />

                  <RHFTextField
                    name="type"
                    label="Type"
                    placeholder="Enter type for sorting"
                  />

                  <div className="relative">
                    <RHFTextField
                      name="pointValue"
                      label="Point Value"
                      placeholder="Points required to claim"
                      type="number"
                    />
                  </div>

                  <RHFTextField
                    name="limit"
                    label="Limit (Optional)"
                    placeholder="Max times claimable"
                    type="number"
                  />

                  <RHFSelectField
                    name="tierLimit"
                    label="Tier Limit (Optional)"
                    placeholder="Minimum tier required"
                    className="w-full flex-1"
                    options={[
                      { label: 'No Restriction', value: 'none' },
                      { label: 'Bronze and above', value: 'bronze' },
                      { label: 'Silver and above', value: 'silver' },
                      { label: 'Gold only', value: 'gold' },
                    ]}
                  />

                  <RHFTextField
                    name="percentOff"
                    label="Percent Off (Optional)"
                    placeholder="For coupon rewards (0-100)"
                    type="number"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Show percentage info when percent off is entered */}
                {watch('percentOff') && Number(watch('percentOff')) > 0 && (
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      💡 This reward will provide {watch('percentOff')}% off
                      instead of a free item. Customers will pay the remaining
                      amount.
                    </p>
                  </div>
                )}

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFTextField
                    name="description"
                    label="Description (Optional)"
                    placeholder="Enter reward details"
                    multiline
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    Save Reward
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Reward"
        content="Are you sure you want to delete this reward?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default RewardsView;
