import React from 'react';

interface ProductModalProps {
  product: string;
  totalSales: number;
  category: string;
  quantity: number | null;
  onClose: () => void;  // A callback to close the modal
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  totalSales,
  category,
  quantity,
  onClose
}) => {
  return (
    <div className="modal-overlay" style={styles.modalOverlay}>
      <div className="modal-content" style={styles.modalContent}>
        <h2>{product}</h2>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Total Sales:</strong> ${totalSales.toFixed(2)}</p>
        <p><strong>Quantity:</strong> {quantity ? quantity : 'N/A'}</p>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  modalOverlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    maxWidth: '90%',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProductModal;
