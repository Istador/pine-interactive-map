## Pine Interactive Map

This project aims to provide a usable interactive map for the video game [Pine](https://pine-game.com/) by [Twirlbound](https://twirlbound.com/).

https://pine.blackpinguin.de/


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
