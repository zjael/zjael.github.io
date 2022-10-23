import { CONFIG } from './config.js';

export const { favicon, search, output, input, caret, query, suggestion, links } = {
  favicon: document.querySelector("link[rel='icon']"),
  search: document.getElementById("search-suggestions"),
  output: document.getElementById("output"),
  input: document.getElementById("input"),
  caret: document.getElementById("caret"),
  query: document.getElementById("query"),
  suggestion: document.getElementById("suggestion"),
  links: document.querySelector(".links")
};

export function clearInput() {
  search.innerHTML = "";
  input.value = "";
  query.textContent = "";
  input.focus();
}

export function clearOutput() {
  suggestion.textContent = "";
  output.textContent = "";
}

export function toggleVisibility(element) {
  if (element.style.visibility == "visible") {
    element.style.visibility = "hidden";
  } else {
    element.style.visibility = "visible";
  }
}

export function toggleLinks() {
  if (links.style.display == "") {
    links.style.display = "block";
  } else {
    links.style.display = "";
  }
}

export function getSelectedText() {
  let text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

export async function createLinks() {
  CONFIG.UIlinks.forEach((object) => {
    let ul = document.getElementById(object.category);
    if (ul) {
      object.links.forEach((link) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.innerText = link.name;
        a.onclick = function () {
          search.innerHTML = "";
          input.value = "";
          input.focus();
        };
        a.href = link.url;
        li.appendChild(a);
        ul.appendChild(li);
      });
    }
  });
}