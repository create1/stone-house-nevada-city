#!/bin/bash
# Convert all HTML files from dark mode to light mode by swapping CSS variable values

for f in *.html; do
  echo "Converting: $f"
  
  # Swap root CSS variables - dark backgrounds to light
  sed -i 's/--s:#1a1714/--s:#faf7f2/g' "$f"
  sed -i 's/--s2:#1e1c18/--s2:#f0ebe3/g' "$f"
  sed -i 's/--s3:#252219/--s3:#e8e2d8/g' "$f"
  sed -i 's/--s4:#2d2820/--s4:#ddd7cc/g' "$f"
  sed -i 's/--s5:#332f29/--s5:#d5cfc4/g' "$f"
  
  # Gold accent - darken slightly for light bg contrast
  sed -i 's/--g:#c9a76b/--g:#9a7d42/g' "$f"
  sed -i 's/--gd:#a88748/--gd:#7d6433/g' "$f"
  sed -i 's/--gl:#e2c088/--gl:#b8944e/g' "$f"
  sed -i 's/--gll:#f0d9a8/--gll:#c9a45a/g' "$f"
  
  # Text colors - cream to dark
  sed -i 's/--c:#f4ede0/--c:#1a1714/g' "$f"
  
  # Muted text - lighten to darken
  sed -i 's/--m:#8a7e6f/--m:#5a5347/g' "$f"
  sed -i 's/--md:rgba(244,237,224,0.45)/--md:rgba(26,23,20,0.45)/g' "$f"
  sed -i 's/--muted:rgba(244,237,224,0.58)/--muted:rgba(26,23,20,0.58)/g' "$f"
  
  # Nav background - dark translucent to light translucent
  sed -i 's/rgba(26,23,20,0.95)/rgba(250,247,242,0.95)/g' "$f"
  
  # Border colors - gold borders adjust opacity (keep similar but slightly stronger)
  sed -i 's/rgba(201,167,107,0.08)/rgba(154,125,66,0.12)/g' "$f"
  sed -i 's/rgba(201,167,107,0.06)/rgba(154,125,66,0.10)/g' "$f"
  sed -i 's/rgba(201,167,107,0.04)/rgba(154,125,66,0.08)/g' "$f"
  sed -i 's/rgba(201,167,107,0.1)/rgba(154,125,66,0.15)/g' "$f"
  sed -i 's/rgba(201,167,107,0.12)/rgba(154,125,66,0.18)/g' "$f"
  sed -i 's/rgba(201,167,107,0.15)/rgba(154,125,66,0.20)/g' "$f"
  sed -i 's/rgba(201,167,107,0.18)/rgba(154,125,66,0.22)/g' "$f"
  sed -i 's/rgba(201,167,107,0.2)/rgba(154,125,66,0.25)/g' "$f"
  sed -i 's/rgba(201,167,107,0.25)/rgba(154,125,66,0.30)/g' "$f"
  
  # Footer text - very dim cream to very dim dark  
  sed -i 's/rgba(244,237,224,0.3)/rgba(26,23,20,0.3)/g' "$f"
  sed -i 's/rgba(244,237,224,0.7)/rgba(26,23,20,0.7)/g' "$f"
  
  # Confirm tags - keep green/red but adjust for light bg
  sed -i 's/rgba(100,200,100,0.12)/rgba(40,160,40,0.12)/g' "$f"
  sed -i 's/color:#7ecf7e/color:#2a8a2a/g' "$f"
  sed -i 's/rgba(200,100,100,0.12)/rgba(180,50,50,0.12)/g' "$f"
  sed -i 's/color:#cf7e7e/color:#b83232/g' "$f"
  
done

echo "Done converting $(ls *.html | wc -l) files"
