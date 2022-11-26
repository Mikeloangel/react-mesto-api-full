import React from "react";

import { AppContext } from '../contexts/AppContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  //Context
  const {currentUser} = React.useContext(AppContext);

  const isOwn = card.owner._id === currentUser?._id;
  const isLIked = React.useMemo(() => card.likes.some(l => l._id === currentUser._id),[card.likes, currentUser]);

  const cardDeleteButtonClassName = `place__trash ${isOwn ? 'place__trash_visible' : 'place__trash_hidden'}`;
  const cardLikeButtonClassName = `place__like ${isLIked && 'place__like_active' }`;

  //Handlers
  function handleClick() {
    onCardClick(card)
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="section-gallery__item place__item">
      <article className="place">
        <button className={cardDeleteButtonClassName} title="Удалить" type="button" onClick={handleDeleteClick}></button>
        <img alt={card.name} className="place__img" src={card.link} onClick={handleClick} />
        <div className="place__body">
          <h2 className="place__title">{card.name}</h2>
          <div className="place__like-container">
            <button className={cardLikeButtonClassName} title="Лайк!" type="button" onClick={handleLikeClick}></button>
            <div className="place__like-counter">{card.likes.length}</div>
          </div>
        </div>
      </article>
    </li>
  )
}

export default Card;
