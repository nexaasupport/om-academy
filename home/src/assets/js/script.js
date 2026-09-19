/*
Author       : OM Academy
Description  : Home page scripts: header drawer, scroll spy, enquiry modal, announcements, gallery and lightbox
*/

// ES modules run in strict mode, so no "use strict" wrapper is needed.
import {
  WHATSAPP_NUMBER,
  WHATSAPP_UPDATES_TEXT,
  announcements,
  announcementFilters,
  tagTones,
  galleryItems,
  galleryFilters,
  importantDates,
  importantDateFilters,
  dateTones,
  courses,
  schemes,
  jobRoles,
  stockPhoto,
} from "./data.js";
import { icon } from "./icons.js";

// Helpers
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const plural = (n, word) => n + " " + word + (n === 1 ? "" : "s");
const whatsappUrl = (text) => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

const ARROW_14 = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
const ARROW_12 = '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
const PIN_ICON = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>';

// Page scroll is locked while the drawer, the enquiry modal or the lightbox is open.
const overlays = { menu: false, enquiry: false, lightbox: false, announcement: false };

function setOverlay(name, open) {
  overlays[name] = open;
  document.body.style.overflow = Object.values(overlays).some(Boolean) ? "hidden" : "";
}

// Filter chips shared by Announcements and Gallery
function tabButton(label, count, pressed) {
  return `<button type="button" class="tab" data-filter="${esc(label)}" aria-pressed="${pressed}">${esc(label)}<span class="tab-count">${count}</span></button>`;
}

function setPressed(group, label) {
  qsa(".tab", group).forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.filter === label)));
}

// Theme: header switch. Saved choice (shared with the portal key) wins, otherwise the system preference.
function initTheme() {
  const root = document.documentElement;
  const KEY = "om-portal:theme";
  const buttons = qsa("[data-theme-toggle]");
  const sync = () => {
    const dark = root.getAttribute("data-theme") === "dark";
    buttons.forEach((b) => {
      if (b.getAttribute("role") === "switch") {
        b.setAttribute("aria-checked", String(dark));
      } else {
        b.setAttribute("aria-pressed", String(dark));
        b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      }
    });
  };
  const apply = (theme, save) => {
    root.setAttribute("data-theme", theme);
    if (save) {
      try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable: theme still applies for this page */ }
    }
    sync();
  };
  buttons.forEach((b) => b.addEventListener("click", () => apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true)));
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (saved !== "light" && saved !== "dark") apply(e.matches ? "dark" : "light", false);
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && (e.newValue === "light" || e.newValue === "dark")) apply(e.newValue, false);
  });
  sync();
}

// Sub-navigation lists come from data.js so desktop dropdown and mobile accordion always match
function initNavMenus() {
  const courseMenu = qs("[data-sub-menu='courses']");
  const schemeMenu = qs("[data-sub-menu='schemes']");
  if (courseMenu) {
    courseMenu.innerHTML = courses.map((c) => `<li><a href="course-details.html?course=${esc(c.slug)}">${esc(c.title)}<small>${esc(c.category)}</small></a></li>`).join("");
  }
  if (schemeMenu) {
    schemeMenu.innerHTML = schemes.map((s) => `<li><a href="scheme-details.html?scheme=${esc(s.slug)}">${esc(s.short)}<small>${esc(s.name)}</small></a></li>`).join("");
  }
}

// Header & drawer
function initMenu() {
  const nav = qs("#site-nav");
  const burger = qs(".hamburger");
  const backdrop = qs(".nav-backdrop");
  const closeBtn = qs(".drawer-close");

  function setOpen(open) {
    if (!nav || !burger || overlays.menu === open) return;
    setOverlay("menu", open);
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) backdrop.hidden = !open;
    // Move focus into the drawer when it opens, and back to the menu button when it closes.
    const target = open ? closeBtn : burger;
    if (target && getComputedStyle(target).display !== "none") target.focus({ preventScroll: true });
  }

  // Accordion (mobile) / click-to-open dropdown (desktop) sub-navigation
  qsa(".sub-toggle, .nav-more-btn", nav || document).forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".has-sub");
      const open = !item.classList.contains("is-open");
      qsa(".has-sub.is-open", nav).forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          qs(".sub-toggle", other).setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".has-sub")) return;
    qsa(".has-sub.is-open", nav || document).forEach((item) => {
      item.classList.remove("is-open");
      qs(".sub-toggle", item).setAttribute("aria-expanded", "false");
    });
  });

  // Keep Tab inside the open sheet
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !overlays.menu || !nav) return;
    const focusable = qsa("a[href], button:not([disabled])", nav).filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Header hairline + shadow once the page has scrolled
  const header = qs(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (burger) burger.addEventListener("click", () => setOpen(!overlays.menu));
  if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
  if (backdrop) backdrop.addEventListener("click", () => setOpen(false));

  // Nav links scroll only after the menu has closed and page scroll is unlocked:
  // a native anchor jump started while body overflow is still hidden gets cancelled.
  qsa(".brand, #site-nav .nav-link, #site-nav .sub-menu a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (overlays.menu && !href.startsWith("#")) setOpen(false);
      // Only same-page "#id" links are intercepted for a smooth scroll; "other-page.html#id"
      // links (used from pages other than index.html) get a normal browser navigation.
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const go = () => {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        history.replaceState(null, "", "#" + id);
      };
      if (overlays.menu) {
        setOpen(false);
        setTimeout(go, 30);
      } else {
        go();
      }
    });
  });

  return { isOpen: () => overlays.menu, close: () => setOpen(false) };
}

