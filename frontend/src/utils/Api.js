class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _getJSON(res) {
    if (res.ok) return res.json();

    //getting proper error message from JSON response {'message':''}
    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const data = isJSON ? await res.json() : null;
    const error = (data && data.message) || res.status;

    return Promise.reject(error);
  }

  _getRouteRequest(route, method, body = null) {
    return body ?
      fetch(`${this._baseUrl}${route}`, { method, headers: this._headers, body: JSON.stringify(body),  credentials: 'include' })
        .then(this._getJSON) :
      fetch(`${this._baseUrl}${route}`, { method, headers: this._headers, credentials: 'include' })
        .then(this._getJSON);

  }

  handleError(response, cb = null) {
    console.error(`Api error: ${response}`);
    if (typeof cb === 'function') cb(response)
  }

  //API ROUTES

  /**
   *
   * @returns on succes parsed JSON with array of cards {createdAt, likes, link, name, owner, _id
   *
   */
  getInitialCards = () => this._getRouteRequest('/cards', 'GET');

  /**
   *
   * @returns on succes parsed JSON with {about,avatar,cohort,name, _id}
   */
  getUserMe = () => this._getRouteRequest('/users/me', 'GET');

  /**
   *
   * @param {Object} body {name, about}
   * @returns on succes parsed JSON with updated user {about,avatar,cohort,name, _id}
   */
  pathchUserMe = body => this._getRouteRequest('/users/me', 'PATCH', body);

  /**
   *
   * @param {Object} body {link,name}
   * @returns on success parsed JSON with new card {createdAt, likes, link, name, owner, _id
   */
  postCard = body => this._getRouteRequest('/cards', 'POST', body);

  /**
   *
   * @param {String} id card id
   * @returns on succes parsed JSON with message {message:'Пост удален'}
   */
  deleteCard = id => this._getRouteRequest(`/cards/${id}`, 'DELETE');

  /**
   *
   * @param {String} id card id
   * @returns on succes parsed JSON with updated card {createdAt, likes, link, name, owner, _id
   */
  putLike = id => this._getRouteRequest(`/cards/${id}/likes`, 'PUT');

  /**
   *
   * @param {String} id card id
   * @returns on succes parsed JSON with updated card {createdAt, likes, link, name, owner, _id
   */
  deleteLike = id => this._getRouteRequest(`/cards/${id}/likes`, 'DELETE');

  /**
   *
   * @param {String} url valid link
   * @returns on success parsed JSON with current user {about,avatar,cohort,name, _id}
   */
  patchUserAvatar = url => this._getRouteRequest(`/users/me/avatar`, 'PATCH', { avatar: url });
}

const api = new Api({
  baseUrl: 'https://supermesto.nomoredomains.club',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
