/* Unlock wedding pamphlet download + email PDF link after Tripleseat success. */
(function () {
  var PDF = "/api/pamphlet";
  var KEY = "sh_pamphlet_wedding";
  var SOURCE = "Website - Wedding Pricing Pamphlet";
  var shown = false;
  var emailed = false;
  var pending = null;

  var panel = document.getElementById("sh-pamphlet-success");
  var link = document.getElementById("sh-pamphlet-dl");
  var embed =
    document.getElementById("ts-wedding-form") ||
    document.getElementById("ts-facebook-wedding-form") ||
    document.querySelector(".ts-form-embed");

  function fire(fb, ga) {
    try {
      if (window.fbq) fbq("track", fb, { content_name: "Wedding Pamphlet" });
    } catch (e) {}
    try {
      if (window.gtag) gtag("event", ga, { event_label: "Wedding Pamphlet" });
    } catch (e) {}
  }

  function setUnlockCookie() {
    try {
      document.cookie = KEY + "=1; Path=/; Max-Age=86400; SameSite=Lax";
    } catch (e) {}
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  }

  function readTsFields(root) {
    if (!root) return null;
    var email = "";
    var first = "";
    var last = "";
    var phone = "";
    var name = "";
    var inputs = root.querySelectorAll("input, textarea, select");
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      var n = ((el.name || "") + " " + (el.id || "") + " " + (el.placeholder || "") + " " + (el.getAttribute("aria-label") || "")).toLowerCase();
      var v = String(el.value || "").trim();
      if (!v) continue;
      if (el.type === "email" || /e-?mail/.test(n)) email = v;
      else if (/first/.test(n)) first = v;
      else if (/last/.test(n)) last = v;
      else if (el.type === "tel" || /phone|mobile|tel/.test(n)) phone = v;
      else if (/(^|\s)name(\s|$)|full.?name|your name/.test(n) && !/company|business/.test(n)) name = v;
    }
    if (!name) name = [first, last].filter(Boolean).join(" ");
    if (!email && !name && !phone) return null;
    return {
      email: email,
      name: name || "Guest",
      phone: phone,
    };
  }

  function emailPamphlet(fields) {
    if (emailed || !fields || !isValidEmail(fields.email)) return;
    emailed = true;
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name || "Guest",
          email: fields.email,
          phone: fields.phone || "",
          source: SOURCE,
          occasion: "Wedding",
          notes: "Tripleseat wedding form — send pricing pamphlet",
        }),
      })
        .then(function (r) {
          return r.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          if (data && data.downloadUrl && link) {
            link.href = data.downloadUrl;
          }
        })
        .catch(function () {});
    } catch (e) {}
  }

  function showDownload(opts) {
    opts = opts || {};
    if (!shown) {
      shown = true;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch (e) {}
      setUnlockCookie();
      if (link) {
        link.href = PDF;
        link.target = "_blank";
        link.rel = "noopener";
        link.removeAttribute("aria-disabled");
      }
      if (panel) {
        panel.hidden = false;
        panel.setAttribute("aria-hidden", "false");
        panel.classList.add("is-visible");
        if (opts.scroll !== false) {
          try {
            panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } catch (e) {}
        }
      }
      if (opts.track !== false) {
        fire("Lead", "generate_lead");
        fire("PamphletDownloadReady", "file_download");
      }
    }
    if (pending) emailPamphlet(pending);
    else emailPamphlet(readTsFields(embed));
  }

  function looksLikeSuccess(text) {
    return /thank you|thanks for|submitted|we('|\u2019)?ll be in touch|request received|successfully submitted|lead received/i.test(
      text || ""
    );
  }

  function checkEmbedSuccess() {
    if (!embed) return;
    var text = (embed.innerText || embed.textContent || "").trim();
    if (looksLikeSuccess(text)) showDownload();
  }

  function capturePending() {
    var fields = readTsFields(embed);
    if (fields && isValidEmail(fields.email)) pending = fields;
  }

  if (embed) {
    embed.addEventListener(
      "submit",
      function () {
        capturePending();
        // slight delay so Tripleseat can finish; then email + unlock
        setTimeout(function () {
          capturePending();
          showDownload({ scroll: true });
        }, 600);
      },
      true
    );

    embed.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (!t) return;
        var label = ((t.textContent || "") + " " + (t.value || "") + " " + (t.type || "")).toLowerCase();
        if (t.type === "submit" || /submit|send|request|continue|download/.test(label)) {
          capturePending();
        }
      },
      true
    );

    if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        checkEmbedSuccess();
      });
      mo.observe(embed, { childList: true, subtree: true, characterData: true });
    }
  }

  window.addEventListener("message", function (e) {
    var origin = (e.origin || "").toLowerCase();
    if (origin && origin.indexOf("tripleseat") === -1 && origin.indexOf("stonehouse") === -1) return;
    var blob = "";
    try {
      blob = typeof e.data === "string" ? e.data : JSON.stringify(e.data || "");
    } catch (err) {
      return;
    }
    if (looksLikeSuccess(blob) || /submit|success|complete|conversion/i.test(blob)) {
      capturePending();
      showDownload();
    }
  });

  try {
    var q = new URLSearchParams(location.search);
    if (
      q.get("download") === "1" ||
      q.get("submitted") === "1" ||
      q.get("unlocked") === "1" ||
      location.hash === "#download" ||
      sessionStorage.getItem(KEY) === "1"
    ) {
      showDownload({
        track: false,
        scroll: q.get("download") === "1" || q.get("submitted") === "1",
      });
    }
  } catch (e) {}
})();
