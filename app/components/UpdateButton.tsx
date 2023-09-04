import { useRouter } from 'next/navigation'
import React, { useState } from 'react';

interface UpdateButtonProps {
    jsonData: any; // Define the type for your JSON data
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ jsonData }) => {
    const id = jsonData.id;
    delete jsonData.id;
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const handleSaveClick = async () => {
        if (loading) {
            return; // Prevent multiple clicks while the request is in progress
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/save-data/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ jsonData }),
            });

            if (!response.ok) {
                console.error('response', response)
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
                marginLeft: '10px',
            }}
            onClick={handleSaveClick}
            disabled={loading}
        >
            {loading ? 'Updating...' : 'Update'}
        </button>
    );
};

export default UpdateButton;
