#!/usr/bin/env ruby
# Unify secondary pages onto multipage aesthetic (styles.css + shell + gray)
# encoding: utf-8

NAV = <<~'HTML'
<nav id="nav">
  <a href="index.html" class="nav-logo" style="text-decoration:none;color:inherit">
    <img src="assets/stone-house-logo.png" alt="Stone House" class="nav-logo-img">
    <span class="nav-wm">STONE HOUSE</span>
    <div class="nav-div"></div>
    <span class="nav-est">Est. 1857</span>
  </a>
  <div class="nav-links">
    <a href="spaces.html" class="nav-link">Spaces</a>
    <a href="events.html" class="nav-link">Events</a>
    <a href="catering.html" class="nav-link">Catering</a>
    <a href="gallery.html" class="nav-link">Gallery</a>
    <a href="pricing.html" class="nav-link">Pricing</a>
    <a href="library.html" class="nav-link">Library</a>
    <a href="faq.html" class="nav-link">FAQ</a>
    <a href="https://premiervenuepricing.com/pricing-pamphlet-stone-house" target="_blank" rel="noopener" class="nav-cta">Check Your Date</a>
  </div>
  <button class="mob-btn" onclick="toggleMob()" id="mob-btn" aria-label="Menu">
    <span id="mb1"></span><span id="mb2"></span><span id="mb3"></span>
  </button>
</nav>
<div id="mob-nav">
  <a href="spaces.html" class="mob-link" onclick="toggleMob()">Spaces</a>
  <a href="events.html" class="mob-link" onclick="toggleMob()">Events</a>
  <a href="catering.html" class="mob-link" onclick="toggleMob()">Catering</a>
  <a href="gallery.html" class="mob-link" onclick="toggleMob()">Gallery</a>
  <a href="pricing.html" class="mob-link" onclick="toggleMob()">Pricing</a>
  <a href="library.html" class="mob-link" onclick="toggleMob()">Library</a>
  <a href="faq.html" class="mob-link" onclick="toggleMob()">FAQ</a>
  <a href="https://premiervenuepricing.com/pricing-pamphlet-stone-house" target="_blank" rel="noopener" class="mob-cta-btn" onclick="toggleMob()">Check Your Date</a>
</div>
HTML

CHROME = <<~'HTML'
<div id="cursor"></div>
<div id="cursor-ring"></div>
<div id="grain"></div>
<div id="scroll-progress"></div>
<button id="btt" title="Back to top"><svg width="18" height="18"><use href="assets/icons.svg#icon-arrow-up"></use></svg></button>
HTML

FOOTER = <<~'HTML'
<div class="footer-quote sh-pattern sh-pattern--dense">
  <p class="footer-quote-text"><em>107 Sacramento Street</em> &nbsp;·&nbsp; Nevada City, California &nbsp;·&nbsp; <em>Est. 1857</em></p>
</div>
<footer>
  <div class="footer-grid">
    <div>
      <div class="footer-brand"><img src="assets/stone-house-logo.png" alt="Stone House" class="footer-logo-img"> STONE HOUSE</div>
      <p class="footer-desc">Historic event venue in Nevada City, California. Where history meets intention since 1857.</p>
      <div class="footer-addr">
        107 Sacramento Street<br>Nevada City, CA 95959<br>
        <a href="tel:+15302655050">(530) 265-5050</a><br>
        <a href="tel:+15304536534">Events: (530) 453-6534</a><br>
        <a href="mailto:bookings@stonehouse.io">bookings@stonehouse.io</a>
      </div>
    </div>
    <div>
      <h4 class="footer-col-title">Explore</h4>
      <div class="footer-links">
        <a href="spaces.html" class="footer-link">Spaces</a>
        <a href="events.html" class="footer-link">Events</a>
        <a href="catering.html" class="footer-link">Catering</a>
        <a href="gallery.html" class="footer-link">Gallery</a>
        <a href="pricing.html" class="footer-link">Pricing</a>
        <a href="library.html" class="footer-link">Library</a>
        <a href="faq.html" class="footer-link">FAQ</a>
      </div>
    </div>
    <div>
      <h4 class="footer-col-title">Plan</h4>
      <div class="footer-links">
        <a href="https://premiervenuepricing.com/pricing-pamphlet-stone-house" target="_blank" rel="noopener" class="footer-link">Check Your Date</a>
        <a href="floor-plans.html" class="footer-link">Floor Plans</a>
        <a href="menus.html" class="footer-link">Menus</a>
        <a href="vendors.html" class="footer-link">Vendors</a>
      </div>
    </div>
    <div>
      <h4 class="footer-col-title">Connect</h4>
      <div class="footer-links">
        <a href="https://www.instagram.com/stonehousenevadacity/" class="footer-link" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/stonehousenevadacity/" class="footer-link" target="_blank" rel="noopener">Facebook</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">&copy; 2026 Stone House Nevada City. All rights reserved.</span>
    <span class="footer-est">Est. 1857 · Nevada City, California</span>
  </div>
