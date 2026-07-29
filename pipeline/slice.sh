#!/bin/bash
# Slice alle clips naar framereeksen voor de scrub-engine.
# 18 fps, 1600px breed, jpg q4 (~90KB/frame).
set -e
SITE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SITE"
FF="$(command -v ffmpeg || echo /opt/homebrew/bin/ffmpeg)"
for clip in assets/clips/*.mp4; do
  name="$(basename "$clip" .mp4)"
  out="assets/frames/$name"
  rm -rf "$out"; mkdir -p "$out"
  "$FF" -loglevel error -i "$clip" -vf "fps=18,scale=1600:-2" -q:v 4 "$out/frame_%04d.jpg"
  echo "$name: $(ls "$out" | wc -l | tr -d ' ') frames, $(du -sh "$out" | cut -f1)"
done
