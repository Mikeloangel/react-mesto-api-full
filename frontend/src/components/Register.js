import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";

import { useFormik } from "formik";
import * as Yup from 'yup';

import { AppContext } from '../contexts/AppContext';

import * as apiAuth from '../utils/ApiAuth';

function Register({ onFail, onSuccess }) {
  const { isLogged } = useContext(AppContext);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // formik validation logics
  const formik = useFormik({
    initialValues: {
      mail: '',
      password: '',
    },
    validationSchema: Yup.object({
      mail: Yup.string().email('Должен быть правильный адрес почты').required('Электропочта обязательна'),
      password: Yup.string().required('Пароль – обязательное поле'),
    }),
    onSubmit: (values) => {
      setIsSubmittingForm(true);
      apiAuth.register(values.mail, values.password)
        .then(data => {
          onSuccess(data);
        })
        .catch(data => {
          onFail(data);
          setIsSubmittingForm(false);
        })

    }
  });

  return isLogged ?
    (<Redirect to="/" />) :
    (<section className="section section-sign">
      <h2 className="section-sign__title">Регистрация</h2>
      <form name="signup" className="section-sign__form" onSubmit={formik.handleSubmit}>

        <input
          name="mail"
          type="email"
          required
          className={`section-sign__input ${formik.touched.mail && formik.errors.mail && 'section-sign__input_error'}`}
          placeholder="Email"
          value={formik.values.mail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <p className="section-sign__form-error">{formik.touched.mail && formik.errors.mail}</p>

        <input
          name="password"
          type="password"
          required
          className={`section-sign__input ${formik.touched.password && formik.errors.password && 'section-sign__input_error'}`}
          placeholder="Пароль"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <p className="section-sign__form-error">{formik.touched.password && formik.errors.password}</p>

        <button type="submit" className="section-sign__submit" disabled={!formik.isValid || isSubmittingForm}>
          {isSubmittingForm ? 'В процессе...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="section-sign__paragraph">
        Уже зарегистрированы? <Link to="/sign-in" className="section-sign__link">Войти</Link>
      </p>
    </section>);
}

export default Register;
