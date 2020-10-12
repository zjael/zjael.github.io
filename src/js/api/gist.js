export async function get(gistID) {
  const url = "https://api.github.com/gists/" + gistID;
  return fetch(url)
    .then((res) => res.json())
    .catch((err) => false);
}

export async function post(files = {}, description = "", pub = false, auth_token) {
  const url = "https://api.github.com/gists" + "?access_token=" + auth_token;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      description: description,
      public: pub,
      files: files,
    }),
  }).then((res) => {
    if (res.status === 201) {
      return true;
    }
    return false;
  })
}

export async function patch(files={}, gistID, auth_token) {
   const url = "https://api.github.com/gists/" + gistID + "?access_token=" + auth_token;
   return fetch(url, {
    method: "PATCH",
    body: JSON.stringify({
      files: files
    }),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    }
    return false;
  })
}