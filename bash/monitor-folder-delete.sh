#!/bin/sh

target_folder=~/test

while inotifywait -q -e delete -r $target_folder; do
  file_count=$(ls -1 $target_folder | wc -l)
  if [ "$file_count" -eq "0" ]; then
    echo "folder is empty"
  else 
    echo "$file_count files remain"
  fi
done