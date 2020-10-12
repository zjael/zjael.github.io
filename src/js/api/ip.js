export async function publicIP() {
  const endpoints = [
    "https://api64.ipify.org?format=json",
    "https://ip.seeip.org/json"
  ]

  for(const i in endpoints) {
    try {
      const json = await fetch(endpoints[i]).then(res => res.json());
      console.log(json)
      return json.ip;
    } catch (err) {
      if(i == endpoints.length - 1) {
        throw err;
      }
    }
  }
}