</footer>
<script src="app.js"></script>
HTML

PAGES = %w[
  menus.html brunch.html elopement.html getting-ready.html press.html vendors.html
  accommodations.html chef-story.html local-guide.html gold-country-venues.html
  layouts.html timeline.html weather-guide.html nevada-city-wedding-venue.html
  rehearsal-dinner.html blog.html floor-plans.html privacy.html
]

head_inject = <<~'H'
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="subpage-styles.css">
H

PAGES.each do |path|
  next unless File.exist?(path)
  s = File.read(path)

  # stylesheets
  if s.include?('subpage-styles.css') && !s.include?('href="styles.css"')
    s.sub!('href="subpage-styles.css"', 'href="styles.css">' + "\n" + '<link rel="stylesheet" href="subpage-styles.css"')
  elsif !s.include?('href="styles.css"')
    if s.include?('</title>')
      s.sub!('</title>', "</title>\n#{head_inject}")
    end
  end
  if s.include?('styles.css') && !s.include?('subpage-styles.css')
    s.sub!(%r{href="styles\.css">}, "href=\"styles.css\">\n<link rel=\"stylesheet\" href=\"subpage-styles.css\">")
  end

  # strip giant inline :root stylesheets
  s.gsub!(%r{<style>[\s\S]*?</style>}m) do |block|
    if block.include?(':root') && block.length > 800
      ''
    else
      block
    end
  end

  # body class
  if s =~ /<body([^>]*)>/
    attrs = $1
    if attrs =~ /class="([^"]*)"/
      cls = $1
      unless cls.include?('page-inner')
        s.sub!(/class="#{Regexp.escape(cls)}"/, "class=\"#{cls} page-inner page-article\"")
      end
    elsif attrs =~ /class='([^']*)'/
      cls = $1
      unless cls.include?('page-inner')
        s.sub!(/class='#{Regexp.escape(cls)}'/, "class='#{cls} page-inner page-article'")
      end
    else
      s.sub!(/<body/, '<body class="page-inner page-article"')
    end
  end

  # replace first nav (+ old nav-mobile)
  if s =~ /<nav[\s>]/
    s.sub!(%r{<nav[\s>][\s\S]*?</nav>}m, NAV)
    s.sub!(%r{\s*<div class="nav-mobile">[\s\S]*?</div>}m, '')
  else
    s.sub!(/<body[^>]*>/) { |m| "#{m}\n#{CHROME}\n#{NAV}" }
  end

  unless s.include?('id="grain"')
    s.sub!(/<body[^>]*>/) { |m| "#{m}\n#{CHROME}" }
  end

  # footer
  unless s.include?('footer-grid')
    s.sub!(%r{<footer[\s\S]*?</footer>}m, '')
    s.sub!(%r{</body>}, "#{FOOTER}\n</body>")
  end
  unless s.include?('app.js')
    s.sub!(%r{</body>}, "<script src=\"app.js\"></script>\n</body>")
  end

  s.gsub!('href="/"', 'href="index.html"')
  s.gsub!('href="/#date-check"', 'href="https://premiervenuepricing.com/pricing-pamphlet-stone-house" target="_blank" rel="noopener"')
  s.gsub!('href="/#date-check"', 'href="https://premiervenuepricing.com/pricing-pamphlet-stone-house"')

  File.write(path, s)
  puts "OK #{path}"
end
