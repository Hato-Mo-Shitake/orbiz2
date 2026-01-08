import { useEffect, useState } from "react";
import { FmAttrViewer } from "src/orbits/contracts/fmAttr";
import { Listener } from "src/orbits/contracts/observer";

export function useFmAttrViewer<T extends any>(viewer: FmAttrViewer<T>): T | null {
    const [value, setValue] = useState<T | null>(viewer.value);

    useEffect(() => {
        const listener: Listener<T> = (newValue: T) => {
            setValue(newValue)
        };

        viewer.addListener(listener);
        return () => viewer.removeListener(listener);
    }, [viewer]);

    return value;
}