// Scroll spy: mark the nav link whose section crosses the middle of the viewport.
function initScrollSpy() {
  if (!("IntersectionObserver" in window)) return;
  const links = qsa("#site-nav .nav-link");
  let active = "home";

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.id === active) return;
      active = entry.target.id;
      links.forEach((link) => {
        const on = link.getAttribute("href") === "#" + active;
        link.classList.toggle("active", on);
        if (on) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  qsa("section[id], footer[id]").forEach((el) => spy.observe(el));
}

// Enquiry modal: any [data-enquire="Course"] or [data-enquire-topic="Notice title"] link opens it.
// Submitting builds a WhatsApp message and opens wa.me in a new tab; the visitor presses Send there.
function initEnquiry(menu) {
  const modal = qs("[data-enquiry]");
  if (!modal) return { isOpen: () => false, close() {} };

  const form = qs("[data-enquiry-form]", modal);
  const sent = qs("[data-enquiry-sent]", modal);
  const closeBtn = qs("[data-enquiry-close]", modal);
  let preset = { course: "", message: "" };
  let trigger = null;

  function fillForm() {
    form.reset();
    form.elements.namedItem("course").value = preset.course;
    form.elements.namedItem("message").value = preset.message;
    form.hidden = false;
    sent.hidden = true;
  }

  function open(nextPreset, from) {
    menu.close();
    preset = nextPreset;
    trigger = from || null;
    fillForm();
    modal.hidden = false;
    modal.scrollTop = 0;
    setOverlay("enquiry", true);
    closeBtn.focus();
  }

  function close() {
    if (modal.hidden) return;
    modal.hidden = true;
    setOverlay("enquiry", false);
    if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-enquire], [data-enquire-topic]");
    if (!link) return;
    event.preventDefault();
    const topic = link.getAttribute("data-enquire-topic");
    open(topic
      ? { course: "", message: "I'd like to know more about: " + topic }
      : { course: link.getAttribute("data-enquire") || "", message: "" }, link);
  });

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  qs("[data-enquiry-again]", modal).addEventListener("click", () => {
    fillForm();
    form.elements.namedItem("name").focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const v = (key) => String(data.get(key) || "").trim();
    const message = [
      "New enquiry from the OM Academy website",
      "Name: " + v("name"),
      "Mobile: " + v("mobile"),
      v("email") && "Email: " + v("email"),
      "Qualification: " + v("qualification"),
      "Course: " + v("course"),
      "Preferred center: " + v("center"),
      v("source") && "Heard about us via: " + v("source"),
      v("message") && "Message: " + v("message"),
      "Wants course updates: " + (v("updates") ? "Yes" : "No"),
    ].filter(Boolean).join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener");
    form.hidden = true;
    sent.hidden = false;
  });

  return { isOpen: () => overlays.enquiry, close };
}

// Announcement popup: a product-style notification dialog. Auto-opens once per new announcement
// (remembered in localStorage) on pages that set data-auto, and opens from any [data-ann-open] control.
function initAnnouncementPopup() {
  const modal = qs("[data-ann-modal]");
  if (!modal) return { isOpen: () => false, close() {} };

  const TAG_ICONS = { IMPORTANT: "megaphone", NOTICE: "calendar", UPDATE: "file", SCHOLARSHIP: "award" };
  const el = {
    icon: qs("[data-pop-icon]", modal),
    tag: qs("[data-pop-tag]", modal),
    time: qs("[data-pop-time]", modal),
    title: qs("[data-pop-title]", modal),
    body: qs("[data-pop-body]", modal),
    media: qs("[data-pop-media]", modal),
    img: qs("[data-pop-img]", modal),
    cta: qs("[data-pop-cta]", modal),
    close: qs("[data-pop-close]", modal),
  };
  const list = announcements.map((a) => Object.assign({}, a, { id: annId(a), tone: tagTones[a.tag] || "blue" }));
  const KEY = "om-seen-announcement";
  let trigger = null;

  function open(a, from) {
    if (!a || !modal.hidden) return;
    trigger = from || null;
    modal.className = "pop-overlay tone-" + a.tone;
    el.icon.innerHTML = icon(TAG_ICONS[a.tag] || "bell", 26);
    el.tag.textContent = a.tag;
    el.time.innerHTML = icon("calendar", 14) + " " + esc(a.date) + (a.time ? " · " + icon("clock", 14) + " " + esc(a.time) : "");
    el.title.textContent = a.title;
    el.body.textContent = a.desc;
    el.media.hidden = !a.image;
    if (a.image) el.img.src = stockPhoto(a.image, 900, 65);
    el.cta.setAttribute("data-enquire-topic", a.title);
    modal.hidden = false;
    setOverlay("announcement", true);
    try { localStorage.setItem(KEY, a.id); } catch { /* storage unavailable */ }
    el.close.focus();
  }

  function close() {
    if (modal.hidden) return;
    modal.classList.add("is-closing");
    setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove("is-closing");
      setOverlay("announcement", false);
      if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    }, 220);
  }

  el.close.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
    else if (event.target.closest("[data-pop-cta], [data-pop-all]")) {
      modal.hidden = true;
      setOverlay("announcement", false);
    }
  });
  // Keep Tab inside the dialog
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const f = qsa("button, a[href]", modal).filter((n) => n.offsetParent !== null);
    if (!f.length) return;
    if (event.shiftKey && document.activeElement === f[0]) { event.preventDefault(); f[f.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === f[f.length - 1]) { event.preventDefault(); f[0].focus(); }
  });
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-ann-open]");
    if (btn) open(list.find((a) => a.id === btn.dataset.annOpen), btn);
  });

  if (modal.hasAttribute("data-auto") && list.length) {
    let seen = null;
    try { seen = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (seen !== list[0].id) {
      setTimeout(() => {
        if (!Object.values(overlays).some(Boolean)) open(list[0]);
      }, 1600);
    }
  }
  return { isOpen: () => overlays.announcement, close };
}

