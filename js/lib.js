function buildURL(url, search='', query='') {
    let dest = (/(http(s)?:\/\/.)/.test(url))
      ? url
      : 'https://' + url;
    return dest + search + encodeURIComponent(query);
}

function redirect(url) {
    window.location.href = url;
}

function isURL(str) {
    var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return regex.test(str);
}

function isNumeric(num){
    return !isNaN(num)
}

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
};