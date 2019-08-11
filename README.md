## Pine Interactive Map

This project aims to provide a usable interactive map for the video game Pine by Twirlbound.


### Set up the project for local development

```bash
# fetch this repository
git  clone  --single-branch  -b public  https://github.com/Istador/pine-interactive-map.git
cd  ./pine-interactive-map/

# set up the `tiles` and `img` submodule directories
git  submodule  update  --init

# create .env file
SPREADSHEET_ID='<paste the spreadsheet id here>'
sed  -e s/"github"/"local"/  -e s/SPREADSHEET_ID/$SPREADSHEET_ID/g  .env.example  >.env

# install dependencies
npm  install

# build the application
npm  run  build
```
