import React, { FC } from 'react';
import { FormProvider as ReactFormProvider } from 'react-hook-form';


interface FormProviderProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    methods: any;
}

const FormProvider: FC<FormProviderProps> = ({ children, onSubmit, methods }) => {
    return (
        <ReactFormProvider {...methods}>
            <form onSubmit={onSubmit}>
                {children}
            </form>
        </ReactFormProvider>
    )
}

export default FormProvider;