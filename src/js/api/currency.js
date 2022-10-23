export async function currency(base) {
  const timestamp = Date.now();
  const currencies = JSON.parse(localStorage.getItem("currencies")) || {};

  if (!currencies[base] || timestamp - 1 * 60 * 60 * 1000 > currencies[base].timestamp) {
    const url = "https://api.exchangeratesapi.io/latest?base=" + base;
    const json = await fetch(url).then((res) => res.json());

    json.timestamp = timestamp;
    currencies[base] = json;
    localStorage.setItem("currencies", JSON.stringify(currencies));
  }

  return currencies[base];
}

export async function convert(from, to, value) {
  if(value <= 0) {
    throw new Error("Invalid value");
  }

  const { rates } = await currency(from);
  const rate = rates[to];
  if(!rate) {
    throw new Error("Can't convert to: " + to);
  }

  return rate * value;
}