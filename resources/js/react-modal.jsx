import React, { useState } from 'react';
import Modal from 'react-modal';

const ColorPickerModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div>
      <button onClick={openModal}>Open Color Picker</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Select a Color</h2>
        {/* Add your color picker component here */}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ColorPickerModal;
