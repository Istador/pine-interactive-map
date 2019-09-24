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

like_they_are='alpafant|beagalite|bleeker|carrant|chest|dullrock|fatplant|idea|lunarodos|mudbeet|nuctus|obergine|puffle|sandstone|solfodil|spystal|tingflower|toothstone|waddletooth'

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
      -e 's/\| Bone \|/| [[Crassbone]] |/g'                          \
      -e 's/\| DouglasCone \|/| [[Grandcone]] |/g'                   \
      -e 's/\| DuneRice \|/| [[Dunerice]] |/g'                       \
      -e 's/\| food \|/| [[Category:Food|Food]] |/g'                 \
      -e 's/\| Iron \|/| [[Lean-Iron]] |/g'                          \
      -e 's/\| material \|/| [[Category:Material|Material]] |/g'     \
      -e 's/\| Pearl \|/| [[Slick Pearl]] |/g'                       \
      -e 's/\| Redberry \|/| [[Roseberry]] |/g'                      \
      -e 's/\| SmallYam \|/| [[Meageryam]] |/g'                      \
      -e 's/\| WedgewoodMoss \|/| [[Gravel Moss]] |/g'               \
      -e 's/\| Wheat \|/| [[Commonwheat]] |/g'                       \
      -e 's/\| Wood \|/| [[Marrwood]] |/g'                           \
      -e 's/\| NewHome \|/| RemoteSwamps |/g'                        \
      -e 's/\| ([A-Z][a-z]+)(([A-Z][a-z]+)+) \|/| [[\1\2]] |/g'      \
      -e 's/\| ([A-Z][a-z]+)((_[A-Z][a-z]+)+) \|/| [[\1\2]] |/g'     \
      -e 's/([a-z])([A-Z])/\1 \2/g'                                  \
      -e 's/([a-z])_([A-Z])/\1 \2/g'                                 \
      -e 's/^/|-\n| /'                                               \
      "$file"                                                        \
    | tail -n+3 >"$out"                                              \
  ;
done < <(                       \
  find . -type f -name "*.csv"  \
)
