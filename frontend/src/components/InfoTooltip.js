import React from "react";
import { useEffect } from "react";

import btnClosePopup from '../images/btn-close.svg';

/**
 * Shows Info popup with image
 * @param {String} message text to display
 * @param {Object} imgList {state:src} e.g {'fail',src} or {'done',src}
 * @param {String} type represents state from imgList, 'hidden' will trigger closure
 * @param {Function} onClose
 * @param {Integer} autoClose in ms, 0 will disable this function
 * @returns JSX
 */
function InfoToolTip({ message, imgList, type = 'hidden', onClose, autoClose = 10000 }) {
  //autoclose in 10s
  useEffect(() => {
    if (type !== 'hidden' && autoClose > 0) {
      setTimeout(onClose, autoClose);
    }
  }, [type, autoClose, onClose])

  return (
    <div className={`popup popup_info ${type !== 'hidden' ? 'popup_opened' : ''}`}>
      <div className="popup__content popup__content_tooltip">
        <button className="popup__btn-close" title="Закрыть окно" type="button">
          <img alt="Закрыть" className="popup__btn-close-img" src={btnClosePopup} onClick={onClose} />
        </button>
        <img src={imgList[type]} alt={message} className="popup__info-img" />
        <h2 className="popup__info-title">{message}</h2>
      </div>
    </div>
  )
}

export default InfoToolTip;
