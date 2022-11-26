import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteConfirmationPopup({onClose, onSubmit, callbackObject}){
  function handleSubmit(e, handleSubmitButtonOnApiUpdate){
    onSubmit(callbackObject, handleSubmitButtonOnApiUpdate);
  }

  return (
    <PopupWithForm
      title="Уверены?"
      name="confirm"
      buttonLabel="Удалить"
      isOpen={callbackObject !== null}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonLabelOnProcess="Удаление..." />
  )
}

export default DeleteConfirmationPopup;
