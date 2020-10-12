import * as gist from "../api/gist.js";

export let CONFIG = {
  searchURL: "https://duckduckgo.com/?q=",
  prefix: false,
  search_prefix: "-",
  links: [],
  bookmarks: [],
  newtab: true,
  gistID: "9501ef7327224738d0bf050c1eb604a0",
  auth_token: "",
};

export async function get() {
  const json = await gist.get(CONFIG.gistID);
  return JSON.parse(json.files[Object.keys(json.files)[0]].content);
}

export async function update() {
  if (!CONFIG.auth_token) {
    throw new Error("Github auth token is needed");
  }

  const files = {
    "config.json": {
      content: JSON.stringify(CONFIG),
    },
  };

  if (CONFIG.gistID) {
    await gist.patch(files, CONFIG.gistID, auth_token);
  } else {
    const json = await gist.post(files, "Startpage config", false, auth_token);
    CONFIG.gistID = json.id;
  }
}

export async function load() {
  if (CONFIG.gistID != "") {
    CONFIG = await get();
  } else if (Storage) {
    if (localStorage.getItem("config") === null) {
      localStorage.setItem("config", JSON.stringify(CONFIG));
    } else {
      CONFIG = JSON.parse(localStorage.getItem("config"));
    }
  }
}

export async function save() {
  localStorage.setItem("config", JSON.stringify(CONFIG));
  if (CONFIG.auth_token) {
    await update();
  }
}
