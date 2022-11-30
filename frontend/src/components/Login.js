import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { AppContext } from '../contexts/AppContext';

import * as apiAuth from "../utils/ApiAuth";

function Login({ onFail, onSuccess }) {
  const { isLogged } = useContext(AppContext);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  // formik form validation logics
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

      apiAuth.authorization(values.mail, values.password)
        .then(() => {
          onSuccess();
        })
        .catch(errorMsg => {
          onFail(errorMsg);
          setIsSubmittingForm(false);
          console.log(errorMsg);
        });

    }
  });

  return isLogged ?
    (<Redirect to="/" />) :
    (<section className="section section-sign" >
      <h2 className="section-sign__title">Вход</h2>
      <form
        name="signin"
        className="section-sign__form"
        onSubmit={formik.handleSubmit}
      >

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
          {isSubmittingForm ? 'В процессе...' : 'Войти'}
        </button>

      </form>
    </section>);
}

export default Login;
