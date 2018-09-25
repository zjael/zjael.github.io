# [Startpage](https://github.com/zjael/zjael.github.io)
A ```minimalistic homepage```, inspired by the command line interface, mainly controlled by the text input given, with various built-in links and commands with auto complete on top off that.

## Usage
Type the first few letters of a link, command or search request into the input field, and the website will respond with a autocomplete suggestion.
Press TAB anytime to assign the suggestion to the input, once a link, command or search request has been fully typed press ENTER to process it.

Recommended method is to host your own fork of this repo, containing your own personal gistID, that way you can access your config from any device.
But to edit or add to the config, you will need github auth_token setup.

## Commands

### Config
`set {object} {value}`  
`alias: 's'`
`objects: 'auth_token', 'gistid'`
- **object** - desired object.
- **value** - value to assign `object`. 

### Link
`add {name} {url}`  
`alias: 'a'`
- **name** - which the search suggestion will utilize.
- **url** - that will be redirected too upon entered.

`delete {name}`  
`alias: 'del, d'`
- **name** - name of link, that will be deleted.

### Calculator
`calc {calculation}`  
- **calculation** - calculation for the calculator to calculate.

### Credits & Inspiration
https://github.com/dope/startpage  
https://github.com/KorySchneider/tab/  
https://github.com/cadejscroggins/tilde  