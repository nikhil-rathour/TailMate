import React, { useState } from 'react';
import { deletePet } from '../services/petService';

const DeletePetButton = ({ petId, onDelete, petName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deletePet(petId);
      setShowConfirm(false);
      if (onDelete) onDelete();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-red-500/70 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs shadow-lg transition"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2 text-navy">Delete Pet</h3>
            <p className="mb-4 text-navy/80">Are you sure you want to delete <span className="font-semibold">{petName || 'this pet'}</span>? This action cannot be undone.</p>
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-navy px-4 py-2 rounded-full font-bold"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePetButton; 