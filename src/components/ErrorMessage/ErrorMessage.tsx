import React from 'react';
import s from './ErrorMessage.module.css';

export type ErrorMessageProps = {
    error: any;
    context?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, context }) => {
    let errorMessage = 'An unknown error occurred';

    if (error) {
        if ('status' in error) {
            switch (error.status) {
                case 400:
                    errorMessage = `Bad request. Please check the ${context || 'data'} and try again.`;
                    break;
                case 404:
                    errorMessage = `${context || 'Data'} not found. Please check the ${context || 'data'} and try again.`;
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
                default:
                    errorMessage = `An error occurred while fetching the ${context || 'data'}.`;
            }
        } else if ('error' in error) {
            errorMessage = error.error;
        }
    }

    return (
        <div className={s.errorContainer}>
            <p className={s.errorMessage}>{errorMessage}</p>
        </div>
    );
};

export default ErrorMessage;