// Announcements: filter tabs, search, the pinned latest notice and the list of earlier notices.
function initAnnouncements() {
  const tabs = qs("[data-ann-tabs]");
  const list = qs("[data-ann-list]");
  const count = qs("[data-ann-count]");
  const search = qs("#ann-search");
  if (!tabs || !list) return;

  const state = { filter: "All", query: "", page: 1 };
  const pageSize = Number(list.dataset.pageSize) || 0;
  const TAG_ICONS = { IMPORTANT: "megaphone", NOTICE: "calendar", UPDATE: "file", SCHOLARSHIP: "award" };
  const items = announcements.map((a, i) => {
    const [day, month, year] = a.date.split(" ");
    return Object.assign({}, a, { id: annId(a), day, month: month.toUpperCase(), year, tone: tagTones[a.tag] || "blue", isNew: i < 3 });
  });
  const inFilter = (a, label) => label === "All" || a.tag === label.toUpperCase();

  const relTime = (a) => {
    const then = new Date(a.date);
    const days = Math.round((Date.now() - then.getTime()) / 86400000);
    if (days < 0) return "Upcoming";
    if (days === 0) return "Today";
    if (days < 14) return days + (days === 1 ? " day ago" : " days ago");
    if (days < 60) return Math.round(days / 7) + " weeks ago";
    return Math.round(days / 30) + " months ago";
  };

  // Featured banner: the latest notice as a layered brand surface
  const bannerHtml = (a) => `
    <article class="feat tone-${a.tone}">
      <div class="feat-glow" aria-hidden="true"></div>
      <div class="feat-body">
        <div class="feat-top">
          <span class="feat-ribbon">${icon("sparkle", 14)} Latest</span>
          <span class="feat-tag">${esc(a.tag)}</span>
          <span class="feat-rel">${esc(relTime(a))}</span>
        </div>
        <h3 class="feat-title">${esc(a.title)}</h3>
        <p class="feat-desc">${esc(a.desc)}</p>
        <div class="feat-actions">
          <button type="button" data-ann-open="${esc(a.id)}" class="btn-pill btn-accent btn-sm">Read more ${ARROW_14}</button>
          <span class="feat-date">${icon("calendar", 15)} ${esc(a.date)}</span>
        </div>
      </div>
      <div class="feat-stamp" aria-hidden="true"><span class="feat-day">${esc(a.day)}</span><span class="feat-mon">${esc(a.month)}</span><span class="feat-yr">${esc(a.year)}</span></div>
    </article>`;

  // Timeline entry: date rail + category dot + expandable detail
  const nodeHtml = (a) => `
    <li class="tl-node tone-${a.tone}">
      <div class="tl-when"><span class="tl-day">${esc(a.day)}</span><span class="tl-mon">${esc(a.month)}</span></div>
      <span class="tl-dot" aria-hidden="true">${icon(TAG_ICONS[a.tag] || "bell", 14)}</span>
      <details class="tl-card">
        <summary>
          <span class="tl-meta"><span class="tl-tag">${esc(a.tag)}</span><span class="tl-date">${esc(a.date)}</span><span class="tl-rel">${esc(relTime(a))}</span>${a.isNew ? '<span class="badge-new">New</span>' : ""}</span>
          <span class="tl-title">${esc(a.title)}</span>
          <span class="tl-excerpt">${esc(a.desc)}</span>
          <span class="tl-chev" aria-hidden="true">${icon("chevronDown", 18)}</span>
        </summary>
        <div class="tl-detail">
          <p>${esc(a.desc)}</p>
          <button type="button" data-ann-open="${esc(a.id)}" class="ann-row-ask">Open announcement ${ARROW_12}</button>
        </div>
      </details>
    </li>`;

  const emptyHtml = `
    <div class="ann-empty">
      <div class="ann-empty-title">No announcements match your search</div>
      <p class="ann-empty-text">Try a different word, or show every category.</p>
      <button type="button" class="btn-pill btn-ghost" data-ann-reset>Show all announcements</button>
    </div>`;

  const pagerHtml = (pages) => {
    if (pages < 2) return "";
    const nums = Array.from({ length: pages }, (_, i) => {
      const n = i + 1;
      return `<button type="button" class="pager-btn${n === state.page ? " is-current" : ""}" data-page="${n}"${n === state.page ? ' aria-current="page"' : ""}>${n}</button>`;
    }).join("");
    return `<nav class="pager" aria-label="Announcement pages">
      <button type="button" class="pager-btn" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="Previous page">${icon("chevronLeft", 16)}</button>
      ${nums}
      <button type="button" class="pager-btn" data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""} aria-label="Next page">${icon("chevronRight", 16)}</button>
    </nav>`;
  };

  const limit = Number(list.dataset.limit) || 0;

  function render() {
    const needle = state.query.trim().toLowerCase();
    const shown = items
      .filter((a) => inFilter(a, state.filter))
      .filter((a) => !needle || (a.title + " " + a.desc + " " + a.tag).toLowerCase().includes(needle));
    if (count) count.textContent = "Showing " + plural(shown.length, "announcement");
    if (!shown.length) {
      list.innerHTML = emptyHtml;
      return;
    }
    const [featured, ...rest] = shown;
    let feed = rest;
    let pager = "";
    if (limit) {
      feed = rest.slice(0, limit);
    } else if (pageSize) {
      const pages = Math.ceil(rest.length / pageSize) || 1;
      state.page = Math.min(state.page, pages);
      feed = rest.slice((state.page - 1) * pageSize, state.page * pageSize);
      pager = pagerHtml(pages);
    }
    list.innerHTML = `<div class="ann-feed">${bannerHtml(featured)}${feed.length ? `<ol class="tl">${feed.map(nodeHtml).join("")}</ol>` : ""}${pager}</div>`;
  }

  // Tabs are built once (their counts don't depend on the search) so keyboard focus survives filtering.
  tabs.innerHTML = announcementFilters
    .map((label) => tabButton(label, items.filter((a) => inFilter(a, label)).length, label === state.filter))
    .join("");

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;
    state.filter = tab.dataset.filter;
    state.page = 1;
    setPressed(tabs, state.filter);
    render();
  });

  if (search) {
    search.addEventListener("input", () => {
      state.query = search.value;
      state.page = 1;
      render();
    });
  }

  list.addEventListener("click", (event) => {
    const pageBtn = event.target.closest("[data-page]");
    if (pageBtn && !pageBtn.disabled) {
      state.page = Number(pageBtn.dataset.page);
      render();
      list.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!event.target.closest("[data-ann-reset]")) return;
    state.filter = "All";
    state.query = "";
    if (search) search.value = "";
    setPressed(tabs, state.filter);
    render();
  });

  render();
}

