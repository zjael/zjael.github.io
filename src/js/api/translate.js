export default async function translate(source, target, query) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURI(query)}`;
  return fetch(url)
    .then(res => res.json())
    .then(json => json[0][0][0])
}