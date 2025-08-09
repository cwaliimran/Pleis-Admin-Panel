'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
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
import { Calculator, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import RewardsTable from './rewardsTable';

type HighlightFormValues = {
  image: any;
  name: string;
  type: string;
  pointValue: string;
  limit: string;
  tierLimit: string;
  description: string;
};

const defaultValues = {
  image: null,
  name: '',
  type: '',
  pointValue: '',
  limit: '',
  tierLimit: '',
  description: '',
};

const schema = Yup.object({
  image: Yup.mixed().nullable().required('Image is required'),
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  pointValue: Yup.string().required('Point Value is required'),
  limit: Yup.string().required('Limit is required'),
  tierLimit: Yup.string().required('Tier Limit is required'),
  description: Yup.string().required('Description is required'),
});

const RewardsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();
  const calculatorModal = useBoolean();

  // Calculator state
  const [itemPrice, setItemPrice] = useState<string>('');
  const [loyaltyReturn, setLoyaltyReturn] = useState<string>('');
  const [lowestPointsPerEur, setLowestPointsPerEur] = useState<string>('1');
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);

  const methods = useForm<HighlightFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;
  const image = watch('image');

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

  const onSubmit = (data: any) => {
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

  // Calculator functions
  const calculatePoints = () => {
    const price = parseFloat(itemPrice);
    const returnPercent = parseFloat(loyaltyReturn);
    const pointsPerEur = parseFloat(lowestPointsPerEur);

    if (price && returnPercent && pointsPerEur) {
      const result = price * (100 / returnPercent) * pointsPerEur;
      setCalculatedPoints(Math.round(result));
    }
  };

  const useCalculatedValue = () => {
    if (calculatedPoints !== null) {
      methods.setValue('pointValue', calculatedPoints.toString());
      calculatorModal.onFalse();
    }
  };

  const resetCalculator = () => {
    setItemPrice('');
    setLoyaltyReturn('');
    setLowestPointsPerEur('1');
    setCalculatedPoints(null);
  };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end gap-3 md:mt-0">
        <Button
          onClick={calculatorModal.onTrue}
          className="cursor-pointer rounded-4xl bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          <Calculator className="mr-1" />
          Reward Calculator
        </Button>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
        >
          <Plus className="mr-1" />
          Create Reward
        </Button>
      </div>

      {/* ------------- HIGHLIGHT TABLE ------------- */}
      <RewardsTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- MODAL FOR ADDING AND EDITING ------------- */}
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editModal.value ? 'Edit Reward' : 'Create Reward'}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(() => {})}
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

                  <div className="relative">
                    <RHFTextField
                      name="pointValue"
                      label="Point Value"
                      placeholder="Enter Point Value"
                      type="number"
                    />
                  </div>

                  <RHFTextField
                    name="limit"
                    label="Limit"
                    placeholder="Enter Limit"
                    type="number"
                  />

                  <RHFSelectField
                    name="tierLimit"
                    label="Tier Limit"
                    placeholder="Select Tier Limit"
                    className="w-full flex-1"
                    options={[
                      { label: 'Bronze', value: 'bronze' },
                      { label: 'Silver', value: 'silver' },
                      { label: 'Gold', value: 'gold' },
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
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="button"
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
        title="Delete Reward"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />

      {/* ------------- REWARD CALCULATOR MODAL ------------- */}
      <Dialog
        open={calculatorModal.value}
        onOpenChange={calculatorModal.onFalse}
      >
        <DialogOverlay className="bg-opacity-30 fixed inset-0">
          <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Reward Calculator
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 w-full space-y-6">
              {/* Formula Display */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold">Formula:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Point Value = Item Price (€) × (100 / selected % return) ×
                  [lowest points possible per EUR]
                </p>
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-4">
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
                      Loyalty Return (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Enter % return"
                      value={loyaltyReturn}
                      onChange={(e) => setLoyaltyReturn(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Lowest Points per EUR
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter points per EUR"
                    value={lowestPointsPerEur}
                    onChange={(e) => setLowestPointsPerEur(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={calculatePoints}
                  disabled={!itemPrice || !loyaltyReturn || !lowestPointsPerEur}
                  className="bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  Calculate Points
                </Button>
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
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 border-t pt-4">
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>

                {/* {calculatedPoints !== null && (
                  <Button
                    onClick={useCalculatedValue}
                    className="bg-primary hover:bg-primary flex-1 text-white"
                  >
                    Use This Value
                  </Button>
                )} */}

                <Button
                  onClick={() => {
                    calculatorModal.onFalse();
                    resetCalculator();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default RewardsView;
