import React, { FC } from 'react';
import { FormProvider as ReactFormProvider } from 'react-hook-form';


interface FormProviderProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    methods: any;
    className?: string;
}

const FormProvider: FC<FormProviderProps> = ({ children, onSubmit, methods, className }) => {
    return (
        <ReactFormProvider {...methods}>
            <form onSubmit={onSubmit} className={className}>
                {children}
            </form>
        </ReactFormProvider>
    )
}

export default FormProvider;