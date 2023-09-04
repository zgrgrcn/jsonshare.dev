// components/SaveButton.tsx

import React, { useState } from 'react';

interface SaveButtonProps {
    jsonData: any; // Define the type for your JSON data
}

const SaveButton: React.FC<SaveButtonProps> = ({ jsonData }) => {
    const [loading, setLoading] = useState(false);

    const handleSaveClick = async () => {
        if (loading) {
            return; // Prevent multiple clicks while the request is in progress
        }

        setLoading(true);

        try {
            const response = await fetch('/api/saveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jsonData }),
            });

            if (response.ok) {
                console.log('Data saved successfully!');
            } else {
                console.error('Failed to save data to the database');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '10px',
            }}
            onClick={handleSaveClick}
            disabled={loading}
        >
            {loading ? 'Saving...' : 'Save'}
        </button>
    );
};

export default SaveButton;
