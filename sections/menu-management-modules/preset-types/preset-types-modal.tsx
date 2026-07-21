'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { getNextPresetTypeCode, mockPresetTypeRecords } from './data';
import { PresetTypeFormValues, PresetTypeModalProps } from './types';

const defaultValues: PresetTypeFormValues = {
  image: '',
  categoryId: '',
  subcategoryId: '',
  typeNameId: '',
  name: '',
  description: '',
  examples: '',
  status: 'active',
};

const schema = Yup.object().shape({
  categoryId: Yup.string().required('Category is required'),
  subcategoryId: Yup.string().required('Subcategory is required'),
  typeNameId: Yup.string().required('Type is required'),
  name: Yup.string().optional(),
  description: Yup.string().optional(),
  examples: Yup.string().optional(),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const PresetTypeModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
  categories,
  subcategories,
  typeNames,
  onSubmit,
}: PresetTypeModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<PresetTypeFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<PresetTypeFormValues>),
    defaultValues,
  });

  const { reset, control, setValue, formState } = methods;
  const isDirty = formState?.isDirty;
  const categoryId = useWatch({ control, name: 'categoryId' });
  const subcategoryId = useWatch({ control, name: 'subcategoryId' });

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({
        categoryId: selectedData.categoryId,
        subcategoryId: selectedData.subcategoryId,
        typeNameId: selectedData.typeNameId,
        name: selectedData.name || '',
        description: selectedData.description || '',
        examples: selectedData.examples || '',
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const categoryOptions = categories.map((category) => ({ value: category._id, label: category.code }));
  const subcategoryOptions = subcategories
    .filter((subcategory) => !categoryId || subcategory.categoryId === categoryId)
    .map((subcategory) => ({ value: subcategory._id, label: subcategory.title }));
  const typeNameOptions = typeNames
    .filter((typeName) => !subcategoryId || typeName.subcategoryId === subcategoryId)
    .map((typeName) => ({ value: typeName._id, label: typeName.title }));

  const nextCode = categoryId ? getNextPresetTypeCode(mockPresetTypeRecords, categoryId) : '';

  const handleSubmit = async (formData: PresetTypeFormValues) => {
    setSubmitting(true);
    try {
      onSubmit(formData);
      methods.reset(defaultValues);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[780px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Preset Type' : 'Create Preset Type'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-5">
                <RHFUploadAvatar name="image" label="Image" initialImage={typeof selectedData?.image === 'string' ? selectedData.image : null} />

                {/* CLASSIFICATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Classification</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <RHFSelectField
                      name="categoryId"
                      label="Category"
                      placeholder="Select category..."
                      options={categoryOptions}
                      onChange={() => {
                        setValue('subcategoryId', '');
                        setValue('typeNameId', '');
                      }}
                    />

                    <RHFSelectField
                      name="subcategoryId"
                      label="Subcategory"
                      placeholder={categoryId ? 'Select subcategory...' : 'Select category first...'}
                      options={subcategoryOptions}
                      disabled={!categoryId}
                      onChange={() => setValue('typeNameId', '')}
                    />

                    <RHFSelectField
                      name="typeNameId"
                      label="Type"
                      placeholder={subcategoryId ? 'Select type...' : 'Select subcategory first...'}
                      options={typeNameOptions}
                      disabled={!subcategoryId}
                    />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Details</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-medium">
                        Code <span className="text-muted-foreground text-xs font-normal">· Auto-generated based on category</span>
                      </Label>
                      <Input
                        value={isEdit ? selectedData?.code || '' : nextCode}
                        disabled
                        className="h-[40px] bg-gray-50 dark:bg-gray-800"
                      />
                    </div>

                    <RHFTextField name="name" label="Name (optional display name)" placeholder="Override name (leave blank to use Type)" />
                  </div>

                  <RHFTextField
                    name="description"
                    label="Description (Optional)"
                    placeholder="Describe this preset type — helps organizers choose correctly"
                    multiline
                    rows={2}
                  />

                  <div>
                    <RHFTextField name="examples" label="Examples (Optional)" placeholder="e.g. espresso, cappuccino, latte, macchiato" />
                    <p className="text-muted-foreground mt-1 text-xs">Comma-separated examples shown to organizers when selecting this type</p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Status</h4>

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => {
                      const checked = field.value === 'active';
                      return (
                        <FormItem className="flex flex-row items-center justify-between gap-4 mt-1">
                          <div>
                            <FormLabel>Active</FormLabel>
                            <p className="text-muted-foreground text-xs pt-1">Preset type is available for organizers to use</p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={checked}
                            onClick={() => field.onChange(checked ? 'inactive' : 'active')}
                            className={cn(
                              'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
                              checked ? 'bg-primary' : 'bg-input'
                            )}
                          >
                            <span
                              className={cn(
                                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                                checked && 'translate-x-5'
                              )}
                            />
                          </button>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex w-full items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={submitting} className="cursor-pointer px-4 py-2">
                  Cancel
                </Button>

                {submitting ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Preset Type' : 'Create Preset Type'}
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

export default PresetTypeModal;
