'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                },
                classNames: {
                    success: 'border-l-4 border-l-green-500',
                    error: 'border-l-4 border-l-red-500',
                    info: 'border-l-4 border-l-blue-500',
                },
            }}
            richColors
            closeButton
        />
    );
}
