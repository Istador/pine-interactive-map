## Pine Interactive Map

This project aims to provide a usable interactive map for the video game [Pine](https://pine-game.com/) by [Twirlbound](https://twirlbound.com/).

If you're just looking for the Pine map, it's hosted here:

https://pine.blackpinguin.de/

### Where's the user data stored?

The user data consists of:
- entries marked as completed
- selected layers
- selected language
- selected styling for completed and unchecked entries
- selected version (`Version 1.0`, `Beta 2`, `Beta 1`)

It's saved in the browser's `localStorage` and never leaves the user's computer. It isn't stored on any server or transmitted over the internet. It might be tempting to know what people use the map for, but that'd hurt performance, overcomplicate things, and would likely not be GDPR compliant without a formal consent (annoying cookie popup).

Keeping a backup of the data is the responsibility of the user. Depending on the settings of the browser, it might be necessary to allow the website to save cookies (it doesn't send any cookies), in order of it not throwing away the `localStorage` after the current browser session.

#### Reset all data

If you wish to reset all of the user data saved, just type the following into the console opened for the map (F12):
```
localStorage.clear()
```

### How to link to the Map?

The map has 6 parameters, that can be given to the hash portion of the URL (meaning that they aren't send to the server, but are only evaluated by the browser):
- `id`: integer, map-internal ID for every entry on the map. Permalinks can be found in the popups.
- `area`: integer, map-internal ID for every area of the game. Permalinks can be found in the popups.
- `x` and `z`: float, in-game coordinates that the map shall highlight (draws a circle around).
- `layers`: comma separated string of layers that should be pre-selected. Examples:
  - [#layers=](https://pine.blackpinguin.de/#layers=) select no layers.
  - [#layers=unique.amphiscusorb](https://pine.blackpinguin.de/#layers=unique.amphiscusorb) select one specific layer.
  - [#layers=material.beagalite,material.spystal](https://pine.blackpinguin.de/#layers=material.beagalite,material.spystal) select two specific layers at once.
  - [#layers=food](https://pine.blackpinguin.de/#layers=food) select all layers of a category.
  - Note: using `id` or `area` always selects the layer of that entry additionally.
- `zoom`: integer, from 0 (far away) to 5 (near).

Most of them can be combined, but `id`, `area` and `x` with `z` cancel each other out.
Example:
https://pine.blackpinguin.de/#id=42&layers=&zoom=3

### Set up the project for local development

```bash
# fetch this repository
git  clone  --single-branch  -b public  https://github.com/Istador/pine-interactive-map.git
cd  ./pine-interactive-map/

# set up the `tiles` and `img` submodule directories
git  submodule  update  --init

# create .env file
cp  .env.example  .env

# install dependencies
npm  install

# build the application
npm  run  build
```
