#!/usr/bin/env bash

declare -a pkgs=(
  "@vlcn.io/crsqlite-wasm:0.10.2-next.1"
  "@vlcn.io/react:0.10.3-next.4"
  "@vlcn.io/rx-tbl:0.9.1"
  "@vlcn.io/xplat-api:0.9.1"
  "@vlcn.io/wa-sqlite:0.16.1"
)

for pkg in "${pkgs[@]}"; do
  echo "Updating $pkg"
  
  IFS=':' read -r NAME VERSION <<< "$pkg"
  
  # replace in package.json
  # echo "s/\"${parts[0]}\": \".*\"/\"${parts[0]}\": \"${parts[1]}\"/g"
  jq --arg name "$NAME" --arg version "$VERSION" '.dependencies[$name] = $version' package.json > tmp.json && mv tmp.json package.json
  # replace in all mdx files in pages and contained directories
  # find ./pages -name "*.mdx" -exec sed -i '' -e "s/${parts[0]}\@.*\"/${parts[0]}\@${parts[1]}\"/g" {} \;
  find ./pages -name "*.mdx" -exec sed -i -E "s/${NAME}@[^[:space:]]+/${NAME}@${VERSION}/g" {} \;
done
