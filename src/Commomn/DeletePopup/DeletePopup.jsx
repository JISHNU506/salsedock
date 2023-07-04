import React from 'react';
import "./deletepopup.css";

function DeletePopup({ deleteDiscount }) {
  return (
    <div className="delete-popup">
      <h2 className="delete-heading">Delete discount</h2>
      <div className="delete-message">
        Are you sure you want to delete {deleteDiscount ? deleteDiscount.name : ""}?
      </div>
    </div>
  );
}

export default DeletePopup;
