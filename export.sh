#!/bin/bash

if [ $# != '1' ] ; then
  echo "usage:  export.sh <item_name>"
  exit 1
fi

SEARCH="$1"

VERSION="beta_1"
GAME="$USERPROFILE\\AppData\\Local\\Kartridge.kongregate.com\\games\\309550"
SHAREDASSETS="$GAME\\Pine_Data\\StreamingAssets\\bundles"

DIR="`dirname \"$(readlink -f \"$0\")\"`"
ASSETS="$DIR/assets_$VERSION/"
OBJECTS="$DIR/gameobjects/"
TRANSF="$DIR/transforms/"
SELECTION="$DIR/selectedassets/"


function pathy {
  cygpath "$1"
}

function clear {
  rm -rf "$1"
  mkdir -p "$1"
}


# check that the assets exist
n_assets=""
if ! [ -d "$ASSETS" ] || [ "$(ls "$ASSETS" | wc -l)" -lt "1" ]; then
  # prepare batchexport.bat
  echo "+DIR $SHAREDASSETS\\" | unix2dos  > "$DIR/batchexport.bat"
  export SHAREDASSETS
  ls "$SHAREDASSETS" | grep -E "\.manifest$" | awk '{ print "-FILE " ENVIRON["SHAREDASSETS"] "\\" $1 }' | unix2dos >> "$DIR/batchexport.bat"
  mkdir -p "$ASSETS"

  # inform the user
  echo "Empty directory '$ASSETS' found"
  echo ""
  echo "Please decompress all assets first by executing:"
  echo "- AssetBundleExtractor.exe -fd batchexport $DIR/batchexport.bat"
  echo "- mv `pathy $SHAREDASSETS`/*.assets `pathy $ASSETS`"
  exit 1
fi
rm -rf "$DIR/batchexport.bat"


# find compressed assets file names
function bundles {
  local type="$1"
  grep -n "/$type/model_bnd" *.manifest | grep -v 'bundles.manifest'| grep -Eo "^[^.]+" | sed '/^$/d' | sort | uniq
}
cd "$SHAREDASSETS"
types=($(grep -n "/[^/]*$SEARCH[^/]*/model_bnd" *.manifest | grep -v 'bundles.manifest' | grep -Eo "/[^/]*$SEARCH[^/]*/model_bnd" | awk --field-separator='/' '{ print $2 }' | sed '/^$/d' | sort | uniq))
n="${#types[@]}"
# nothing found
if [ "$n" == "0" ] ; then
  echo "nothing found"
  exit 1
# one thing found
elif [ "$n" == 1 ] ; then
  type="${types[0]}"
  BUNDLES="$(bundles "$type")"
  n="$(echo "$BUNDLES" | wc -l)"
  echo "I found '$type' in $n compressed asset files. Is this correct?"
  while
     printf '[Y]es or [N]o? ' || exit
     read answer
  do
    case "$answer" in
      [yY][eE][sS] | [yY])
        echo ''
        break
      ;;
      [nN][oO] | [nN])
        exit 1
      ;;
      *)
      ;;
    esac
  done
# more than one thing found
else
  echo "I found the following $n things:"
  for i in "${!types[@]}" ; do
    type="${types[$i]}"
    m="$(bundles "$type" | wc -l)"
    echo "$(($i + 1)).) $type in $m compressed asset files"
  done
  while
     printf "Select [1-$n]: " || exit
     read answer
  do
    if [[ "$answer" -ge "1" ]] && [[ "$answer" -le "$n" ]] ; then
      i=$(($answer - 1))
      type="${types[$i]}"
      BUNDLES="$(bundles "$type")"
      break
    fi
  done
fi


# copy assets that we are interested in into a temporary folder
echo "Copy assets into temporary folder..."
clear "$SELECTION"
cd "$ASSETS"
ls -la | grep -E "($(echo "$BUNDLES" | tr '\n' '|' | sed 's/.$//'))" | grep -oE ' [^ ]+\.assets' | grep -oE '[^ ]+' | while read -r f; do
  cp "$f" "$SELECTION"
  #echo -n ""
done
echo ""


# manual extraction by the user
clear "$OBJECTS"
clear "$TRANSF"
n="$(ls "$SELECTION" | wc -l)"
echo "Please open all $n files inside '$SELECTION' in UABE"
echo ""
echo "Then export the Game Objects you are interested as JSON into:"
echo "- '$OBJECTS'"
echo ""
echo "Then export >>>ALL<<< Transforms as JSON into:"
echo "- '$TRANSF'"
echo ""
echo "Press any key after you have extracted everything or CTRL+C to abort."
read -n 1 -s


# Find GameObject IDs (unsigned int64 -> signed int64)
echo "Searching for Game Object IDs..."
cd "$OBJECTS"
OBJECTIDS="$(ls | grep -Eo 'assets\-[0-9]+\-GameObject.json' | grep -Eo '[0-9]+' | awk -M '$1>=2^63{$1-=2^64}1' | tr '\n' '|' | sed 's/.$//')"


# print the coordinates
echo "Extracting coordinates..."
cd "$TRANSF"
export type
COORDS="$(
  grep "0 SInt64 m_PathID" . -R -m1  \
  | dos2unix  \
  | grep -E ": ($OBJECTIDS)"  \
  | grep -Eio "^[a-z0-9 _\./\-]+.json"  \
  | while read -r f; do  \
    jq '.["0 Transform Base"]["0 Vector3f m_LocalPosition"] | (.["0 float x"]|tostring) + ";" + (.["0 float z"]|tostring) + ";" + (.["0 float y"]|tostring)' "$f"  \
    | grep -Eo '[^"]+'  \
    | grep -v '^[[:space:]]*$'  \
    | sed 's/\./,/g'  \
    | awk 'BEGIN{ id=ARGV[1] ; ARGV[1]="" } { print $1 ";" id }' "$(grep "0 SInt64 m_PathID" "$f" -R -m1 | dos2unix | grep -Eo ": \-?[0-9]+" | grep -Eo "\-?[0-9]+")" \
  ; done  \
  | sort -h \
  | awk --field-separator=';' '{ print $4 ";" ENVIRON["type"] ";" $1 ";" $3 ";" $2 }'
)"
echo 'id;item;x;y;z' > "$DIR/raw/$VERSION/$type.csv"
echo "$COORDS" >> "$DIR/raw/$VERSION/$type.csv"
n="$(echo "$COORDS" | wc -l)"
echo ""
echo "These are the found $n coordinates:"
echo ""
echo "$COORDS"
