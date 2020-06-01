import React, { useState } from 'react';

import CreateModal from './CreateModal';

const AddButton = ({ status }) => {
  const [showCreateModal, setShowModal] = useState(false);

  const onOpen = () => {
    setShowModal(true);
  };

  const onClose = () => setShowModal(false);

  return (
    <>
      <div className={'add-btn'} onClick={onOpen}>
        <span role="img" aria-label="+">
          +
        </span>
      </div>

      <CreateModal onClose={onClose} show={showCreateModal} status={status} />
    </>
  );
};

export default AddButton;