// Important Dates preview panel: next few upcoming dates, shown beside Announcements
// on the homepage and at the top of announcements.html. Full calendar is initImportantDates().
function initImportantDatesPanel() {
  const list = qs("[data-dates-panel]");
  if (!list) return;

  const rowHtml = (d) => {
    const [day, month, year] = d.date.split(" ");
    return `
      <div class="dates-panel-row tone-${dateTones[d.category] || "blue"}">
        <div class="dates-panel-date">
          <span class="dates-panel-day">${esc(day)}</span>
          <span class="dates-panel-month">${esc(month.toUpperCase())}<br>${esc(year)}</span>
        </div>
        <div class="dates-panel-body">
          <h4 class="dates-panel-title">${esc(d.title)}</h4>
          <div class="dates-panel-meta">${esc(d.date)}${d.time ? ", " + esc(d.time) : ""}</div>
        </div>
      </div>`;
  };

  list.innerHTML = importantDates.slice(0, 4).map(rowHtml).join("");
}

// Important Dates page: a small vanilla-JS month calendar plus a selected-day / upcoming list.
function initImportantDates() {
  const cal = qs("[data-dates-calendar]");
  const list = qs("[data-dates-list]");
  const tabs = qs("[data-dates-tabs]");
  if (!cal || !list) return;

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const items = importantDates.map((d) => {
    const [day, monthAbbr, year] = d.date.split(" ");
    const month = MONTHS.findIndex((m) => m.startsWith(monthAbbr));
    return Object.assign({}, d, { day: Number(day), month, year: Number(year), tone: dateTones[d.category] || "blue" });
  });
  const inFilter = (d, label) => label === "All Dates" || d.category === label;

  const state = { filter: "All Dates", view: new Date(items[0].year, items[0].month, 1), selected: items[0] };

  function itemsOn(day, month, year) {
    return items.filter((d) => inFilter(d, state.filter) && d.day === day && d.month === month && d.year === year);
  }

  function calendarHtml() {
    const y = state.view.getFullYear();
    const m = state.view.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push("");
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);

    const dayHtml = (day) => {
      if (!day) return '<span class="dates-cal-cell dates-cal-empty"></span>';
      const dayItems = itemsOn(day, m, y);
      const isSelected = state.selected && state.selected.day === day && state.selected.month === m && state.selected.year === y;
      const dotTone = dayItems[0] ? dayItems[0].tone : "";
      return `<button type="button" class="dates-cal-cell${isSelected ? " is-selected" : ""}${dayItems.length ? " has-dot" : ""}" data-day="${day}">
        ${day}${dayItems.length ? `<span class="dates-cal-dot tone-${dotTone}" aria-hidden="true"></span>` : ""}
      </button>`;
    };

    return `
      <div class="dates-cal-head">
        <button type="button" class="dates-cal-nav" data-cal-prev aria-label="Previous month">${icon("chevronLeft", 16)}</button>
        <div class="dates-cal-title">${MONTHS[m]} ${y}</div>
        <button type="button" class="dates-cal-nav" data-cal-next aria-label="Next month">${icon("chevronRight", 16)}</button>
      </div>
      <div class="dates-cal-grid dates-cal-dow">${["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => `<span>${d}</span>`).join("")}</div>
      <div class="dates-cal-grid">${cells.map(dayHtml).join("")}</div>`;
  }

  const eventRowHtml = (d) => `
    <div class="dates-row tone-${d.tone}">
      <div class="dates-row-top">
        <h4 class="dates-row-title">${esc(d.title)}</h4>
        <span class="chip chip-sm tone-${d.tone}">${esc(d.category)}</span>
      </div>
      <p class="dates-row-desc">${esc(d.desc)}</p>
      <div class="dates-row-meta">${esc(d.date)}${d.time ? ", " + esc(d.time) : ""}</div>
    </div>`;

  function listHtml() {
    const selectedEvents = state.selected ? itemsOn(state.selected.day, state.selected.month, state.selected.year) : [];
    const upcoming = items
      .filter((d) => inFilter(d, state.filter))
      .filter((d) => new Date(d.year, d.month, d.day) >= new Date(items[0].year, items[0].month, items[0].day))
      .slice(0, 6);

    return `
      ${selectedEvents.length ? `
        <div class="dates-list-head">Events on ${esc(state.selected.date)}</div>
        ${selectedEvents.map(eventRowHtml).join("")}
      ` : ""}
      <div class="dates-list-head">Upcoming Important Dates</div>
      ${upcoming.map(eventRowHtml).join("") || '<div class="ann-only">No upcoming dates in this view.</div>'}`;
  }

  function render() {
    cal.innerHTML = calendarHtml();
    list.innerHTML = listHtml();
  }

  if (tabs) {
    tabs.innerHTML = importantDateFilters
      .map((label) => tabButton(label, items.filter((d) => inFilter(d, label)).length, label === state.filter))
      .join("");
    tabs.addEventListener("click", (event) => {
      const tab = event.target.closest(".tab");
      if (!tab) return;
      state.filter = tab.dataset.filter;
      setPressed(tabs, state.filter);
      render();
    });
  }

  cal.addEventListener("click", (event) => {
    const prev = event.target.closest("[data-cal-prev]");
    const next = event.target.closest("[data-cal-next]");
    const dayBtn = event.target.closest("[data-day]");
    if (prev) state.view = new Date(state.view.getFullYear(), state.view.getMonth() - 1, 1);
    else if (next) state.view = new Date(state.view.getFullYear(), state.view.getMonth() + 1, 1);
    else if (dayBtn) state.selected = { day: Number(dayBtn.dataset.day), month: state.view.getMonth(), year: state.view.getFullYear(), date: [Number(dayBtn.dataset.day), MONTHS[state.view.getMonth()].slice(0, 3), state.view.getFullYear()].join(" ") };
    else return;
    render();
  });

  render();
}

