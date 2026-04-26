import { useState } from "react";
import { LoadingContext } from "./LoadingContextDef";


export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}