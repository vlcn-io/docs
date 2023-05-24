#!/usr/bin/env bash

declare -a pkgs=(
  "@vlcn.io/crsqlite-wasm:0.10.2-next.1"
  "@vlcn.io/react:0.10.3-next.4"
  "@vlcn.io/rx-tbl:0.9.1"
  "@vlcn.io/xplat-api:0.9.1"
  "@vlcn.io/wa-sqlite:0.16.1"
)

update_file() {
  local file=$1
  local name=$2
  local version=$3
  awk -v name="$name" -v version="$version" '{gsub(name "@[^[:space:]]+", name "@" version); print}' "$file" > tmp && mv tmp "$file"
}

for pkg in "${pkgs[@]}"; do
  echo "Updating $pkg"
  
  IFS=':' read -r NAME VERSION <<< "$pkg"
  
  # replace in package.json
  jq --arg name "$NAME" --arg version "$VERSION" '.dependencies[$name] = $version' package.json > tmp.json && mv tmp.json package.json

  find ./pages -name '*.mdx' -exec bash -c '
      update_file() {
        local file=$1
        local name=$2
        local version=$3
        awk -v name="$name" -v version="$version" "{gsub(name \"@[0-9a-z.\-]+\", name \"@\" version); print}" "$file" > tmp && mv tmp "$file"
      }
      update_file "$0" "$1" "$2"
    ' {} "$NAME" "$VERSION" \;

done
