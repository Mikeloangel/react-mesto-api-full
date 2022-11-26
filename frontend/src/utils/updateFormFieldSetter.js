/**
 *  updates value of setters object for key and value
 *
 * @param {Object} settersObject pairs key to setter function
 * @param {String} key key to update
 * @param {String} value new value
 */
export default function updateFieldSetter(settersObject, key, value) {
  if (settersObject[key] && typeof settersObject[key] === 'function') {
    settersObject[key](value);
  }
}
