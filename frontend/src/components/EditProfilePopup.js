import React from "react";
import { useContext, useEffect, useState } from "react";

import { AppContext } from '../contexts/AppContext';

import PopupWithForm from "./PopupWithForm";
import updateFieldSetter from "../utils/updateFormFieldSetter";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  //Context
  const { currentUser } = useContext(AppContext);

  //states
  const [formErrorMessages, setFormErrorMessages] = useState({});

  const [name, setName] = useState(currentUser.name || '');
  const [description, setDescription] = useState(currentUser.about || '');

  const fieldSetters = {
    'popup__user-name': setName,
    'popup__user-description': setDescription
  }

  //effects
  //updates form inputs on open and on current user changes
  useEffect(() => {
    setName(currentUser.name || '');
    setDescription(currentUser.about || '');
    setFormErrorMessages({ 'popup__user-name': '', 'popup__user-description': '' })
  }, [isOpen, currentUser]);

  //handlers
  function handleChange(e) {
    updateFieldSetter(fieldSetters, e.target.name, e.target.value);
  }

  function handleSubmit(e, submitButtonOnUpdate) {
    onUpdateUser({ name, about: description }, submitButtonOnUpdate);
  }

  function handleErrorMessage(inputs) {
    setFormErrorMessages(inputs)
  }

  return (
    <PopupWithForm
      name="edituser"
      title="Редактировать профиль"
      buttonLabel="Сохранить"
      buttonLabelOnProcess="Сохранение..."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      handleFormErrorMessages={handleErrorMessage}
      isValidByDefault={true}
    >
      <label className="popup__form-field">
        <input className="popup__form-input popup__user-name" id="name-input" name="popup__user-name"
          placeholder="Представься, путешественник" required minLength="2" maxLength="40" onChange={handleChange} value={name} />
        <span className="popup__form-error name-input-error popup__form-error_visible">{formErrorMessages['popup__user-name']}</span>
      </label>
      <label className="popup__form-field">
        <input className="popup__form-input popup__user-description" id="description-input"
          name="popup__user-description" placeholder="Что влечет тебя к движению?" required minLength="2"
          maxLength="200" onChange={handleChange} value={description} />
        <span className="popup__form-error description-input-error popup__form-error_visible">{formErrorMessages['popup__user-description']}</span>
      </label>
    </PopupWithForm>
  )
}

export default EditProfilePopup;
