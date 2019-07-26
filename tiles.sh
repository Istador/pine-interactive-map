#!/bin/bash
set  -e
curl  https://raw.githubusercontent.com/commenthol/gdal2tiles-leaflet/master/gdal2tiles-multiprocess.py  >gdal2tiles.py
chmod  +x  ./gdal2tiles.py
# zoom:  256² = 0,  512² = 0-1,  1024² = 0-2,  2048² = 0-3,  4096² = 0-4,  8192² = 0-5,  16384² = 0-6
./gdal2tiles.py  -l  -p raster  -r lanczos  --zoom='0-4'  -w none  map.png  .
rm  *.xml  */*/*.xml
