const partial = (f, ...args) => {
  return f.bind(null, ...args);
};

export default partial
