import React, { useEffect, useState } from "react";
import { useFormWithValidation } from "../utils/reactFormValidation";

import btnClosePopup from '../images/btn-close.svg';

function PopupWithForm({ name, isOpen, onClose, title, children, buttonLabel = 'Save', buttonLabelOnProcess = 'Saving...', onSubmit, handleFormErrorMessages = undefined, isValidByDefault = false }) {
  //state
  const [isProcessingForm, setIsProcessingForm] = useState(false);

  //handlers
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(e, handleSubmitButtonOnApiUpdate);
  }

  function handleSubmitButtonOnApiUpdate(isProcess) {
    setIsProcessingForm(isProcess);
  }

  function handleChange(e) {
    handleChangeHook(e);
    //when uses as a confirmation this handler is undefined
    if (typeof handleFormErrorMessages === 'function') {
      handleFormErrorMessages(formErrors);
    }
  }

  //Custom hooks
  //useFormValidation
  const {
    handleChange: handleChangeHook,
    errors: formErrors,
    isValid: formIsValid,
    resetForm: resetFormHook
  } = useFormWithValidation(isValidByDefault);

  //effects
  useEffect(() => {
    resetFormHook();
  }, [isOpen, resetFormHook])

  // button should be active also when there are no children (i.e. confirmation usage)
  const isTotalValid = formIsValid || !children;
  const submitButtonClassName = `popup__submit ${!isTotalValid && 'popup__submit_disabled'}`;

  return (
    <div className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__content">
        <button className="popup__btn-close" title="Закрыть форму" type="button" onClick={onClose}>
          <img alt="Закрыть" className="popup__btn-close-img" src={btnClosePopup} />
        </button>
        <h2 className="popup__title">{title}</h2>

        <form className="popup__form" name={`popup__form_${name}`} onSubmit={handleSubmit} onChange={handleChange} noValidate>
          {children}
          <button className={submitButtonClassName} type="submit" disabled={!isTotalValid || isProcessingForm}>
            {isProcessingForm ? buttonLabelOnProcess : buttonLabel}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;
