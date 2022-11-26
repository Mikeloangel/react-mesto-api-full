/**
 * Parses error message from fetch responce
 * @param {*} responce
 * @param {String} dataField object selector from JSON (i. e. error, messagem etc)
 * @returns {String} message
 */
async function parseErrorMessage(responce, dataField = 'message') {
  const isJSON = responce.headers.get('content-type')?.includes('application/json');
  const data = isJSON ? await responce.json() : null;
  const errorMessage = (data && data[dataField]) || responce.status;
  return errorMessage;
}

export default parseErrorMessage;
