import React from 'react';
import btnClosePopup from '../images/btn-close.svg';

function PopupWithNotification({onClose, title= 'Error', message = null}){
  return (
    <div className={`popup popup_errors ${message ? 'popup_opened' : ''}`}>
      <div className="popup__content">
        <button className="popup__btn-close" title="Закрыть форму" type="button">
          <img alt="Закрыть" className="popup__btn-close-img" src={btnClosePopup} onClick={onClose} />
        </button>
        <h2 className="popup__title">{title}</h2>
        <p className="popup__message">{message}</p>
      </div>
    </div>
  )
}

export default PopupWithNotification;
