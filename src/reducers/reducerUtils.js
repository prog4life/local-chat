export const addIfNotExist = (receiver, addition) => {
  if (!Array.isArray(receiver)) {
    throw new TypeError('Expected 1st argument to be array');
  }
  if (receiver.includes(addition)) {
    return [].concat(receiver);
  }
  return receiver.concat(addition);
};

// make array with unique values from 2 arrays
// values from second array added to the end of created array
export const makeUnion = (initial, additional) => {
  if (!Array.isArray(initial) || !Array.isArray(additional)) {
    throw new TypeError('Both arguments must be arrays');
  }
  return additional.reduce((acc, item) => (
    initial.includes(item) ? acc : acc.concat(item)
  ), [...initial]);
};

export const setErrorValue = (state, key, error) => {
  const value = error
    ? { code: error.code || null, message: error.message || null }
    : null;

  if (typeof key !== 'string') {
    throw new TypeError('Expected error key (2nd argument) to be string');
  }
  return { ...state, [key]: value };
};
