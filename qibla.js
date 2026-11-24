/* Qibla direction: finds the direction of the Kaaba from the user's location and points an arrow using the phone's compass. Works offline once the page is loaded. */
"use strict";
(function () {
  const KAABA = { lat: 21.422487, lng: 39.826206 };

  // Great-circle initial bearing from a point to the Kaaba, in degrees clockwise from true north.
  function qiblaBearing(lat, lng) {
    const toRad = d => d * Math.PI / 180;
    const φ1 = toRad(lat), φ2 = toRad(KAABA.lat);
    const Δλ = toRad(KAABA.lng - lng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  const style = document.createElement("style");
  style.textContent = `
    .lml-qibla { display: grid; gap: 10px; justify-items: center; text-align: center; }
    .lml-qibla-dial { position: relative; width: 150px; height: 150px; border-radius: 50%; border: 3px solid currentColor; }
    .lml-qibla-arrow { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform-origin: 0 0; transition: transform .25s ease-out; }
    .lml-qibla-arrow::before { content: ""; position: absolute; left: -8px; top: -66px; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 68px solid #26a360; }
    .lml-qibla-north { position: absolute; left: 50%; top: 4px; transform: translateX(-50%); font-weight: 700; font-size: 14px; }
    .lml-qibla-kaaba { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 22px; }
    .lml-qibla-text { font-weight: 700; margin: 0; }
    .lml-qibla-note { font-size: 14px; margin: 0; opacity: .85; }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card lml-qibla";
  card.id = "lmlQibla";
  card.innerHTML = `
    <h2>🕋 Qibla Direction / Alkiblar</h2>
    <p class="lml-qibla-note">Find the direction of the Kaaba from where you are.</p>
    <div class="lml-qibla-dial" id="lmlQiblaDial" aria-hidden="true">
      <span class="lml-qibla-north">N</span>
      <span class="lml-qibla-kaaba">🕋</span>
      <div class="lml-qibla-arrow" id="lmlQiblaArrow"></div>
    </div>
    <p class="lml-qibla-text" id="lmlQiblaText" aria-live="polite"></p>
    <p class="lml-qibla-note" id="lmlQiblaNote"></p>
    <button class="btn" id="lmlQiblaBtn" type="button">📍 Find my Qibla / Nemo alkiblar</button>`;

  const home = document.getElementById("home");
  if (home) home.appendChild(card);

  const arrow = document.getElementById("lmlQiblaArrow");
  const text = document.getElementById("lmlQiblaText");
  const note = document.getElementById("lmlQiblaNote");
  const btn = document.getElementById("lmlQiblaBtn");

  let bearing = null;
  let heading = null;

  function draw() {
    if (bearing === null) return;
    // Turn the arrow so it points to the Kaaba relative to the top of the phone.
    const angle = heading === null ? bearing : bearing - heading;
    arrow.style.transform = "rotate(" + angle + "deg)";
  }

  function onOrientation(event) {
    let h = null;
    if (typeof event.webkitCompassHeading === "number") h = event.webkitCompassHeading;
    else if (event.absolute && typeof event.alpha === "number") h = (360 - event.alpha) % 360;
    if (h !== null) { heading = h; draw(); }
  }

  async function startCompass() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result !== "granted") return false;
      }
      window.addEventListener("deviceorientationabsolute", onOrientation);
      window.addEventListener("deviceorientation", onOrientation);
      return true;
    } catch (_) { return false; }
  }

  btn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      text.textContent = "Location is not available on this device.";
      return;
    }
    text.textContent = "Finding your location... / Ana nemo wurin ka...";
    navigator.geolocation.getCurrentPosition(async pos => {
      bearing = qiblaBearing(pos.coords.latitude, pos.coords.longitude);
      text.textContent = "Qibla is " + Math.round(bearing) + "° from North. / Alkiblar yana " + Math.round(bearing) + "° daga Arewa.";
      const compass = await startCompass();
      note.textContent = compass
        ? "Turn slowly until the green arrow points up. The Kaaba is at the top of the dial."
        : "Compass is not available. Use the number above with a compass app, or face " + Math.round(bearing) + "° from North.";
      draw();
    }, () => {
      text.textContent = "Location permission is needed to find the Qibla.";
      note.textContent = "Allow location for this app in your phone settings, then try again.";
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
  });

  window.lmlQiblaBearing = qiblaBearing;
})();
