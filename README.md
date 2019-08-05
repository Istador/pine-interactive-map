## Find and Export game coordinates

When you execute `./export.sh` it guides and supports you in the export process that requires manual steps with [UABE](https://github.com/DerPopo/UABE).

`export.sh` requires one parameter that is searched for in the game assets.
It tells you what it found and asks for confirmation before continuing.

Example:
```
$ ./export.sh  keygraphite
```

### Extract compressed assets (one time)

When you use the `export.sh` for the first time it asks you to extract the compressed game assets first and tells you what commands you need to run.

This is needed, because the game assets are compressed and `UABE` can only open one compressed file at once.

### Open Assets in UABE

When you confirm the export, it copys the asset files that contain what you are searching for to the `selectedassets` directory.

Open them all at once with `UABE` (File > Open, navigate to directory, CTRL + A).

(The Windows file open dialog has a character limit of ~255 chars, but allows selecting more manually, which is why I copy the files to this folder to allow easy CTRL + A selection).
(Opening all assets and not just the selected ones is not advisable, as it takes over ten hours to open and `UABE` is very slow working with it).

If you are using `TortoiseGit` on Windows, make sure that `TGitCache.exe` isn't running, because it slows down the export process significantly, even when only using directories that are in the `.gitignore`...

### Extract Game Objects

Once it opened all files, you should sort the list by `Name`, and look under `GameObject` for the thing you want to export.

Examples:
- `GameObject Pillar_Amphiscis (15)` for `amphiscispillar`
- `GameObject MaterialCluster MorrowHay ([1-4])` for `morrowhay`

Check that the selected Game Objects contain usable coordinates with `View Data`. A lot of the Game Objects you will find inside the Game Assets, only have coordinates around (0, 0, 0).
These are local coordinate offsets from their parent, usually you can expand the `m_father` tree to find out the name of the Game Object that contains the real game coordinates.

Select all Game Objects that you want to get the coordinates for, click on `Export Dump` and choose `UABE json dump`, press `OK` and select the `gameobjects` directory.

### Extract Transforms

Now you do have all Game Objects in the folder, but they do not contain any coordinates.

That's because the Transform that contains the coordinates is only referenced by its Path ID.

We have to export all Transforms (sort by `Type`) in the opened files (also as `UABE json dump`) to the `transforms` directory.
(Exporting all Transforms for all assets and not just the selected ones is not advisable, because it takes too long to search for the Game Objects.)

### Combine Game Objects and Transforms

Now that both, Game Objects and Transforms, are exported to the right directories, the `export.sh` script can continue.

It now searches the `transforms` directory for all exported Game Objects inside the `gameobjects` directory, saves their coordinates in the `raw` directory and also outputs them.

### Hints for Developers

In case you want to export it yourself or write your own scripts, this might be helpful:
- The game assets for the items are located in `.\Pine_Data\StreamingAssets\bundles\`
- The `.manifest` files can be `grep`ed to find out what is in which file.
- The files are compressed `.asset` files - they may need to be decompressed depending on your tool.
  - `UABE` can only open one compressed file at a time, but offers batch decompression (but no batch export :/ ).
  - `UABE` needed ~5-10 minutes to decompress all but ~9-12 hours to open all `.asset` files at once (=> open only the ones you need, based on the `.manifest`).
- `Game Object`s and `Transform`s are separate from each others and reference to each other via Path-ID and File-ID.
- Be careful when dealing with the Path-IDs. These IDs are 64-bit signed integers. Not all tools handle them well.
  - `jq` gives you back wrong values without an error or warning. (see jq issue [1652](https://github.com/stedolan/jq/issues/1652))
  - `UABE` has the Path-ID signed in the extracted JSON and unsigned in the filename.
    - unsigned2signed: `echo $unsigned | awk -M '$1>=2^63{$1-=2^64}1'`
