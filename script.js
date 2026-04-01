document.addEventListener('DOMContentLoaded', function () {
    window.scrollTo(0, 0);

    /* Header scale: 1 at 1440px, 1.125 at 2560px (25% smaller than 1.5), 0.7 on phones; updates on resize */
    function setHeaderScale() {
        var w = window.innerWidth;
        var scale = 1;
        if (w <= 380) {
            scale = 0.7;
        } else if (w < 1440) {
            scale = 0.7 + (w - 380) * 0.3 / 1060;
        } else if (w < 2560) {
            scale = 1 + (w - 1440) * 0.125 / 1120;
        } else {
            scale = 1.125;
        }
        document.documentElement.style.setProperty('--header-scale', String(scale));
    }
    setHeaderScale();
    window.addEventListener('resize', setHeaderScale);

    /* GIF triggers: set to false to hide that GIF. Easy to extend for layout/appearance per GIF later. */
    var GIF_TRIGGERS = {
        1: true,
        2: true,
        3: true,
        4: false,
        5: false,
        6: true
    };

    document.querySelectorAll('.block-gif[data-gif-id]').forEach(function (el) {
        var id = parseInt(el.getAttribute('data-gif-id'), 10);
        if (GIF_TRIGGERS[id] === false) {
            el.style.display = 'none';
        }
    });

    var header = document.querySelector('header');
    var nav = document.querySelector('.header-nav');
    var menuBtn = document.querySelector('.header-menu-btn');
    var dropdown = document.querySelector('.header-dropdown');
    var overlay = document.querySelector('.color-multiply-overlay');
    var defaultOverlayOuterColor = '#ece3df';
    var accessibilityMode = false;

    var cursorCircle = document.createElement('div');
    cursorCircle.className = 'color-multiply-cursor';
    cursorCircle.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorCircle);

    function isClickable(el) {
        if (!el || !el.closest) return false;
        return el.tagName === 'A' || el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' ||
            el.closest('a, button, [role="button"], input[type="submit"], .header-title, .header-nav, .header-dropdown, .member-button, .page-end-btn');
    }

    var cursorX = 0;
    var cursorY = 0;
    var cursorTickScheduled = false;

    function updateCursor() {
        cursorTickScheduled = false;
        cursorCircle.style.left = cursorX + 'px';
        cursorCircle.style.top = cursorY + 'px';
        var elements = document.elementsFromPoint(cursorX, cursorY);
        var overClickable = false;
        for (var i = 0; i < elements.length; i++) {
            if (isClickable(elements[i])) {
                overClickable = true;
                break;
            }
        }
        if (overClickable) {
            cursorCircle.classList.add('over-clickable');
        } else {
            cursorCircle.classList.remove('over-clickable');
        }
    }

    document.addEventListener('mousemove', function (e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (!cursorTickScheduled) {
            cursorTickScheduled = true;
            requestAnimationFrame(updateCursor);
        }
    }, { passive: true });

    var wrapBreakpoint = 0;

    function checkNavWrap() {
        if (!header || !nav) return;
        var titleEl = header.querySelector('.header-title');
        if (header.classList.contains('header-nav-wrapped')) {
            if (header.offsetWidth > wrapBreakpoint + 40) {
                header.classList.remove('header-nav-wrapped');
            }
            return;
        }
        var children = nav.children;
        var totalWidth = 0;
        for (var i = 0; i < children.length; i++) {
            totalWidth += children[i].offsetWidth;
        }
        var gapStyle = getComputedStyle(nav).gap;
        var gapPx = parseFloat(gapStyle) || 0;
        var totalNeeded = totalWidth + gapPx * (children.length - 1);
        var paddingLeft = parseFloat(getComputedStyle(header).paddingLeft) || 0;
        var paddingRight = parseFloat(getComputedStyle(header).paddingRight) || 0;
        var availableForNav = header.offsetWidth - (titleEl ? titleEl.offsetWidth : 0) - paddingLeft - paddingRight;
        if (totalNeeded > availableForNav - 24) {
            wrapBreakpoint = header.offsetWidth || window.innerWidth;
            header.classList.add('header-nav-wrapped');
        }
    }

    function debounce(fn, ms) {
        var t;
        return function () {
            clearTimeout(t);
            t = setTimeout(fn, ms);
        };
    }
    window.addEventListener('resize', debounce(checkNavWrap, 50));
    checkNavWrap();

    function setOverlayOuterColor(color) {
        if (!overlay) return;
        overlay.style.setProperty('--overlay-outer-color', color);
    }

    function toggleAccessibilityOverlay() {
        if (!overlay) return;
        accessibilityMode = !accessibilityMode;
        if (accessibilityMode) {
            setOverlayOuterColor('#ffffff');
        } else {
            setOverlayOuterColor(defaultOverlayOuterColor);
        }
    }

    function scrollToGetInTouch() {
        var target = document.querySelector('.page-end-btn');
        var headerEl = document.querySelector('header');
        if (!target || !headerEl) return;
        var rect = target.getBoundingClientRect();
        var offset = headerEl.offsetHeight || 0;
        var top = rect.top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }

    var accessibilityButtons = document.querySelectorAll('.header-accessibility-toggle');
    if (accessibilityButtons && accessibilityButtons.length) {
        accessibilityButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                toggleAccessibilityOverlay();
            });
        });
    }

    var NAV_ROUTES = {
        'About': 'about.html',
        'Methodology': 'methodology.html',
        'Get in Touch': 'get-in-touch.html',
        'Become a Member': 'become-a-member.html'
    };

    function attachNavHandlers() {
        var navItems = document.querySelectorAll('.header-nav span, .header-dropdown span');
        navItems.forEach(function (el) {
            var text = el.textContent.trim();
            if (el.classList.contains('header-accessibility-toggle')) return;
            if (text === 'EN / JP') return;
            if (text === 'Get in Touch') {
                el.addEventListener('click', function () {
                    // On pages with a footer Get in Touch box, scroll to it instead of navigating away.
                    if (document.querySelector('.page-end-btn')) {
                        scrollToGetInTouch();
                    } else {
                        window.location.href = 'get-in-touch.html';
                    }
                });
                return;
            }
            var route = NAV_ROUTES[text];
            if (!route) return;
            el.addEventListener('click', function () {
                window.location.href = route;
            });
        });
    }

    attachNavHandlers();

    var titleEl = document.querySelector('.header-title');
    if (titleEl) {
        titleEl.style.cursor = 'pointer';
        titleEl.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

    var memberButtons = document.querySelectorAll('.page-end-btn');
    memberButtons.forEach(function (btn) {
        var href = btn.getAttribute('href') || '';
        // Let external links (like Calendly) use their own href without JS overriding them.
        if (/^https?:\/\//i.test(href)) {
            return;
        }
        var t = btn.textContent.trim();
        if (t === 'Get in Touch') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'get-in-touch.html';
            });
        } else if (t === 'Become a member' || t === 'Become a Member') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'become-a-member.html';
            });
        }
    });


    if (menuBtn && dropdown) {
        menuBtn.addEventListener('click', function () {
            var open = dropdown.classList.toggle('is-open');
            menuBtn.setAttribute('aria-expanded', open);
            dropdown.setAttribute('aria-hidden', !open);
        });
        document.addEventListener('click', function (e) {
            if (dropdown.classList.contains('is-open') && !dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                dropdown.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /* Contact box QR overlay: show QR inside the small Signal / Line boxes */
    (function () {
        var signalCell = document.querySelector('.contact-box-bottom-signal');
        var lineCell = document.querySelector('.contact-box-bottom-line');
        if (!signalCell && !lineCell) return;

        function attachHover(cell) {
            var overlay = cell.querySelector('.contact-box-qr-overlay');
            if (!overlay) return;
            cell.addEventListener('mouseenter', function () {
                overlay.style.opacity = '1';
            });
            cell.addEventListener('mouseleave', function () {
                overlay.style.opacity = '0';
            });
        }

        if (signalCell) attachHover(signalCell);
        if (lineCell) attachHover(lineCell);
    })();
});
