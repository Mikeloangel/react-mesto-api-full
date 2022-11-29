import React, { useCallback } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom";

import { AppContext } from '../contexts/AppContext';

import updateFieldSetter from "../utils/updateFormFieldSetter";
import * as apiAuth from "../utils/ApiAuth";

function Login({ onFail, onSuccess }) {
  const { isLogged } = useContext(AppContext);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const [mailInput, setMailInput] = useState('');
  const [passwordInput, setPasswrodInput] = useState('');

  const fieldSetters = {
    'mail': setMailInput,
    'password': setPasswrodInput
  }

  const handleInputChange = useCallback((e) => {
    updateFieldSetter(fieldSetters, e.target.name, e.target.value);
  }, [fieldSetters]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    setIsSubmittingForm(true);

    apiAuth.authorization(mailInput, passwordInput)
      .then(() => {
        // onSuccess();
      })
      .catch(errorMsg => {
        onFail(errorMsg);
        setIsSubmittingForm(false);
        console.log(errorMsg);
      });

  }, [mailInput, onFail, onSuccess, passwordInput]);

  return isLogged ?
    (<Redirect to="/" />) :
    (<section className="section section-sign" >
      <h2 className="section-sign__title">Вход</h2>
      <form name="signin" className="section-sign__form" onSubmit={handleSubmit}>
        <input name="mail" type="email" required className="section-sign__input" placeholder="Email" value={mailInput} onChange={handleInputChange} />
        <input name="password" type="password" required className="section-sign__input" placeholder="Пароль" value={passwordInput} onChange={handleInputChange} />
        <button type="submit" className="section-sign__submit" disabled={isSubmittingForm}>
          {isSubmittingForm ? 'В процессе...' : 'Войти'}
        </button>
      </form>
    </section>);
}

export default Login;