const annId = (a) => (a.date + "-" + a.title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
const stars = (n) => `<span class="rating" aria-label="Rated ${n} out of 5">${icon("star", 13, "icon-fill")} ${n}</span>`;

// Course details page (course-details.html?course=<slug>): tabbed overview + "Related Courses" sidebar.
function initCourseDetails() {
  const root = qs("[data-course-detail]");
  if (!root) return;

  const slug = new URLSearchParams(location.search).get("course");
  const course = courses.find((c) => c.slug === slug) || courses[0];
  if (!course) return;

  document.title = course.title + " | OM Academy";
  const TABS = [["overview", "Overview", "file"], ["curriculum", "Curriculum", "book"], ["instructor", "Instructor", "users"], ["reviews", "Reviews", "star"], ["faqs", "FAQs", "info"]];
  const check = (text) => `<div class="cd-learn-item"><span class="icon-tile-sm tone-${course.tone}">${icon("check", 14)}</span><span>${esc(text)}</span></div>`;

  const panels = {
    overview: `
      <h2 class="cd-h2">About This Course</h2>
      <p class="cd-summary">${esc(course.summary)}</p>
      <div class="cd-highlights">
        ${course.highlights.map((h) => `<div class="cd-highlight"><span class="icon-circle tone-${course.tone}">${icon("shield", 20)}</span><span>${esc(h)}</span></div>`).join("")}
      </div>
      <h2 class="cd-h2">What You Will Learn</h2>
      <div class="cd-learn-grid">${course.learn.map(check).join("")}</div>`,
    curriculum: `
      <h2 class="cd-h2">Curriculum</h2>
      <ol class="cd-modules">${course.learn.map((l, i) => `<li><span class="cd-module-n">${i + 1}</span><span>${esc(l)}</span></li>`).join("")}</ol>`,
    instructor: `
      <h2 class="cd-h2">Instructor</h2>
      <p class="cd-summary">Trained by OM Academy's certified faculty with hands-on lab experience. Instructor profiles will be listed here once confirmed by the academy.</p>`,
    reviews: `
      <h2 class="cd-h2">Student Reviews</h2>
      <p class="cd-summary">${course.rating ? `Rated <strong>${course.rating} / 5</strong> by ${course.reviews} students.` : "Reviews will appear here."}</p>`,
    faqs: `
      <h2 class="cd-h2">Frequently Asked Questions</h2>
      <p class="cd-summary">Eligibility, fees and batch timings vary by centre. <a href="#enquire" data-enquire="${esc(course.title)}">Ask our counsellor</a> for the latest details.</p>`,
  };

  root.innerHTML = `
    <div class="cd-hero tone-${course.tone}">
      <span class="chip tone-${course.tone}">${esc(course.category)}</span>
      <h1 class="cd-title">${esc(course.title)}</h1>
      <div class="cd-meta">
        ${course.rating ? `<span class="cd-meta-item">${stars(course.rating)} (${course.reviews})</span>` : ""}
        ${course.hours ? `<span class="cd-meta-item">${icon("clock", 15)} ${course.hours} Hours</span>` : ""}
        ${course.students ? `<span class="cd-meta-item">${icon("users", 15)} ${esc(course.students)} Students</span>` : ""}
      </div>
    </div>
    <div class="cd-tabs" role="tablist" aria-label="Course sections">
      ${TABS.map(([id, label, ic], i) => `<button type="button" role="tab" class="cd-tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${id}">${icon(ic, 16)}<span>${label}</span></button>`).join("")}
    </div>
    ${TABS.map(([id], i) => `<div role="tabpanel" class="cd-panel" id="panel-${id}" aria-labelledby="tab-${id}" ${i ? "hidden" : ""}>${panels[id]}</div>`).join("")}
    <a href="#enquire" data-enquire="${esc(course.title)}" class="btn-pill btn-primary cd-enquire">Enquire About This Course ${icon("arrow", 14)}</a>`;

  const tabs = qsa(".cd-tab", root);
  const select = (id, focus) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    qsa(".cd-panel", root).forEach((p) => { p.hidden = p.id !== "panel-" + id; });
  };
  root.addEventListener("click", (event) => {
    const tab = event.target.closest(".cd-tab");
    if (tab) select(tab.dataset.tab);
  });
  root.addEventListener("keydown", (event) => {
    const i = tabs.findIndex((t) => t === document.activeElement);
    if (i < 0 || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    select(tabs[next].dataset.tab, true);
  });

  const related = qs("[data-related-courses]");
  if (!related) return;
  const others = courses.filter((c) => c.slug !== course.slug && c.category === course.category);
  const rest = courses.filter((c) => c.slug !== course.slug && !others.includes(c));
  related.innerHTML = others.concat(rest).slice(0, 3).map((c, i) => `
    <a href="course-details.html?course=${esc(c.slug)}" class="rc-card card-lift tone-${c.tone}">
      <span class="rc-media"><img src="${stockPhoto(RELATED_PHOTOS[i % RELATED_PHOTOS.length], 240, 60)}" alt="" loading="lazy" width="96" height="96"></span>
      <span class="rc-body">
        <span class="chip chip-sm tone-${c.tone}">${esc(c.category)}</span>
        <span class="rc-title">${esc(c.title)}</span>
        <span class="rc-meta">${c.rating ? stars(c.rating) : ""}${c.hours ? `<span>${icon("clock", 12)} ${c.hours} Hours</span>` : ""}${c.students ? `<span>${icon("users", 12)} ${esc(c.students)} Students</span>` : ""}</span>
        <span class="rc-link">View Course ${icon("arrow", 12)}</span>
      </span>
    </a>`).join("");
}

const RELATED_PHOTOS = ["1569653402334-2e98fbaa80ee", "1657812670261-7b76ba04525c", "1522071820081-009f0129c71c"];

// Scheme cards (homepage "Our Key Skill Development Programmes" and schemes.html)
function initSchemeCards() {
  qsa("[data-scheme-cards]").forEach((host) => {
    host.innerHTML = schemes.map((s, i) => `
      <article class="scheme-card card-lift fu${i ? " delay-" + i * 80 : ""} tone-${s.tone}">
        <div class="scheme-media"><img src="${stockPhoto(s.photo, 600, 60)}" alt="" loading="lazy" width="600" height="338"></div>
        <div class="scheme-body">
          <div class="scheme-short">${esc(s.short)}</div>
          <div class="scheme-authority">${esc(s.name)}</div>
          <span class="badge">${esc(s.tag)}</span>
          <ul class="scheme-points">${s.highlights.map((h) => `<li>${icon("check", 14)}<span>${esc(h)}</span></li>`).join("")}</ul>
          <a href="scheme-details.html?scheme=${esc(s.slug)}" class="btn-pill btn-primary btn-sm scheme-cta">${s.slug === "other-skill" ? "Explore Courses" : "View Details"} ${icon("arrow", 14)}</a>
        </div>
      </article>`).join("");
  });
}

// "Popular Job Roles & Training Domains": bento grid of photo tiles (first tile is the featured one)
function initJobRoles() {
  const host = qs("[data-job-roles]");
  if (!host) return;
  host.innerHTML = jobRoles.map((r, i) => `
    <a href="${esc(r.href)}" class="role-tile role-tile-${i + 1}">
      <img src="${stockPhoto(r.photo, i === 0 ? 900 : 600, 60)}" alt="" loading="lazy" width="600" height="420">
      <span class="role-scrim" aria-hidden="true"></span>
      <span class="role-icon">${icon(r.icon, 20)}</span>
      <span class="role-content">
        <span class="role-title">${esc(r.title)}</span>
        <span class="role-blurb">${esc(r.blurb)}</span>
        ${r.tags ? `<span class="role-tags">${r.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</span>` : ""}
      </span>
      <span class="role-go" aria-hidden="true">${icon("arrow", 18)}</span>
    </a>`).join("");
}

// Scheme details page (scheme-details.html?scheme=<slug>): compact hero, key-facts strip, content column
// and a sticky enquiry card.
function initSchemeDetails() {
  const root = qs("[data-scheme-detail]");
  if (!root) return;

  const slug = new URLSearchParams(location.search).get("scheme");
  const s = schemes.find((x) => x.slug === slug) || schemes[0];
  document.title = s.short + " | OM Academy";
  const TILE_ICONS = ["building", "layers", "gradcap", "briefcase"];
  const JOURNEY = [["search", "Explore", "Find the right course"], ["file", "Enrol", "Complete admission"], ["book", "Learn", "Hands-on training"], ["award", "Certify", "Get certified"], ["briefcase", "Career", "Get placed"]];
  const WHY = [["sparkle", "Focused training"], ["layers", "Practical skills"], ["building", "Industry-relevant"], ["briefcase", "Career-oriented"], ["shield", "Government-supported"]];
  const pill = (status) => `<span class="status-pill ${status === "Available" ? "is-available" : "is-upcoming"}">${esc(status)}</span>`;
  const other = schemes.filter((x) => x.slug !== s.slug);

  root.innerHTML = `
    <section class="sd-hero">
      <div class="sd-hero-copy">
        <span class="sd-badge">${esc(s.tag)}</span>
        <h1 class="sd-hero-title">${esc(s.short)}</h1>
        <p class="sd-hero-name">${esc(s.name)}</p>
        <p class="sd-hero-lead">${icon("building", 16)} ${esc(s.authority)}</p>
        <div class="sd-hero-ctas">
          <a href="#careers" class="btn-pill btn-primary">Explore courses ${icon("arrow", 16)}</a>
          <a href="#enquire" data-enquire="${esc(s.short)}" class="btn-pill btn-outline-light">Enquire now</a>
        </div>
      </div>
      <figure class="sd-hero-media"><img src="${stockPhoto(s.photo, 900, 65)}" alt="" width="900" height="600"></figure>
    </section>

    <div class="sd-stats">${s.tiles.map(([t, d], i) => `<div class="sd-stat tone-${["blue", "green", "purple", "amber"][i % 4]}"><span class="icon-circle">${icon(TILE_ICONS[i], 20)}</span><div><div class="sd-tile-title">${esc(t)}</div><div class="sd-tile-desc">${esc(d)}</div></div></div>`).join("")}</div>

    <div class="sd-layout">
      <div class="sd-main">
        <section class="sd-section sd-first">
          <h2 class="sd-h2">About ${esc(s.short)}</h2>
          <p class="cd-summary">${esc(s.summary)}</p>
        </section>

        <section class="sd-section" id="careers">
          <h2 class="sd-h2">Choose your career path</h2>
          <p class="cd-summary">${s.careerCourses.length} specialised courses to start a rewarding career.</p>
          <div class="sd-careers">${s.careerCourses.map((c) => `
            <article class="career-card card-lift">
              <div class="career-media"><img src="${stockPhoto(c.photo, 480, 60)}" alt="" loading="lazy" width="480" height="300"></div>
              <div class="career-body">
                <h3 class="career-title">${esc(c.name)}</h3>
                <p class="career-desc">${esc(c.desc)}</p>
                <a href="#enquire" data-enquire="${esc(c.name)}" class="course-link">View course ${icon("arrow", 14)}</a>
              </div>
            </article>`).join("")}</div>
        </section>

        <section class="sd-section">
          <h2 class="sd-h2">Training to career, step by step</h2>
          <ol class="sd-journey">${JOURNEY.map(([ic, t, d], i) => `<li class="sd-step tone-${["blue", "green", "amber", "purple", "rust"][i % 5]}"><span class="sd-step-icon"><span class="icon-circle">${icon(ic, 26)}</span><span class="sd-step-n">${i + 1}</span></span><div class="sd-step-title">${t}</div><div class="sd-step-desc">${d}</div></li>`).join("")}</ol>
        </section>

        <section class="sd-section">
          <h2 class="sd-h2">Available training batches</h2>
          <div class="table-wrap"><table class="batch-table">
            <thead><tr><th>Course</th><th>Batch 1</th><th>Batch 2</th><th>Batch 3</th><th>Batch 4</th><th>Status</th></tr></thead>
            <tbody>${s.batches.map(([name, b1, b2, b3, b4, status]) => `<tr><th scope="row">${esc(name)}</th><td>${b1}</td><td>${b2}</td><td>${b3}</td><td>${b4}</td><td>${pill(status)}</td></tr>`).join("")}</tbody>
          </table></div>
        </section>

        <section class="sd-section">
          <h2 class="sd-h2">Why choose ${esc(s.short)}?</h2>
          <div class="sd-why">${WHY.map(([ic, t], i) => `<div class="sd-why-item tone-${["blue", "green", "purple", "amber", "rust"][i % 5]}"><span class="icon-circle">${icon(ic, 20)}</span><span>${t}</span></div>`).join("")}</div>
        </section>

        <section class="sd-section">
          <h2 class="sd-h2">Explore other schemes</h2>
          <div class="sd-others">${other.map((o) => `<a href="scheme-details.html?scheme=${esc(o.slug)}" class="sd-other card-lift"><span class="sd-other-short">${esc(o.short)}</span><span class="sd-other-name">${esc(o.name)}</span><span class="rc-link">View scheme ${icon("arrow", 12)}</span></a>`).join("")}</div>
        </section>
      </div>

      <aside class="sd-aside">
        <div class="sd-card">
          <div class="sd-card-title">Interested in ${esc(s.short)}?</div>
          <p class="sd-card-text">Talk to a counsellor about eligibility, fees and the next batch.</p>
          <a href="#enquire" data-enquire="${esc(s.short)}" class="btn-pill btn-primary sd-card-cta">Enquire now ${icon("arrow", 16)}</a>
          <div class="sd-card-alt">
            <a href="tel:+919992887708" class="btn-pill btn-ghost btn-sm">${icon("phone", 16)} Call</a>
            <a href="https://wa.me/919992887708" target="_blank" rel="noopener" class="btn-pill btn-ghost btn-sm">WhatsApp</a>
          </div>
          <div class="sd-card-sep"></div>
          <div class="sd-card-sub">${icon("users", 16)} Who can apply</div>
          <ul class="sd-eligibility">${s.eligibility.map((e) => `<li>${icon("check", 14)}<span>${esc(e)}</span></li>`).join("")}</ul>
        </div>
      </aside>
    </div>`;
}

// Lightbox: pages through the photos that were visible in the gallery when it opened.
function initLightbox() {
  const box = qs("[data-lightbox]");
  if (!box) return { isOpen: () => false, open() {}, close() {}, step() {} };

  const el = {
    counter: qs("[data-lb-counter]", box),
    title: qs("[data-lb-title]", box),
    img: qs("[data-lb-img]", box),
    tag: qs("[data-lb-tag]", box),
    captionTitle: qs("[data-lb-caption-title]", box),
    caption: qs("[data-lb-caption]", box),
    thumbs: qs("[data-lb-thumbs]", box),
    close: qs("[data-lb-close]", box),
  };
  const state = { list: [], pos: 0, zoom: 1, expanded: false };
  let trigger = null;

  function render() {
    const item = state.list[state.pos];
    if (!item) return;
    el.counter.textContent = state.pos + 1 + " / " + state.list.length;
    el.title.textContent = item.title;
    el.img.src = item.full;
    el.img.alt = item.title;
    el.img.style.transform = "scale(" + state.zoom + ")";
    el.tag.className = "lb-tag tone-" + item.tone;
    el.tag.textContent = item.tag;
    el.captionTitle.textContent = item.title;
    el.caption.textContent = item.caption;
    qsa(".lb-thumb-btn", el.thumbs).forEach((btn, i) => btn.setAttribute("aria-current", String(i === state.pos)));
    box.classList.toggle("is-expanded", state.expanded);
  }

  function show(pos) {
    state.pos = pos;
    state.zoom = 1;
    render();
  }

  function step(delta) {
    const n = state.list.length;
    if (n) show((state.pos + delta + n) % n);
  }

  function open(list, index, from) {
    state.list = list;
    state.pos = Math.max(0, list.findIndex((g) => g.index === index));
    state.zoom = 1;
    state.expanded = false;
    trigger = from || null;
    el.thumbs.innerHTML = list
      .map((g, i) => `<button type="button" class="lb-thumb-btn" data-pos="${i}" aria-label="Show ${esc(g.title)}" aria-current="false"><img class="lb-thumb" src="${esc(g.thumb)}" alt="" loading="lazy"></button>`)
      .join("");
    render();
    box.hidden = false;
    setOverlay("lightbox", true);
    el.close.focus();
  }

  function close() {
    if (box.hidden) return;
    box.hidden = true;
    setOverlay("lightbox", false);
    if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  }

  el.close.addEventListener("click", close);
  qs("[data-lb-prev]", box).addEventListener("click", () => step(-1));
  qs("[data-lb-next]", box).addEventListener("click", () => step(1));
  qs("[data-lb-zoom-in]", box).addEventListener("click", () => {
    state.zoom = Math.min(2, state.zoom + 0.5);
    render();
  });
  qs("[data-lb-zoom-out]", box).addEventListener("click", () => {
    state.zoom = Math.max(1, state.zoom - 0.5);
    render();
  });
  qs("[data-lb-expand]", box).addEventListener("click", () => {
    state.expanded = !state.expanded;
    render();
  });
  el.thumbs.addEventListener("click", (event) => {
    const btn = event.target.closest(".lb-thumb-btn");
    if (btn) show(Number(btn.dataset.pos));
  });

  return { isOpen: () => overlays.lightbox, open, close, step };
}

// Gallery: filter tabs and the photo grid; a card opens the lightbox on the filtered photos.
function initGallery(lightbox) {
  const tabs = qs("[data-gallery-tabs]");
  const grid = qs("[data-gallery-grid]");
  const count = qs("[data-gallery-count]");
  if (!tabs || !grid) return;

  const pageSize = Number(grid.dataset.pageSize) || 0;
  const more = qs("[data-gallery-more]");
  const sort = qs("[data-gallery-sort]");
  const state = { filter: "All", limit: pageSize || Infinity, oldest: false };
  const inFilter = (g, label) => label === "All" || g.group === label;
  const shown = () => {
    const list = galleryItems.filter((g) => inFilter(g, state.filter));
    return state.oldest ? list.slice().reverse() : list;
  };

  const cardHtml = (g, i) => `
    <button type="button" class="gallery-card card-lift fu${i ? " delay-" + i * 60 : ""}" data-photo="${g.index}" aria-label="View photo: ${esc(g.title)}">
      <span class="gallery-card-media"><img src="${esc(g.card)}" alt="${esc(g.title)}" loading="lazy" decoding="async" width="600" height="450"></span>
      <span class="gallery-card-body">
        <span class="gallery-card-tag tone-${g.tone}">${esc(g.tag)}</span>
        <span class="gallery-card-title">${esc(g.title)}</span>
      </span>
    </button>`;

  function render() {
    const list = shown();
    if (count) count.textContent = plural(list.length, "photo");
    grid.innerHTML = list.slice(0, state.limit).map(cardHtml).join("");
    if (more) more.hidden = list.length <= state.limit;
  }

  tabs.innerHTML = galleryFilters
    .map((label) => tabButton(label, galleryItems.filter((g) => inFilter(g, label)).length, label === state.filter))
    .join("");

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;
    state.filter = tab.dataset.filter;
    state.limit = pageSize || Infinity;
    setPressed(tabs, state.filter);
    render();
  });

  if (more) {
    more.addEventListener("click", () => {
      state.limit += pageSize;
      render();
    });
  }
  if (sort) {
    sort.addEventListener("change", () => {
      state.oldest = sort.value === "oldest";
      render();
    });
  }

  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-photo]");
    if (card) lightbox.open(shown(), Number(card.dataset.photo), card);
  });

  render();
}

// WhatsApp "get updates" links use the number from data.js
function initWhatsappLinks() {
  qsa("[data-whatsapp-updates]").forEach((link) => {
    link.href = whatsappUrl(WHATSAPP_UPDATES_TEXT);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavMenus();
  const menu = initMenu();
  initScrollSpy();
  const enquiry = initEnquiry(menu);
  const popup = initAnnouncementPopup();
  const lightbox = initLightbox();
  initAnnouncements();
  initImportantDatesPanel();
  initImportantDates();
  initCourseDetails();
  initSchemeDetails();
  initSchemeCards();
  initJobRoles();
  initGallery(lightbox);
  initWhatsappLinks();

  // Escape closes whichever overlay is on top; arrow keys step through the lightbox.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (lightbox.isOpen()) lightbox.close();
      else if (enquiry.isOpen()) enquiry.close();
      else if (popup.isOpen()) popup.close();
      else if (menu.isOpen()) menu.close();
    } else if (lightbox.isOpen() && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      lightbox.step(event.key === "ArrowRight" ? 1 : -1);
    }
  });
});
