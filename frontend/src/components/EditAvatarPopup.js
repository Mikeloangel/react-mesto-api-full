import React from "react";
import { useEffect, useRef, useState } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  //Refs
  const avatarElement = useRef();

  //States
  const [formErrorMessages, setFormErrorMessages] = useState({});
  const [link, setLink] = useState('');

  //Effect
  //clears form input on open
  useEffect(()=>{
    setLink('');
    setFormErrorMessages({'popup__avatar-link': ''})
  },[isOpen]);

  //Handlers
  function handleChange(){
    setLink(avatarElement.current.value);
  }

  function handleSubmit(e, submitButtonOnUpdate){
    onUpdateAvatar(link, submitButtonOnUpdate);
  }

  function handleErrorMessage(inputs){
    setFormErrorMessages(inputs)
  }

  return (
    <PopupWithForm
      name="editavatar"
      title="Обновить аватар"
      buttonLabel="Сохранить"
      buttonLabelOnProcess="Обновление..."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      handleFormErrorMessages={handleErrorMessage}
      >
      <label className="popup__form-field">
        <input ref={avatarElement} className="popup__form-input popup__avatar-link" id="avatar-input" name="popup__avatar-link"
          placeholder="Адрес картинки" type="url" required onChange={handleChange} value={link} />
        <span className="popup__form-error avatar-input-error popup__form-error_visible">{formErrorMessages['popup__avatar-link']}</span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
