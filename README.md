# [Startpage](https://zjael.github.io)

A ```minimalistic homepage```, inspired by the command line interface, mainly controlled by the text input given, with various built-in links and commands with auto complete on top off that.

## Usage

Type the first few letters of a link, command or search request into the input field, and the website will respond with a autocomplete suggestion.
Press TAB anytime to assign the suggestion to the input, once a link, command or search request has been fully typed press ENTER to process it.

## Todo

* [x] Npm init
* [x] Add bundling
  * [x] JS
  * [ ] SCSS

* [x] Refactor commands

* [ ] Add "Help" with "?" icon Button
  * [ ] Display tips and commands
* [ ] Add "Settings" with cogwheel Button
  * [ ] Open menu to configure config, add/remove links

* [ ] Showcase functions and commands
  * [ ] "?" Button opens menu
  * [ ] Typing "help" into input opens menu
  * [ ] Ability to search if list gets too big

* [ ] Add toggle button to switch between target="_self", target="_blank"
* [ ] CTRL/SHIFT + backspace removes 1 whole word at a time

## Stretch

* [ ] Make mobile friendly

* [ ] Rework search queries like "reddit, amazon" to config
  * [ ] Add command to add queries like links - {name} {url} {search_query}

* [ ] Add simple task list function - using markdown syntax - https://gist.github.com/labnol/8e1cdf64cd7b0c1a811e
  * [ ] Add/remove using task list
  * [ ] Add/remove using terminal

* [ ] Add bookmarks function
  * [ ] Add/remove using settings menu
  * [ ] Add/remove using terminal
  * [ ] Searchable by terminal

* [ ] Show multiple suggestions
  * [ ] Pick using arrow keys
  * [ ] Using using Shift+A-D
  * [ ] Keep suggestions when switching between
  * [ ] Pressing tab autocomplete the middle one, which is the highest prioity one

* [ ] Autocomplete on commands - ex. cc d -> DKK
* [ ] Up/Down arrows for history of previous commands
* [ ] If search result from stackoverflow, wikipedia or similar site display information directly in output field
* [ ] Pi-hole, OpenVPN, DNS-Crypt status
* [ ] Weather data
  * [ ] On click show weekly forecast
* [ ] RSS-Reader

### Credits & Inspiration

[KorySchenider/Tab](https://github.com/KorySchneider/tab)
[cadejscroggins/tilde](https://github.com/cadejscroggins/tilde)