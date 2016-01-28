const formatDate = (date) => {
  if (!date) {
    return '';
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

export default formatDate
