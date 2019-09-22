## Find and Export game coordinates

When you execute `./extract.sh` it guides and supports you in the export process that requires manual steps with [UABE](https://github.com/DerPopo/UABE).

Called without arguments it exports everything.

When called with one parameter, it filters the GameObject files by the given string.

Example:
```
$ ./extract.sh  KeyGraphite
```


### Extract compressed assets (one time)

When you use the `export.sh` for the first time it asks you to extract the compressed game assets first and tells you what commands you need to run.

This is needed, because the game assets are compressed and `UABE` can only open one compressed file at once.

If you are using `TortoiseGit` on Windows, make sure that `TGitCache.exe` isn't running, because it slows down the export process significantly, even when only using directories that are in the `.gitignore`...


### Extract Game Objects

When this is done, you need to export the data drom the decompresset asset files.

Just run the `export.sh` a second time and it tells you what to do that.

First you need to open the specified files in the `assets_...` directory with `UABE`.

Once it opened all files, you should sort the list by `Type` and export all entries for the following types:
- `MonoBehaviour`
- `GameObject`
- `Transform`

Do this by selecting them with Shift, click on `Export Dump` and choose `UABE json dump`, press `OK` and select the `all_...` directory.


### Combine Game Objects and Transforms

Now that all Game Objects, Mono Behaviours and Transforms are exported, the `extract.sh` can do its job going over those files and analysing them.


### Hints for Developers

In case you want to export it yourself or write your own scripts, this might be helpful:
- The game assets for the items are located in `.\Pine_Data\StreamingAssets\bundles\`
- The files are compressed `.asset` files - they may need to be decompressed depending on your tool.
  - `UABE` can only open one compressed file at a time, but offers batch decompression (but no batch export :/ ).
  - `UABE` needed ~5-10 minutes to decompress all but ~9-12 hours to open all `.asset` files at once.
- `Game Object`s and `Transform`s are separate from each others and reference to each other via Path-ID and File-ID.
- Be careful when dealing with the Path-IDs. These IDs are 64-bit signed integers. Not all tools handle them well.
  - `jq` gives you back wrong values without an error or warning. (see jq issue [1652](https://github.com/stedolan/jq/issues/1652))
  - `UABE` has the Path-ID signed in the extracted JSON and unsigned in the filename.
    - unsigned2signed: `echo $unsigned | awk -M '$1>=2^63{$1-=2^64}1'`
    - signed2unsigned: `echo $signed   | awk -M '$1<0{$1+=2^64}1'`
