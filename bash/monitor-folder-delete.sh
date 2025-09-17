#!/bin/sh

target_folder=~/test

while inotifywait -e delete -r $target_folder; do
  echo 1234
  # if tail -n1 /var/log/messages | grep apache; then
  #   kdialog --msgbox "Blah blah Apache"
  # fi
done