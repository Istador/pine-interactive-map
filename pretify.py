#!/usr/bin/env python

import sys
import csv
import os.path
import os
from distutils.dir_util import mkpath


if len(sys.argv) < 3 or 4 < len(sys.argv):
  print('usage:  prettify.py <old version> <new version> [item_name]')
  sys.exit(1)

search = sys.argv[3] if len(sys.argv) == 4 else ''
p_old  = f"pretty/{sys.argv[1]}"
p_new  = f"pretty/{sys.argv[2]}"
p_raw  = f"raw/{sys.argv[2]}"

# main loop
files = [f for f in os.listdir(p_raw) if f.endswith('.csv') and search in f]
for file in files:
  print('')
  print('###   ' + file)


  f_old = f"{p_old}/{file}"
  f_new = f"{p_new}/{file}"
  f_raw = f"{p_raw}/{file}"

  # raw not found
  if not os.path.isfile(f_raw):
    print(f"#  Error: file not found '{f_raw}'")
    sys.exit(2)

  mkpath(p_new)

  # old not found
  if not os.path.isfile(f_old):
    print(f"#  Warning: file not found '{f_old}'")
    print('#  => assume that it is all new')
    with open(f_raw, 'r') as reader, open(f_new, 'w') as writer:
      lines=[]
      for i, line in enumerate(reader.read().splitlines()):
        lines += [ ('new,' if i else 'id,') + line + (',needs check' if i else ',state') + '\n' ]
      writer.writelines(lines)
    continue

  # distance between two coordinates in squared distance space (avoiding slow squareroot calculation)
  def distance2(a, b):
    return (float(a['x']) - float(b['x'])) ** 2 + (float(a['y']) - float(b['y'])) ** 2 + (float(a['z']) - float(b['z'])) ** 2

  def csvout(p):
    return f"{p['id']},{p['type']},{p['item']},{p['item_id']},{p['amount']},{p['x']},{p['y']},{p['z']},{p['area']},{p['state']}"

  def p2str(p):
    return f"({p['x']}, {p['y']}, , {p['z']})"

  def nearest(o_idx, old):
    dists = []
    d = 0

    # calculate distance for all new rows
    for n_idx, new in enumerate(news):
      # ignore old entries that are already used by other new rows
      if n_idx in new2old:
        continue
      # calculate distance
      d = distance2(old, new)
      if d <= 2500:
        dists += [ [ d, n_idx, new ] ]
    if len(dists) == 0:
      return
    dists.sort(key = lambda arr: arr[0])
    [d, n_idx, new] = dists[0]
    new2old[n_idx] = o_idx
    old2new[o_idx] = n_idx
    dist2[n_idx] = d
    return new

  olds    = []
  news    = []
  out     = []
  old2new = []
  new2old = []
  dist2   = []

  # parse old
  with open(f_old, newline='') as o_file:
    for old in csv.DictReader(o_file):
      olds    += [old]
      old2new += [None]

  # pase new
  with open(f_raw, newline='') as n_file:
    for new in csv.DictReader(n_file):
      news    += [new]
      new2old += [None]
      dist2   += [None]

  # match old and new
  for o_idx, old in enumerate(olds):
    dists = []
    d = 0
    # calculate distance for all new rows
    for n_idx, new in enumerate(news):
      # ignore old entries that are already used by other new rows
      if new2old[n_idx] != None:
        continue
      # calculate distance
      d = distance2(old, new)
      if d <= 2500:
        dists += [ [ d, n_idx, new ] ]
    if len(dists) == 0:
      continue
    dists.sort(key = lambda arr: arr[0])
    [d, n_idx, new] = dists[0]
    new2old[n_idx] = o_idx
    old2new[o_idx] = n_idx
    dist2[n_idx] = d

  # output existing entries
  for n_idx, new in enumerate(news):
    o_idx = new2old[n_idx]
    # existing
    if o_idx != None:
      old = olds[o_idx]
      new['id'] = old['id']
      states = []
      # slightly moved when more than 5m
      if dist2[n_idx] > 25:
        states += [ 'moved' ]
      # area changed
      if old['area'] != new['area']:
        states += [ 'area' ]
      # amount changed
      if old['amount'] != new['amount']:
        states += [ 'amount' ]
      # item_id changed
      if old['item_id'] != new['item_id']:
        states += [ 'item_id' ]
      state = ' / '.join(states)
      if state:
        if old['state'] == 'confirmed':
          new['state'] = state
        else:
          new['state'] = 'needs check / ' + state
      else:
        if old['state'] == 'confirmed':
          new['state'] = 'confirmed'
        else:
          new['state'] = 'needs check'
    # new
    else:
      new['id'] = 'new'
      new['state'] = 'added'
    out += [new]

  # output removed entries
  for o_idx, old in enumerate(olds):
    n_idx = old2new[o_idx]
    # removed
    if n_idx == None:
      old['state'] = 'removed'
      out += [old]

  out.sort(key = lambda p: (float(p['x']), float(p['z']), float(p['y'])))

  with open(f_new, 'w') as writer:
    writer.write('id,type,item,item_id,amount,x,y,z,area,state\n')
    for p in out:
      line = csvout(p)
      writer.write(line + '\n')
      print(line)
