import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { AppContext } from '../contexts/AppContext';

import api from '../utils/Api';
import * as apiAuth from '../utils/ApiAuth'

import ProtectedRoute from './ProtectedRoute';

import Register from "./Register";
import Login from "./Login";

import Spinner from './Spinner';
import NotFound from './NotFound';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';
import PopupWithNotification from './PopupWithNotification';
import InfoToolTip from './InfoTooltip';

import imgSuccess from '../images/succeed.png';
import imgFail from '../images/fail.png';

function App() {
  //States
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selecetdCardToDelete, setSelecetdCardToDelete] = useState(null);

  const [apiErrorMessage, setApiErrorMessage] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [userMail, setUserMail] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const imgList = { 'succeed': imgSuccess, 'fail': imgFail };
  const [infoType, setInfoType] = useState('hidden');
  const [infoMessage, setInfoMessage] = useState('');

  //Shows spinner until apiAuth requests are fullfiled
  const [isAppReady, setIsAppReady] = useState(false);

  const history = useHistory();

  //checks token
  useEffect(() => {
    //check token
    const token = localStorage.getItem('token');
    apiAuth.checkToken(token)
      .then(userData => {
        setUserMail(userData.email);
        setIsLogged(true);
      })
      .catch(() => {
        history.push('/sign-in')
      })
      .finally(() => {
        setIsAppReady(true);
      });

    // retrieve currentUser
    if (isLogged) {
      api.getUserMe()
        .then(setCurrentUser)
        .catch(err => api.handleError(err, setApiErrorMessage));
    }

  }, [history, isLogged]);

  //on CurrentUser changes retrieves initial cards
  useEffect(() => {
    if (isLogged) {
      api
        .getInitialCards()
        .then(setCards)
        .catch(err => api.handleError(err, setApiErrorMessage));
    }
  }, [currentUser, isLogged]);

  //handlers
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);

    setSelectedCard(null);
    setSelecetdCardToDelete(null);

    setInfoMessage('');
    setInfoType('hidden');
  }

  function closeNotificationPopup() {
    setApiErrorMessage(null);
  }

  function handleUpdateUser(newInfo, submitButtonOnUpdate) {
    submitButtonOnUpdate(true);

    api.pathchUserMe(newInfo)
      .then(updatedUserInfo => {
        setCurrentUser(updatedUserInfo);
        closeAllPopups();
      })
      .catch(err => api.handleError(err, setApiErrorMessage))
      .finally(() => {
        submitButtonOnUpdate(false);
      });
  }

  function handleUpdateAvatar(link, submitButtonOnUpdate) {
    submitButtonOnUpdate(true);
    api.patchUserAvatar(link)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(err => api.handleError(err, setApiErrorMessage))
      .finally(() => {
        submitButtonOnUpdate(false);
      })
  }

  function handleCardLike(cardToLike) {
    const isLiked = cardToLike.likes.some(like => like._id === currentUser._id);
    const likePromise = isLiked ? api.deleteLike(cardToLike._id) : api.putLike(cardToLike._id);

    likePromise
      .then(newCard => {
        setCards(prevCards => prevCards.map(card => card._id === cardToLike._id ? newCard : card))
      })
      .catch(err => api.handleError(err, setApiErrorMessage))
  }

  function handleCardDelete(card) {
    setSelecetdCardToDelete(card);
  }

  function handleConfirmCardDelete(cardToDelete, handleSubmitButtonOnApiUpdate) {
    handleSubmitButtonOnApiUpdate(true);
    api.deleteCard(cardToDelete._id)
      .then(() => {
        setCards(prevCards => prevCards.filter(card => card._id !== cardToDelete._id));
        closeAllPopups();
      })
      .catch(err => api.handleError(err, setApiErrorMessage))
      .finally(() => {
        handleSubmitButtonOnApiUpdate(false);
      });
  }

  function handleAddCard(newCard, submitButtonOnUpdate) {
    submitButtonOnUpdate(true);
    api.postCard(newCard)
      .then(addedCard => {
        setCards(previousCards => [addedCard, ...previousCards]);
        closeAllPopups();
      })
      .catch(err => api.handleError(err, setApiErrorMessage))
      .finally(() => {
        submitButtonOnUpdate(false);
      });
  }

  function handleSignOut() {
    apiAuth.forgetToken();
    setIsLogged(false);
    setUserMail('');
  }

  function handleRegisterOnFail(data) {
    console.error(data);
    setInfoMessage('Что-то пошло не так! Попробуйте ещё раз.');
    setInfoType('fail');
  }

  function handleRegisterOnSuccess(data) {
    console.warn(data);
    setInfoMessage('Вы успешно зарегистрировались!');
    setInfoType('succeed');
    history.push('/sign-in');
  }

  function handleLoginOnFail(errMsg) {
    console.error(errMsg);
    setInfoMessage('Неверный логин или пароль!');
    setInfoType('fail');
  }

  function handleLoginOnSuccess(token) {
    localStorage.setItem('token', token);
    setIsLogged(true);
    history.push('/');
  }

  return (
    <AppContext.Provider value={{ isLogged, userMail, currentUser }}>
      <div className="root">

        <Header onSignOut={handleSignOut} />

        {!isAppReady ?
          <Spinner /> :

          <Switch>
            <ProtectedRoute
              exact
              path='/'
              component={Main}
              isLogged={isLogged}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              handleCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete} />

            <Route exact path='/sign-up'>
              <Register onFail={handleRegisterOnFail} onSuccess={handleRegisterOnSuccess} />
            </Route>

            <Route exact path='/sign-in'>
              <Login onFail={handleLoginOnFail} onSuccess={handleLoginOnSuccess} />
            </Route>

            <Route path='*'>
              <NotFound />
            </Route>

          </Switch>
        } {/* isAppReady end */}

        <Footer />

        {/* Popups */}

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddCard} />

        <DeleteConfirmationPopup onClose={closeAllPopups} callbackObject={selecetdCardToDelete} onSubmit={handleConfirmCardDelete} />

        <ImagePopup card={selectedCard} name="viewplace" handleClose={closeAllPopups} />

        {/* Popup with notification, shows API errors */}
        <PopupWithNotification onClose={closeNotificationPopup} message={apiErrorMessage} title="Ошибка в работе API" />

        <InfoToolTip message={infoMessage} imgList={imgList} type={infoType} onClose={closeAllPopups} />

      </div>
    </AppContext.Provider>
  );
}

export default App;
