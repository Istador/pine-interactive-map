#!/bin/bash

if [ $# != '1' ] || [ "$1" == '--help' ] ; then
  echo "usage:  wikify.sh <version>"
  exit 1
fi

DIR="`dirname \"$(readlink -f \"$0\")\"`"
VERSION="$1"

PRETTY="$DIR/pretty/$VERSION"
WIKI="$DIR/wiki/$VERSION"

mkdir -p "$WIKI"

cd "$PRETTY"

like_they_are='alpafant|beagalite|bleeker|bleeker_antenna|carrant|chest|dullrock|fatplant|idea|lunarodos|mudbeet|nuctus|obergine|puffle|puffle_feather|sandstone|solfodil|spystal|tingflower|toothstone|waddletooth'

while read file ; do
  name="${file:2:-4}"
  out="$WIKI/$name.txt"

  echo "$name"

  sed -E                                                             \
      -e 's/\./;/g'                                                  \
      -e 's/,/ || /g'                                                \
      -e 's/;/,/g'                                                   \
      -e 's/(\|\|[^\|]+)$/||  ||  || game assets \1/'                \
      -e "s/\| ($like_they_are) \|/| [[\1]] |/gi"                    \
      -e 's/\| Alpafant_Leather \|/| [[Alpafant Leather]] |/g'       \
      -e 's/\| Amphiscis_Orb \|/| [[Amphiscis Orb]] |/g'             \
      -e 's/\| AnuraShroom \|/| [[Anura Shroom]] |/g'                \
      -e 's/\| AvianPepper \|/| [[Avian Pepper]] |/g'                \
      -e 's/\| Bleeker_Antenna \|/| [[Bleeker Antenna]] |/g'         \
      -e 's/\| Bone \|/| [[Crassbone]] |/g'                          \
      -e 's/\| DouglasCone \|/| [[Grandcone]] |/g'                   \
      -e 's/\| DryClay \|/| [[Dry Clay]] |/g'                        \
      -e 's/\| DuneRice \|/| [[Dunerice]] |/g'                       \
      -e 's/\| EdenFruit \|/| [[Eden Fruit]] |/g'                    \
      -e 's/\| food \|/| [[Category:Food|Food]] |/g'                 \
      -e 's/\| Iron \|/| [[Lean-Iron]] |/g'                          \
      -e 's/\| KeyGraphite \|/| [[Key Graphite]] |/g'                \
      -e 's/\| material \|/| [[Category:Material|Material]] |/g'     \
      -e 's/\| MorrowHay \|/| [[Morrow Hay]] |/g'                    \
      -e 's/\| Pearl \|/| [[Slick Pearl]] |/g'                       \
      -e 's/\| Puffle_Feather \|/| [[Puffle Feather]] |/g'           \
      -e 's/\| PuffleEgg \|/| [[Puffle Egg]] |/g'                    \
      -e 's/\| Redberry \|/| [[Roseberry]] |/g'                      \
      -e 's/\| RidgeFennel \|/| [[Ridge Fennel]] |/g'                \
      -e 's/\| SmallYam \|/| [[Meageryam]] |/g'                      \
      -e 's/\| TelkinChives \|/| [[Telkin Chives]] |/g'              \
      -e 's/\| WaddletoothBlubber \|/| [[Waddletooth Blubber]] |/g'  \
      -e 's/\| WedgewoodMoss \|/| [[Gravel Moss]] |/g'               \
      -e 's/\| Wheat \|/| [[Commonwheat]] |/g'                       \
      -e 's/\| Wood \|/| [[Marrwood]] |/g'                           \
      -e 's/^/|-\n| /'                                               \
      "$file"                                                        \
    | tail -n+3 >"$out"                                              \
  ;
done < <(                       \
  find . -type f -name "*.csv"  \
)
