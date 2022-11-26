import React from "react";

import btnClosePopup from '../images/btn-close.svg';

export default class ImagePopup extends React.Component {
  handleClose(e) {
    if (e.target.classList.contains('popup')) {
      this.props.handleClose();
    }
  }

  render() {
    return (
      <div className={`popup popup_${this.props.name} ${this.props.card ? 'popup_opened' : ''}`} onClick={this.handleClose.bind(this)}>
        <div className="popup__content popup__content_viewplace">
          <button className="popup__btn-close" title="Закрыть форму" type="button" onClick={this.props.handleClose}>
            <img alt="Закрыть" className="popup__btn-close-img" src={btnClosePopup} />
          </button>
          <figure className="popup__fig">
            <img src={this.props.card?.link} alt={this.props.card ? this.props.card.name : ''} className="popup__fig-img" />
            <figcaption className="popup__fig-caption">{this.props.card?.name}</figcaption>
          </figure>
        </div>
      </div>
    )
  }
}
