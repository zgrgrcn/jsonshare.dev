'use client'
import React, { useState } from 'react';

interface UpdateButtonProps {
    id: string;
    jsonData: any;
    disabled?: boolean;
}

const BTN = 'shrink-0 rounded bg-primary-600 px-5 py-2 font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50';

type State = 'idle' | 'saving' | 'saved' | 'error';

const UpdateButton: React.FC<UpdateButtonProps> = ({ id, jsonData, disabled }) => {
    const [state, setState] = useState<State>('idle');

    const handleSaveClick = async () => {
        if (state === 'saving' || disabled) {
            return; // Prevent multiple clicks while the request is in progress
        }

        setState('saving');

        try {
            const response = await fetch(`/api/save-data/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jsonData }),
            });

            if (!response.ok) {
                setState('error');
                return;
            }

            setState('saved');
            window.setTimeout(() => setState('idle'), 2000);
        } catch (error) {
            console.error('An error occurred:', error);
            setState('error');
        }
    };

    return (
        <div className="flex shrink-0 items-center gap-3">
            <button type="button" className={BTN} onClick={handleSaveClick} disabled={state === 'saving' || disabled}>
                {state === 'saving' ? 'Updating...' : 'Update'}
            </button>
            {state === 'saved' && <span className="text-sm text-green-600 dark:text-green-400">Saved</span>}
            {state === 'error' && <span className="text-sm text-red-600 dark:text-red-400">Could not update. Please try again.</span>}
        </div>
    );
};

export default UpdateButton;
