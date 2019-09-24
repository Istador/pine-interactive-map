#!/bin/bash

if [[ "$1" == '--help' ]] || [[ $# > 1 ]] ; then
  echo "usage:  extract.sh [item_name]"
  exit 1
fi

type="$1"

VERSION="beta_3"
GAME="$USERPROFILE\\AppData\\Local\\Kartridge.kongregate.com\\games\\309550"
SHAREDASSETS="$GAME\\Pine_Data\\StreamingAssets\\bundles"

DIR="`dirname \"$(readlink -f \"$0\")\"`"
ASSETS="$DIR/assets_$VERSION/"
ALL="$DIR/all_$VERSION"
OUTDIR="$DIR/raw/$VERSION"

mkdir -p "$OUTDIR"

function pathy {
  cygpath "$1"
}

declare -A TYPE2ITEMID=()
declare -A ITEMS_FOUND=()


# check that the assets exist
if ! [ -d "$ASSETS" ] || [ "$(ls "$ASSETS" | wc -l)" -lt "1" ] ; then
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

# check that the all directory exist
if ! [ -d "$ALL" ] || [ "$(ls "$ALL" | wc -l)" -lt "1" ] ; then
  mkdir -p "$ALL"

  # inform the user
  echo "Empty directory '$ALL' found"
  echo ""
  echo "Please open the following files at the same time in UABE:"
  export ASSETS
  ls "$ASSETS" | grep -E "(Collectables|Resource|Critters_Layer|BuildPlayer-c[0-9]{2}_|BuildPlayer-V[0-9]{2})" | awk '{ print "- " ENVIRON["ASSETS"] $1 }'
  echo "and manually eport all ('Export Dump'):"
  echo "- MonoBehaviour"
  echo "- GameObject"
  echo "- Transform"
  echo "as JSON ('UABE json dump') into this directory:"
  echo "- $ALL"
  exit 1
fi
rm -rf "$DIR/batchexport.bat"


function pips {
  (([[ $# -gt 0 ]] && echo "$1") || cat)
}

# extracts the path id from the filename
function PathID {
  pips "$@" | grep -Eo "\-[0-9]+\-[a-zA-Z]+.json" | grep -Eo '[0-9]+'
}

# transforms a PathID from Filename => JSON (signed 64-bit int => unsigned 64-bit int)
function toSigned {
  pips "$@" | awk -M '$1>=2^63{$1-=2^64}1'
}
function toUnsigned {
  pips "$@" | awk -M '$1<0{$1+=2^64}1'
}

# extracts the asset name from the filename
function AssetName {
  pips "$@" | sed -E                                   \
    -e 's/^[^-]+\-(.+)\-[0-9]+\-[a-zA-Z]+\.json$/\1/'  \
  ;
}

# extract the item name
function Item {
  pips "$@" | sed -E                                   \
    -e 's/^(Material|Food)Cluster_//'                  \
    -e 's/^KeyGraphite_Cluster_[0-9]+-/KeyGraphite-/'  \
    -e 's/^Pillar_Amphiscis/Amphiscis_Orb/'            \
    -e 's/^Pillar-/Amphiscis_Orb-/'                    \
    -e 's/^Dullrock_Dunes/Dullrock/'                   \
    -e 's/^([a-zA-Z]+)_Spawner( \([0-9]+\))?/\1/'      \
    -e 's/^AlbamareChest/Chest/'                       \
    -e 's/^(MQ035_)?Pickup_?(Idea)[_\-]/\2-/'          \
    -e 's/ \([0-9]+\)\-/\-/'                           \
    -e 's/^([^-]+)-.+$/\1/'                            \
  ;
}

# transforms PathIDs to filenames
function any2unnamed {
  while read id ; do
    local f="unnamed asset-$1-$id-$2.json"
    if [[ -f "$f" ]] ; then
      echo "$f"
    fi
  done
}

# transforms PathIDs to transform filenames
function transf2file {
  any2unnamed "$1" 'Transform'
}

# transforms PathIDs to MonoBehaviour filenames
function mono2file {
  any2unnamed "$1" 'MonoBehaviour'
}

# find the game object file given it's ID
function findGameObject {
  local file=$(find . -name "*\-$2\-$1\-GameObject\.json")
  if [[ "$file" != '' ]] ; then
    echo "${file:2}"
  fi
}
export -f findGameObject

# find the PathID of the transform for the input gameobject file
function transform {
  grep "0 SInt64 m_PathID" "$1" -m1 | grep -Eo ": [0-9]+" | grep -Eo "[0-9]+"
}

# PathID of the gameobject for this transform
function transf2object {
  grep -A 3 '0 PPtr<GameObject> m_GameObject' "$1" | grep -m1 '0 SInt64 m_PathID' | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}
export -f transf2object

# PathID's of the monobehvior for the input gameobject file
function mono {
  grep '0 SInt64 m_PathID' "$1" | tail -n 1 | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}
export -f mono
function monos {
  grep '0 SInt64 m_PathID' "$1" | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}
export -f monos


# singlePickup
function singlePickup {
  local mf=$(\
      grep -A 3 '0 PPtr<$SmartObject_SinglePickupBase> singlePickup' "$1"  \
    | grep -E '0 SInt64 m_PathID'  \
    | grep -Eo ': [0-9]+'          \
    | grep -Eo '[0-9]+'            \
    | mono2file "$2"               \
  )
  if [ "$mf" != ''  ] ; then
    local id=$(stackID "$mf")
    local n=$(stackAmount "$mf")
    echo "$id"
    echo "$n"
  fi
}

# item amount for a mono of an source
function monoAmount {
  grep -A 6 "$2" "$1" | grep -E '0 int (amount|quantity)' | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}
function ingredientAmount {
  monoAmount "$1" '0 ItemIngredient itemIngredient'
}
function stackAmount {
  monoAmount "$1" '0 ItemStack stack'
}

# item id
function monoID {
  grep -A 4 "$2" "$1" | grep '0 int value' | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}
function ingredientID {
  monoID "$1" '0 ItemIngredient itemIngredient'
}
function stackID {
  monoID "$1" '0 ItemStack stack'
}
function triggerID {
  grep -B 1 '0 PPtr<$ItemTrigger> itemTrigger"' "$1" | grep '0 int id' | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}

# PathID's of the parent transform for the input transform file
function father {
  grep -A 3 '0 PPtr<Transform> m_Father' "$1" | grep -m1 '0 SInt64 m_PathID' | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}

# PathIDs of all child transforms for the input transform file
function children {
  grep '0 SInt64 m_PathID' "$1" | tail -n+2 | head -n-1 | grep -Eo ': [0-9]+' | grep -Eo '[0-9]+'
}

# x-y-z-coordinates of the input transform file
function coords {
  jq  '.["0 Transform Base"]["0 Vector3f m_LocalPosition"] | (.["0 float x"]|tostring) + "," + (.["0 float y"]|tostring) + "," + (.["0 float z"]|tostring)'  "$1"  \
    | grep -Eo '[^"]+'  \
    | grep -v '^[[:space:]]*$'  \
  ;
}

# iterate up the tree over all parent transforms, and add their local positions together to calculate the real position of the input transform file
function position {
  local pos=$(coords "$1")
  local parID=$(father "$1")
  local parent=''
  local offset=''
  while [ "$parID" != 0  ] ; do
    parent=$(echo "$parID" | transf2file "$2")
    offset=$(coords "$parent")
    pos=$(add "$pos" "$offset")
    parID=$(father "$parent")
  done
  echo "$pos"
}

# adds two float numbers
function plus {
  echo "$1 $2" | awk '{print ($1+$2)}'
}

# adds two coordinates (3d vector addition)
function add {
  local old="$IFS"
  IFS=","
  local a=($1)
  local b=($2)
  IFS="$old"
  echo "$(plus ${a[0]} ${b[0]}),$(plus ${a[1]} ${b[1]}),$(plus ${a[2]} ${b[2]})"
}



###############################################################################
###############################################################################


# what to do for one gameobject
function gameobject {
  local file="$1"
  local asset="$(AssetName "$file")"
  local item="$(Item "$file")"
  local outfile="$OUTDIR/$item.csv"
  local transf=$(transform "$file" | transf2file "$asset")
  local pos=$(position "$transf" "$asset")
  local n=''
  local item_id="${TYPE2ITEMID[$item]}"
  local type='Unknown'
  local area=''

  # determine Type
  if [[ "$item" == 'Amphiscis_Orb' ]] || [[ "$item" == 'KeyGraphite' ]] || [[ "$item" == 'Idea' ]] || [[ "$item" == 'Chest' ]] ; then
    type='Unique'
  elif [[ "$item" = 'Alpafant' ]] || [[ "$item" = 'Bleeker' ]] || [[ "$item" = 'Puffle' ]] || [[ "$item" = 'Waddletooth' ]] ; then
    type='Spawn'
  elif [[ "$file" =~ ^MaterialCluster_ ]] ; then
    type='Material'
  elif [[ "$file" =~ ^FoodCluster_ ]] ; then
    type='Food'
  fi

  # extract Area from asset filename
  if [[ "$file" =~ _BuildPlayer-[cV][0-9]{2}_ ]] ; then
    area=$(echo $file | sed -E -e 's/.+\_BuildPlayer\-[cV][0-9]{2}\_([^\.]+)\.assets\-[0-9]+\-GameObject\.json$/\1/')
  fi

  # Key Graphite
  if [[ "$item" == 'KeyGraphite' ]] ; then
    n=0
    # for (c <- transf.childs().toFile() ; child <- c.gameobject().toFile())
    while read child ; do
      if [[ `grep 'm_Name": "KeyGraphite_Pickup' "$child" | wc -l` -gt 0 ]] ; then
        while read monof ; do
          local m=$(stackAmount "$monof")
          if [[ "$m" != '' ]] ; then
            (( n += $m ))
            # get the item_id if this is the first of this type
            if [[ "$item_id" == '' ]] ; then
              item_id=$(stackID "$monof")
              TYPE2ITEMID["$item"]=$item_id
            fi
            break
          fi
        done < <(monos "$child" | mono2file "$asset")
      fi
    done < <(                                                \
      children "$transf"                                     \
      | transf2file "$asset"                                 \
      | xargs -i bash -c 'transf2object "{}"'                \
      | xargs -i bash -c "findGameObject \"{}\" \"$asset\""  \
    )
    if [[ $n < 1 ]] ; then
      return
    fi
  fi

  # Amphiscis_Orb
  if [[ "$item" == 'Amphiscis_Orb' ]] ; then
    n=0
    # for (monof <- file.findMono().toFile())
    while read monof ; do
      local sp=($(singlePickup "$monof" "$asset"))
      if [[ "$sp" != '' ]] && [[ "${sp[1]}" > 0 ]] ; then
        (( n += ${sp[1]} ))

        # get the item_id if this is the first of this type
        if [[ "$item_id" == '' ]] ; then
          item_id=${sp[0]}
          TYPE2ITEMID["$item"]=$item_id
        fi
      fi
    done < <(mono "$file" | mono2file "$asset")

    if [[ $n < 1 ]] ; then
      return
    elif [[ $n < 2 ]] ; then
      n=''
    fi
  fi

  # Idea & Chests
  ###   TODO: filter out Ideas that are inside of chests
  ###   TODO: fix ID finding - seem to contain duplicate IDs
  #if [[ "$item" == 'Idea' ]] || [[ "$item" == 'Chest' ]] ; then
  #  # for (monof <- file.findMonos().toFile())
  #  while read monof ; do
  #    if [[ "$item" == 'Idea' ]] ; then
  #      local sid=$(stackID "$monof")
  #      if [[ "$sid" != '' ]] ; then
  #        item_id=$sid
  #        break
  #      fi
  #      local sp=($(singlePickup "$monof" "$asset"))
  #      if [[ "$sp" != '' ]] ; then
  #        item_id=${sp[0]}
  #        break
  #      fi
  #    else
  #      local tid=$(triggerID "$monof")
  #      if [[ "$tid" != '' ]] ; then
  #        item_id=$tid
  #        break
  #      fi
  #    fi
  #  done < <(monos "$file" | mono2file "$asset")
  #  if [[ "$item_id" == '' ]] ; then
  #    return
  #  fi
  #fi

  # Material- or Food-Cluster
  if [[ "$type" == 'Material' ]] || [[ "$type" == 'Food' ]] ; then
    n=0
    # for (c <- transf.childs().toFile() ; monof <- c.gameobject().toFile().findMono().toFile())
    while read monof ; do
      local m=$(ingredientAmount "$monof")
      if [[ "$m" != '' ]] ; then
        (( n += $m ))
        # get the item_id if this is the first of this type
        if [[ "$item_id" == '' ]] ; then
          item_id=$(ingredientID "$monof")
          TYPE2ITEMID["$item"]=$item_id
        fi
      fi
    done < <(                                                \
      children "$transf"                                     \
      | transf2file "$asset"                                 \
      | xargs -i bash -c 'transf2object "{}"'                \
      | xargs -i bash -c "findGameObject \"{}\" \"$asset\""  \
      | xargs -i bash -c 'mono "{}"'                         \
      | mono2file "$asset"                                   \
    )
    if [[ $n < 1 ]] ; then
      return
    fi
  fi

  # first item of this type
  if [[ "${ITEMS_FOUND[$item]}" == '' ]] ; then
    # clear file
    echo "type,item,item_id,amount,x,y,z,area" > "$outfile"
    ITEMS_FOUND["$item"]="$outfile"
  fi

  # output
  out="$type,$item,$item_id,$n,$pos,$area"
  echo "$type,$item,$item_id,$n,$pos,$area" >> "$outfile"
}


###############################################################################
###############################################################################

IFS='
'

# search parameter
SEARCH='.'
if [ $# -gt 0 ] ; then
  SEARCH="$1"
fi

# main loop
cd "$ALL"
FOUND=($(find . -name "*\-GameObject\.json"  \
  | grep -P '^./(Pillar_Amphiscis|Pillar-|KeyGraphite_Cluster_|(Material|Food)Cluster_|(Alpafant|Bleeker|Puffle|Waddletooth)_Spawner( \([0-9]+\))?\-|(MQ035_)?Pickup_?Idea(\-|_(?!Spot\-))|AlbamareChest\-)'  \
  | grep -E "$SEARCH"  \
))
n=${#FOUND[@]}
i=0
start=$(date +%s)
elpd=0
eta=0
elapsed=''
remain=''
out=''

for filename in "${FOUND[@]}"; do
  # output
  perc=$(echo "$i $n" | awk '{printf "%.2f", ($1*100.0/$2)}')
  echo -en "\033[2K\r[${perc}% ($i / $n)$elapsed$remain] $out"

  # work work work work work
  gameobject "${filename:2}"
  ((i++))

  # calculate time
  elpd=$(( $(date +%s) - $start ))
  eta=$(( $elpd * ($n - $i) / $i ))
  elapsed=" | $((elpd / 60))m $((elpd % 60))s time"
  remain=" | $((eta / 60))m $((eta % 60))s ETA"
done

echo -en "\033[2K\r[99.99% ($n / $n)$elapsed] sorting..."

# sort files at the end
for file in "${ITEMS_FOUND[@]}" ; do
  LC_ALL=C  sort -g -t',' -k5 -k7 -k6 -o "$file" "$file"
done

# calculate time
elpd=$(( $(date +%s) - $start ))
eta=$(( $elpd * ($n - $i) / $i ))
elapsed=" | $((elpd / 60))m $((elpd % 60))s time"

echo -en "\033[2K\r[100.00% ($n / $n)$elapsed] done"
