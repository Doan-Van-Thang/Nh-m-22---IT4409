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
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400',
        error: 'bg-gradient-to-r from-red-500 to-red-600 border-red-400',
        info: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400'
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    return (
        <div
            className={`${typeStyles[type]} text-white px-6 py-4 rounded-xl shadow-2xl border-l-4 
                        flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slide-in
                        backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
            role="alert"
        >
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                <span className="text-xl font-bold">{icons[type]}</span>
            </div>
            <span className="flex-1 text-sm font-semibold">{message}</span>
            <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold leading-none transition-all transform hover:scale-110 active:scale-95"
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
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
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
