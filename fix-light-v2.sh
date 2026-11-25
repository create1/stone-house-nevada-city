#!/bin/bash

for f in *.html; do
  echo "Fixing: $f"
  
  # FIX 1: CTA hover — gold bg needs white text, not cream (--s is now cream)
  sed -i 's/\.nav-cta:hover{background:var(--g);color:var(--s)}/.nav-cta:hover{background:var(--g);color:#fff}/g' "$f"
  
  # FIX 2: Any remaining rgba(244,237,224,...) — swap to dark
  sed -i 's/rgba(244,237,224,0.45)/rgba(26,23,20,0.45)/g' "$f"
  sed -i 's/rgba(244,237,224,0.58)/rgba(26,23,20,0.58)/g' "$f"
  sed -i 's/rgba(244,237,224,0.3)/rgba(26,23,20,0.25)/g' "$f"
  sed -i 's/rgba(244,237,224,0.7)/rgba(26,23,20,0.6)/g' "$f"
  
  # FIX 3: Nav link md color too faint — bump to 0.6
  sed -i 's/--md:rgba(26,23,20,0.45)/--md:rgba(26,23,20,0.6)/g' "$f"
  
  # FIX 4: Muted color — bump to 0.65 for readability
  sed -i 's/--muted:rgba(26,23,20,0.58)/--muted:rgba(26,23,20,0.65)/g' "$f"
  
  # FIX 5: Logo — add CSS filter to invert for light bg
  # Add a class for the logo to use dark version
  sed -i 's/\.nav-logo-img{height:32px;width:auto}/.nav-logo-img{height:32px;width:auto;filter:invert(1) brightness(0.2)}/g' "$f"
  
  # FIX 6: Footer logo same issue
  sed -i 's/\.footer-logo-img{height:22px/.footer-logo-img{height:22px;filter:invert(1) brightness(0.2)/g' "$f"
  
  # FIX 7: Checkmark colors — green on light should be darker
  sed -i "s/color:var(--g);font-size:\.75rem}/color:#7d6433;font-size:.75rem}/g" "$f"
  sed -i "s/color:var(--g);font-size:\.8rem}/color:#7d6433;font-size:.8rem}/g" "$f"

  # FIX 8: Any inline style="color:var(--c)" on strong tags — these are now dark, which is correct for light mode. OK.
  
  # FIX 9: Marquee/ticker background if it uses --s3
  # Already converted via variable swap. OK.
  
done

# FIX 10: styles.css — same CTA hover fix
if [ -f styles.css ]; then
  sed -i 's/color: var(--s);/color: #fff;/g' styles.css
  # Logo filter
  sed -i 's/height: 32px/height: 32px; filter: invert(1) brightness(0.2)/g' styles.css 2>/dev/null
  echo "styles.css fixed"
fi

echo "Done fixing $(ls *.html | wc -l) files"
