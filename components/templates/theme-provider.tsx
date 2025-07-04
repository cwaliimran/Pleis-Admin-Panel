"use client"
import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from "next-themes";
import { FC } from "react";

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
    return (
        <NextThemeProvider {...props}>
            {children}
        </NextThemeProvider>
    )
}