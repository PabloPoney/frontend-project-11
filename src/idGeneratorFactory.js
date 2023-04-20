export default (counter) => {
  let id = counter;
  return () => {
    id -= 1;
    return id;
  };
};
