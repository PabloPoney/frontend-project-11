export const idGeneratorFactory = (counter) => {
  let id = counter;
  return () => {
    return id--;
  };
};
