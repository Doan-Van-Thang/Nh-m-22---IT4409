import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays elegant notifications with different types (success, error, info, warning)
 */
export function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeStyles = {
        success: 'bg-green-500 border-green-600',
        error: 'bg-red-500 border-red-600',
        info: 'bg-blue-500 border-blue-600',
        warning: 'bg-yellow-500 border-yellow-600'
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    return (
        <div
            className={`${typeStyles[type]} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 
                        flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slide-in`}
            role="alert"
        >
            <span className="text-2xl font-bold">{icons[type]}</span>
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-xl font-bold leading-none"
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
}

/**
 * Toast Container Component
 * Manages multiple toast notifications
 */
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
