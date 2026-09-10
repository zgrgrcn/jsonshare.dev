'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';

interface SaveButtonProps {
    jsonData: any;
    disabled?: boolean;
}

const BTN = 'shrink-0 rounded bg-primary-600 px-5 py-2 font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50';

const SaveButton: React.FC<SaveButtonProps> = ({ jsonData, disabled }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSaveClick = async () => {
        if (loading || disabled) {
            return; // Prevent multiple clicks while the request is in progress
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/save-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jsonData }),
            });

            if (!response.ok) {
                setError('Could not save. Please try again.');
                return;
            }

            const responseBody = await response.json();
            router.push(`/json/${responseBody._id}`)
        } catch (error) {
            console.error('An error occurred:', error);
            setError('Could not save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex shrink-0 items-center gap-3">
            <button type="button" className={BTN} onClick={handleSaveClick} disabled={loading || disabled}>
                {loading ? 'Saving...' : 'Save'}
            </button>
            {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
        </div>
    );
};

export default SaveButton;
