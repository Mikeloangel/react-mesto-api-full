import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";

import { AppContext } from '../contexts/AppContext';

import updateFieldSetter from "../utils/updateFormFieldSetter";
import * as apiAuth from '../utils/ApiAuth';

function Register({ onFail, onSuccess }) {
  const { isLogged } = useContext(AppContext);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const [mailInput, setMailInput] = useState('');
  const [passwordInput, setPasswrodInput] = useState('');

  const fieldSetters = {
    'mail': setMailInput,
    'password': setPasswrodInput
  }

  function handleInputChange(e) {
    updateFieldSetter(fieldSetters, e.target.name, e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmittingForm(true);
    apiAuth.register(mailInput, passwordInput)
      .then(data => {
        onSuccess(data);
      })
      .catch(data => {
        onFail(data);
        setIsSubmittingForm(false);
      })
  }

  return isLogged ?
    (<Redirect to="/" />) :
    (<section className="section section-sign">
      <h2 className="section-sign__title">Регистрация</h2>
      <form name="signup" className="section-sign__form" onSubmit={handleSubmit}>
        <input name="mail" type="email" required className="section-sign__input" placeholder="Email" value={mailInput} onChange={handleInputChange} />
        <input name="password" type="password" required className="section-sign__input" placeholder="Пароль" value={passwordInput} onChange={handleInputChange} />
        <button type="submit" className="section-sign__submit" disabled={isSubmittingForm}>
          {isSubmittingForm ? 'В процессе...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="section-sign__paragraph">
        Уже зарегистрированы? <Link to="/sign-in" className="section-sign__link">Войти</Link>
      </p>
    </section>);
}

export default Register;
