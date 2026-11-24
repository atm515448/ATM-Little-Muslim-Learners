/* Prayer time calculation, shared by the page and the service worker. Muslim World League angles (Fajr 18, Isha 18), Shafi'i Asr. Works offline. Confirm with your local mosque. */
(function (root) {
  "use strict";
  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;

  function fixHours(h) { return ((h % 24) + 24) % 24; }

  // Sun declination (degrees) and equation of time (hours) for a Julian day.
  function sunData(jd) {
    const d = jd - 2451545.0;
    const g = rad((357.529 + 0.98560028 * d) % 360);
    const q = ((280.459 + 0.98564736 * d) % 360 + 360) % 360;
    const L = rad((q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360);
    const e = rad(23.439 - 0.00000036 * d);
    const ra = deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15;
    const decl = deg(Math.asin(Math.sin(e) * Math.sin(L)));
    let eqt = q / 15 - ra;
    if (eqt > 12) eqt -= 24;
    if (eqt < -12) eqt += 24;
    return { decl, eqt };
  }

  // Hour offset from solar noon for a sun altitude angle; null if the sun never reaches it.
  function hourAngle(lat, decl, altitude) {
    const c = (Math.sin(rad(altitude)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) / (Math.cos(rad(lat)) * Math.cos(rad(decl)));
    if (c > 1 || c < -1) return null;
    return deg(Math.acos(c)) / 15;
  }

  // Returns local clock hours (0-24) for each prayer on the given date and place.
  function calculate(date, lat, lng) {
    const utcNoon = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12) / 86400000 + 2440587.5;
    const sun = sunData(utcNoon);
    const tz = -date.getTimezoneOffset() / 60;
    const transit = 12 + tz - lng / 15 - sun.eqt;
    // Shafi'i Asr: shadow equals object length plus the object's own length.
    const asrAlt = deg(Math.atan(1 / (1 + Math.tan(Math.abs(rad(lat - sun.decl))))));
    const hFajr = hourAngle(lat, sun.decl, -18);
    const hIsha = hourAngle(lat, sun.decl, -18);
    const hRise = hourAngle(lat, sun.decl, -0.833);
    const hAsr = hourAngle(lat, sun.decl, asrAlt);
    const sunrise = hRise === null ? null : transit - hRise;
    const maghrib = hRise === null ? null : transit + hRise;
    // In far-northern or far-southern places in summer the sun never sinks to -18 degrees.
    // Then Fajr and Isha fall back to 90 minutes before sunrise and after sunset.
    const fajr = hFajr !== null ? transit - hFajr : (sunrise === null ? null : sunrise - 1.5);
    const isha = hIsha !== null ? transit + hIsha : (maghrib === null ? null : maghrib + 1.5);
    return {
      fajr: fajr === null ? null : fixHours(fajr),
      sunrise: sunrise === null ? null : fixHours(sunrise),
      dhuhr: fixHours(transit),
      asr: hAsr === null ? null : fixHours(transit + hAsr),
      maghrib: maghrib === null ? null : fixHours(maghrib),
      isha: isha === null ? null : fixHours(isha)
    };
  }

  root.LMLPrayer = { calculate: calculate };
})(typeof self !== "undefined" ? self : window);
