#!/bin/bash

echo "Renaming files in GIT in order to correct casing"
for file in *
do
  git mv "$file" "$file-temp"
  git mv "$file-temp" "$file"
done
