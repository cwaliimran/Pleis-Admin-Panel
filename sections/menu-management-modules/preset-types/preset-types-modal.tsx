'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';
import { useGetItemsCategoryQuery } from '@/store/Reducer/items-category-api';
import { useGetMenuSubcategoriesQuery } from '@/store/Reducer/menu-subcategories-api';
import { useAddPresetTypeMutation, useGetPresetTypeCodeQuery, useUpdatePresetTypeMutation } from '@/store/Reducer/preset-type-api';
import { useGetSubcategoryTypesQuery } from '@/store/Reducer/subcategory-types-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { PresetTypeFormValues, PresetTypeModalProps } from './types';

const PLACEHOLDER_IMAGE_URLS: string[] = [noImageUrl, noImageUrlDev, noImageUrlDevCap];

const defaultValues: PresetTypeFormValues = {
  image: null,
  category: '',
  subCategory: '',
  type: '',
  name: '',
  description: '',
  example: '',
  status: 'active',
};

const schema = Yup.object().shape({
  image: Yup.mixed().required('Image is required'),
  category: Yup.string().required('Category is required'),
  subCategory: Yup.string().required('Subcategory is required'),
  type: Yup.string().required('Type is required'),
  name: Yup.string().required('Name is required'),
  description: Yup.string().optional(),
  example: Yup.string().optional(),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const PresetTypeModal = ({ open, onClose, isEdit = false, selectedData }: PresetTypeModalProps) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const { data: codeData, isLoading: codeLoading } = useGetPresetTypeCodeQuery(undefined, { skip: isEdit });
  const [addPresetType, { isLoading: addLoading }] = useAddPresetTypeMutation();
  const [updatePresetType, { isLoading: updateLoading }] = useUpdatePresetTypeMutation();
  const submitting = addLoading || updateLoading || imageUploading;

  const methods = useForm<PresetTypeFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<PresetTypeFormValues>),
    defaultValues,
  });

  const { reset, control, setValue, formState } = methods;
  const isDirty = formState?.isDirty;
  const categoryValue = useWatch({ control, name: 'category' });
  const subCategoryValue = useWatch({ control, name: 'subCategory' });

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const imageValue = selectedData.image && !PLACEHOLDER_IMAGE_URLS.includes(selectedData.image) ? selectedData.image : null;
      reset({
        image: imageValue,
        category: selectedData.category?._id || '',
        subCategory: selectedData.subCategory?._id || '',
        type: selectedData.type?._id || '',
        name: selectedData.name,
        description: selectedData.description || '',
        example: selectedData.example || '',
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: PresetTypeFormValues) => {
    try {
      let imageKey: string | undefined;

      if (formData.image instanceof FileList && formData.image.length > 0) {
        const uploaded = await uploadImage(formData.image[0]);
        if (!uploaded) return;
        imageKey = uploaded;
      }

      const payload: any = {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        type: formData.type,
        description: formData.description || undefined,
        example: formData.example || undefined,
        status: formData.status,
      };
      if (imageKey) payload.image = imageKey;

      if (isEdit && selectedData?._id) {
        await updatePresetType({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Preset type updated successfully');
      } else {
        await addPresetType({ ...payload, code: codeData?.code }).unwrap();
        showSuccess('Preset type created successfully');
      }
      reset(defaultValues);
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-195!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Preset Type' : 'Create Preset Type'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-5">
                <RHFUploadAvatar
                  name="image"
                  label="Image"
                  initialImage={
                    typeof selectedData?.image === 'string' && !PLACEHOLDER_IMAGE_URLS.includes(selectedData.image) ? selectedData.image : null
                  }
                />

                {/* CLASSIFICATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Classification</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <RHFAsyncCombobox
                      name="category"
                      label="Category"
                      placeholder="Select category..."
                      searchPlaceholder="Search categories..."
                      selectedLabel={selectedData?.category?.title}
                      useOptionsQuery={useGetItemsCategoryQuery}
                      getOptionValue={(category) => category._id}
                      getOptionLabel={(category) => category.title}
                      onValueChange={() => {
                        setValue('subCategory', '', { shouldDirty: true });
                        setValue('type', '', { shouldDirty: true });
                      }}
                    />

                    <RHFAsyncCombobox
                      name="subCategory"
                      label="Subcategory"
                      placeholder={categoryValue ? 'Select subcategory...' : 'Select category first...'}
                      searchPlaceholder="Search subcategories..."
                      disabled={!categoryValue}
                      skip={!categoryValue}
                      queryArgs={{ category: categoryValue }}
                      selectedLabel={selectedData?.subCategory?.name}
                      useOptionsQuery={useGetMenuSubcategoriesQuery}
                      getOptionValue={(subcategory) => subcategory._id}
                      getOptionLabel={(subcategory) => subcategory.name}
                      onValueChange={() => setValue('type', '', { shouldDirty: true })}
                    />

                    <RHFAsyncCombobox
                      name="type"
                      label="Type"
                      placeholder={subCategoryValue ? 'Select type...' : 'Select subcategory first...'}
                      searchPlaceholder="Search types..."
                      disabled={!subCategoryValue}
                      skip={!subCategoryValue}
                      queryArgs={{ subCategory: subCategoryValue }}
                      selectedLabel={selectedData?.type?.name}
                      useOptionsQuery={useGetSubcategoryTypesQuery}
                      getOptionValue={(type) => type._id}
                      getOptionLabel={(type) => type.name}
                    />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Details</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-medium">
                        Code <span className="text-[11px] text-gray-500 dark:text-gray-300">(Auto-generated)</span>
                      </Label>
                      <Input
                        value={isEdit ? selectedData?.code || '' : codeLoading ? 'Loading...' : codeData?.code || ''}
                        disabled
                        className="h-10 bg-gray-50 dark:bg-gray-800"
                      />
                      {/* <p className="text-muted-foreground text-xs">Auto-generated</p> */}
                    </div>

                    <RHFTextField name="name" label="Name" placeholder="e.g. Lunch Menu" />
                  </div>

                  <RHFTextField
                    name="description"
                    label="Description (Optional)"
                    placeholder="Describe this preset type — helps organizers choose correctly"
                    multiline
                    rows={2}
                  />

                  <RHFTextField name="example" label="Example (Optional)" placeholder="e.g. espresso, cappuccino, latte, macchiato" />
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
                        <FormItem className="mt-1 flex flex-row items-center justify-between gap-4">
                          <div>
                            <FormLabel>Active</FormLabel>
                            <p className="text-muted-foreground pt-1 text-xs">Preset type is available for organizers to use</p>
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
