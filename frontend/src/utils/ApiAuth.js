import parseErrorMessage from "./parseErrorMessage";

export const BASE_URL = 'https://supermesto.nomoredomains.club';
export const BASE_HEADERS = {
  'Content-Type': 'application/json',
}

/**
 * Makes fetch request to API
 * @param {String} endpoint AuthAPI endpoint
 * @param {String} method
 * @param {Object} body
 * @param {Object} headers
 * @returns {Promise}
 */
const fetchAuthApi = async (endpoint, method, body = null, headers = BASE_HEADERS, credentials = 'same-origin') => {
  const config = { method, headers, credentials };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return await fetch(`${BASE_URL}/${endpoint}`, config);
}

// register
export const register = async (email, password) => {
  const res = await fetchAuthApi('signup', 'post', { password, email });

  if (res.status === 201) {
    return res.json();
  }

  const errorMessage = await parseErrorMessage(res, 'error');
  return Promise.reject(errorMessage);
}

// authorization
export const authorization = async (email, password) => {
  const res = await fetchAuthApi('signin', 'post', { password, email },
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "withCredentials": true,
    },
    'include'
  );

  if (res.status === 200) {
    const data = await res.json();

    return data.message;
  }

  const errorMessage = await parseErrorMessage(res, 'message');
  return Promise.reject(errorMessage);
}

// logout
export const logout = async () => {
  const res = await fetchAuthApi('signout', 'get', null,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "withCredentials": true,
    },
    'include');

  return await res.json();
}
