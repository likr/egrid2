const formatDate = (date) => {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export default formatDate
