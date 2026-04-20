import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateQuickAccessMutation } from '@/store/Reducer/promo-section-api';
import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import * as Yup from "yup";

interface PageProps {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    editingQuickAccess: any

}

const EditQuickAccessModal: FC<PageProps> = ({ isOpen, onOpenChange, editingQuickAccess }) => {

    const defaultValues = useMemo(() => ({
        status: editingQuickAccess?.quickAction ? 'enabled' : 'disabled',
    }), [editingQuickAccess]);

    const [updateQuickAccess, { isLoading }] = useUpdateQuickAccessMutation();


    const schema = Yup.object().shape({
        status: Yup.string().required('Status is required')
    });

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        methods.reset(defaultValues);
    }, [defaultValues])

    const onSubmit = async (data: any) => {
        let response = await updateQuickAccess({
            id: editingQuickAccess?._id,
            quickAction: data.status === "enabled" ? true : false
        });
        if (!response?.error) {
            toast.success("Quick Access Status Updated Successfully");
            onOpenChange(false);
            methods.reset(defaultValues);
        }
    };

    const handleCancel = () => {

        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg dark:bg-secondary">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        Quick Access Status Change
                    </DialogTitle>
                </DialogHeader>
                <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>

                    <div className="space-y-6">
                        <div className="space-y-2">

                            <RHFSelectField
                                name="status"
                                label="Select Status"
                                placeholder="Select Status"
                                options={[
                                    { label: 'Enabled', value: 'enabled' },
                                    { label: 'Disabled', value: 'disabled' },
                                ]}
                            />

                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={handleCancel} className="flex-1">
                                Cancel
                            </Button>

                            {isLoading ? (
                                <Button type="button" className="bg-primary/80 cursor-not-allowed text-white">
                                    <ButtonLoading title="Updating" />
                                </Button>
                            ) : (
                                <Button type="submit" className="bg-primary hover:bg-primary/80 text-white">
                                    Update
                                </Button>
                            )}
                        </div>
                    </div>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}

export default EditQuickAccessModal