/* Astoria Palawan Resort Study: vanilla JS. Demo only, no data leaves the browser. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Mobile nav ---------- */
  var toggle = $('#navToggle');
  var nav = $('#primaryNav');
  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); }
  });

  /* ---------- Active link on scroll + back-to-top ---------- */
  var navLinks = $$('a[href^="#"]', nav).filter(function (a) { return !a.classList.contains('btn'); });
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  var toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY + 140, current = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
    toTop.hidden = window.scrollY < 700;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('.card, .amenity, .outlet, .mini-card, .section-head, .callout, .info-panel');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Image fallbacks ---------- */
  var FALLBACK = 'assets/images/placeholder.svg';
  function applyFallback(img) {
    if (img.dataset.failed) return;
    img.dataset.failed = '1';
    img.classList.add('img-fallback');
    img.src = FALLBACK;
  }
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () { applyFallback(img); });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) applyFallback(img);
  });

  /* ---------- Menu tabs ---------- */
  var tabs = $$('.menu-tabs [role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n); }
    });
  });

  /* ---------- Reservation form ---------- */
  var OPTIONS = {
    room: {
      label: 'Room',
      items: [
        ['nest', 'The Nest: Superior Plus Room (2 Queen)'],
        ['alcove', 'The Alcove: Superior Room (1 or 2 Queen)'],
        ['villa-deluxe', 'Villa Deluxe Room (2 Queen)'],
        ['villa-1br', 'Villa One-Bedroom Suite (2 Queen)'],
        ['villa-2br', 'Villa Two-Bedroom Suite (4 Queen)']
      ]
    },
    restaurant: {
      label: 'Dining outlet',
      items: [
        ['reserve', 'The Reserve'],
        ['habitat', 'The Habitat'],
        ['fine-nest', 'Fine Nest, Rise & Roast'],
        ['aqua-cena', 'Aqua Cena']
      ]
    },
    package: {
      label: 'Package',
      items: [
        ['romantic', 'Romantic Getaway (demo package)'],
        ['family', 'Family Vacation (demo package)'],
        ['stay-dine', 'Stay-and-Dine (demo package)']
      ]
    }
  };

  var form = $('#resForm');
  var itemSel = $('#item');
  var reviewPanel = $('#reviewPanel');
  var successPanel = $('#successPanel');
  var f = {
    name: $('#fullName'), email: $('#email'), phone: $('#phone'), item: itemSel,
    checkin: $('#checkin'), checkout: $('#checkout'),
    diningDate: $('#diningDate'), diningTime: $('#diningTime'),
    guests: $('#guests'), requests: $('#requests'), ack: $('#demoAck')
  };

  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function todayISO() { return iso(new Date()); }
  function addDays(isoStr, n) {
    var p = isoStr.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2] + n);
    return iso(d);
  }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function prettyDate(s) {
    return parseISO(s).toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function currentType() { return $('input[name="type"]:checked', form).value; }

  function setType(type, itemValue) {
    var radio = $('input[name="type"][value="' + type + '"]', form);
    if (radio) radio.checked = true;
    var cfg = OPTIONS[type];
    $('#itemLabel').innerHTML = cfg.label + ' <span aria-hidden="true">*</span>';
    itemSel.innerHTML = '<option value="">Select...</option>' + cfg.items.map(function (i) {
      return '<option value="' + i[0] + '">' + i[1] + '</option>';
    }).join('');
    if (itemValue) itemSel.value = itemValue;
    $$('[data-for]', form).forEach(function (el) {
      el.hidden = el.getAttribute('data-for').split(' ').indexOf(type) === -1;
    });
    clearErrors();
  }

  function minDates() {
    var t = todayISO();
    f.checkin.min = t;
    f.diningDate.min = t;
    f.checkout.min = f.checkin.value ? addDays(f.checkin.value, 1) : addDays(t, 1);
  }

  function setError(input, msg) {
    var wrap = input.closest('.field');
    var err = $('#' + input.id + '-err');
    if (msg) {
      wrap.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      if (err) err.textContent = msg;
    } else {
      wrap.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      if (err) err.textContent = '';
    }
  }
  function clearErrors() {
    $$('.field input, .field select, .field textarea', form).forEach(function (i) { setError(i, ''); });
  }

  function validate() {
    var type = currentType(), first = null, t = todayISO();
    function fail(input, msg) { setError(input, msg); if (!first) first = input; return false; }
    function ok(input) { setError(input, ''); return true; }

    var name = f.name.value.trim();
    if (!name) fail(f.name, 'Please enter your full name.');
    else if (name.length < 2 || !/[A-Za-zÀ-ɏ]/.test(name)) fail(f.name, 'Please enter a valid name.');
    else ok(f.name);

    var email = f.email.value.trim();
    if (!email) fail(f.email, 'Please enter your email address.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail(f.email, 'Enter a valid email, like name@example.com.');
    else ok(f.email);

    var phone = f.phone.value.trim(), digits = phone.replace(/\D/g, '');
    if (!phone) fail(f.phone, 'Please enter your phone number.');
    else if (!/^[+\d][\d\s()\-]*$/.test(phone) || digits.length < 7 || digits.length > 15) fail(f.phone, 'Enter a valid phone number (7 to 15 digits).');
    else ok(f.phone);

    if (!f.item.value) fail(f.item, 'Please choose an option from the list.'); else ok(f.item);

    if (type === 'restaurant') {
      if (!f.diningDate.value) fail(f.diningDate, 'Please choose a dining date.');
      else if (f.diningDate.value < t) fail(f.diningDate, 'The date cannot be in the past.');
      else ok(f.diningDate);
      if (!f.diningTime.value) fail(f.diningTime, 'Please choose a preferred time.'); else ok(f.diningTime);
    } else {
      if (!f.checkin.value) fail(f.checkin, 'Please choose a check-in date.');
      else if (f.checkin.value < t) fail(f.checkin, 'Check-in cannot be in the past.');
      else ok(f.checkin);
      if (!f.checkout.value) fail(f.checkout, 'Please choose a check-out date.');
      else if (f.checkin.value && f.checkout.value <= f.checkin.value) fail(f.checkout, 'Check-out must be after check-in.');
      else if (f.checkout.value < t) fail(f.checkout, 'Check-out cannot be in the past.');
      else ok(f.checkout);
    }

    var g = parseInt(f.guests.value, 10);
    if (!g || g < 1 || g > 20) fail(f.guests, 'Enter between 1 and 20 guests.'); else ok(f.guests);

    if (!f.ack.checked) fail(f.ack, 'Please tick the box to confirm you understand this is a demo.'); else ok(f.ack);

    if (first) first.focus();
    return !first;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function showReview() {
    var type = currentType();
    var rows = [
      ['Reservation type', OPTIONS[type].label],
      [OPTIONS[type].label, f.item.options[f.item.selectedIndex].text],
      ['Name', f.name.value.trim()],
      ['Email', f.email.value.trim()],
      ['Phone', f.phone.value.trim()]
    ];
    if (type === 'restaurant') {
      rows.push(['Dining date', prettyDate(f.diningDate.value)], ['Time', f.diningTime.value]);
    } else {
      var nights = Math.round((parseISO(f.checkout.value) - parseISO(f.checkin.value)) / 86400000);
      rows.push(['Check-in', prettyDate(f.checkin.value)], ['Check-out', prettyDate(f.checkout.value)], ['Nights', String(nights)]);
    }
    rows.push(['Guests', f.guests.value], ['Special requests', f.requests.value.trim() || 'None']);
    $('#reviewList').innerHTML = rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    form.hidden = true;
    reviewPanel.hidden = false;
    reviewPanel.focus();
    reviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function refNumber() {
    var d = new Date();
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    for (var i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return 'DEMO-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + s;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validate()) showReview();
  });
  $$('input[name="type"]', form).forEach(function (r) {
    r.addEventListener('change', function () { setType(r.value); });
  });
  f.checkin.addEventListener('change', function () {
    minDates();
    if (f.checkin.value && (!f.checkout.value || f.checkout.value <= f.checkin.value)) f.checkout.value = addDays(f.checkin.value, 1);
  });
  $$('.field input, .field select, .field textarea', form).forEach(function (i) {
    i.addEventListener('input', function () { if (i.closest('.field').classList.contains('invalid')) setError(i, ''); });
  });

  $('#editBtn').addEventListener('click', function () {
    reviewPanel.hidden = true; form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    f.name.focus();
  });
  $('#confirmBtn').addEventListener('click', function () {
    $('#refNo').textContent = refNumber();
    reviewPanel.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#newBtn').addEventListener('click', function () {
    form.reset();
    setType('room'); minDates();
    successPanel.hidden = true; form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Booking buttons preselect type + item ---------- */
  function goBook(type, item, extra) {
    reviewPanel.hidden = true; successPanel.hidden = true; form.hidden = false;
    setType(type, item);
    minDates();
    if (extra) extra();
    $('#reservations').scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(function () { f.name.focus({ preventScroll: true }); }, 500);
    if (history.replaceState) history.replaceState(null, '', '#reservations');
  }
  $$('[data-book-type]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      goBook(el.getAttribute('data-book-type'), el.getAttribute('data-book-item'));
      setNav(false);
    });
  });

  /* ---------- Hero quick-book ---------- */
  var qbDate = $('#qbDate');
  qbDate.min = todayISO();
  $('#quickBook').addEventListener('submit', function (e) {
    e.preventDefault();
    var nights = Math.max(1, Math.min(30, parseInt($('#qbNights').value, 10) || 1));
    var guests = Math.max(1, Math.min(20, parseInt($('#qbGuests').value, 10) || 1));
    goBook('room', null, function () {
      if (qbDate.value && qbDate.value >= todayISO()) {
        f.checkin.value = qbDate.value;
        f.checkout.value = addDays(qbDate.value, nights);
        minDates();
      }
      f.guests.value = guests;
    });
  });

  /* ---------- Contact form ---------- */
  var cForm = $('#contactForm');
  cForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#cName'), m = $('#cEmail'), g = $('#cMsg'), first = null, result = $('#contactResult');
    function chk(input, bad, msg) {
      var wrap = input.closest('.field'), err = $('#' + input.id + '-err');
      wrap.classList.toggle('invalid', bad);
      err.textContent = bad ? msg : '';
      if (bad && !first) first = input;
    }
    chk(n, n.value.trim().length < 2, 'Please enter your name.');
    chk(m, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim()), 'Enter a valid email address.');
    chk(g, g.value.trim().length < 10, 'Please write at least 10 characters.');
    if (first) { first.focus(); result.hidden = true; return; }
    result.textContent = 'Demo only: your message was NOT sent to Astoria Palawan or stored. To reach the resort, email reservations@astoriapalawan.com.';
    result.hidden = false;
    cForm.reset();
  });

  /* ---------- Init ---------- */
  setType('room');
  minDates();
})();
