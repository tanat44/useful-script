#!/bin/bash

INPUT_DIR=input
OUTPUT_DIR=output

mkdir -p $OUTPUT_DIR
cp -a "${INPUT_DIR}/." $OUTPUT_DIR 

for FILE in "$OUTPUT_DIR"/*; do
  if [ -f "$FILE" ]; then # Check if it's a regular file (not a directory)
    echo "Processing file: $FILE"
    sed -i 's/NAME/sushi/g' $FILE
  fi
done