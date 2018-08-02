export const addIfNotExist = (receiver, addition) => {
  if (receiver.includes(addition)) {
    return [].concat(receiver);
  }
  return receiver.concat(addition);
};

// make array with unique values from 2 arrays
// values from second array added to the end of created array
export const makeUnion = (initial, additional) => (
  additional.reduce((acc, item) => (
    initial.includes(item) ? acc : acc.concat(item)
  ), [...initial])
);
