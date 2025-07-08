import { useCallback, useMemo, useState } from "react";

export function useBoolean(initialValue = false) {

    const [value, setValue] = useState(!!initialValue);

    const onToggle = useCallback(() => setValue((prev) => !prev), []);

    const onTrue = useCallback(() => setValue(true), []);

    const onFalse = useCallback(() => setValue(false), []);


    return useMemo(() => ({
        value,
        setValue,
        onToggle,
        onTrue,
        onFalse
    }), [value, setValue, onToggle, onTrue, onFalse]);
}