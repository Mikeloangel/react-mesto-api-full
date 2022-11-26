import parseErrorMessage from "./parseErrorMessage";

export const BASE_URL = 'https://auth.nomoreparties.co';

/**
 * Makes fetch request to API
 * @param {String} endpoint AuthAPI endpoint
 * @param {String} method
 * @param {Object} body
 * @param {Object} headers
 * @returns {Promise}
 */
const fetchAuthApi = async (endpoint, method, body = null, headers = { 'Content-Type': 'application/json' }) => {
  const config = {method, headers};

  if (body) {
    config.body = JSON.stringify(body);
  }

  return await fetch(`${BASE_URL}/${endpoint}`, config);
}


export const register = async (email, password) => {
  const res = await fetchAuthApi('signup', 'post', { password, email });

  if (res.status === 201) {
    return res.json();
  }

  const errorMessage = await parseErrorMessage(res, 'error');
  return Promise.reject(errorMessage);
}

export const authorization = async (email, password) => {
  const res = await fetchAuthApi('signin', 'post', { password, email });

  if (res.status === 200) {
    const data = await res.json();
    return data.token;
  }

  const errorMessage = await parseErrorMessage(res, 'message');
  return Promise.reject(errorMessage);
}

export const checkToken = async (token) => {
  const res = await fetchAuthApi('users/me', 'get', null,
    {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

  if (res.status === 200) {
    const userData = await res.json();
    return userData.data;
  }

  const errorMessage = await parseErrorMessage(res, 'message');
  return Promise.reject(errorMessage);
}

export const forgetToken = (tokenFieldName = 'token') => {
  localStorage.removeItem(tokenFieldName);
}
