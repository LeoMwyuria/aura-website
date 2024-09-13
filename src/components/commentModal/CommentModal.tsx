import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  comment: string;
  auraChange: string;
}

const CommentModal: React.FC<ModalProps> = ({ isOpen, onClose, date, comment, auraChange }) => {
  if (!isOpen) return null;

  
  const formattedAuraChange = Number(auraChange) > 0 ? `+${auraChange}` : auraChange;


  const handleOverlayClick = (e: React.MouseEvent) => {
    
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
      onClick={handleOverlayClick} 
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-full relative modal-enter" 
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="text-custom-purple rounded-lg float-right"
        >
          X
        </button>
        <h2 className="text-xl text-gray-500 mb-4">Aura Activity Details</h2>
        <p className="text-gray-700 mb-2"><strong>Date:</strong> {date}</p>
        <p className="text-gray-700 mb-4"><strong>Comment:</strong> {comment || 'No Comment'}</p>
        <p className="text-gray-700 mb-4"><strong>Aura Change: {formattedAuraChange} aura</strong></p>
      </div>
    </div>
  );
};

export default CommentModal;
