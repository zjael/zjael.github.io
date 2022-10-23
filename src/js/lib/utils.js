export function buildURL(url, search='', query='') {
  const dest = (/(http(s)?:\/\/.)/.test(url))
    ? url
    : 'https://' + url;
  return dest + search + encodeURIComponent(query);
}

export function redirect(url) {
  window.location.href = url;
}

export function isURL(str) {
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(str);
}

export function isNumeric(num){
  return !isNaN(num)
}

export function toFixed(value, precision) {
  const power = Math.pow(10, precision || 0);
  return String(Math.round(value * power) / power);
};