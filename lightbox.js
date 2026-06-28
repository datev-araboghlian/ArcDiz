// Image lightbox: opens any project image in a fullscreen overlay with
// prev/next navigation, counter, ESC/arrow-key support, and click-outside
// to close. Auto-initialises on DOM ready by collecting all images that
// belong to project image containers (cp-img-card, cp-stage2-tall-img,
// cp-stage2-short-img, featured images, floor plans, arsh-grid-item).

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var selector = [
            '.project-featured-image img',
            '.arsh-floorplan img',
            '.cp-img-card img',
            '.cp-stage2-tall-img img',
            '.cp-stage2-short-img img',
            '.arsh-grid-item img'
        ].join(', ');

        var images = Array.prototype.slice.call(document.querySelectorAll(selector));
        if (!images.length) return;

        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = [
            '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>',
            '<button type="button" class="lightbox-prev" aria-label="Previous image">&#10094;</button>',
            '<button type="button" class="lightbox-next" aria-label="Next image">&#10095;</button>',
            '<div class="lightbox-counter" aria-live="polite"></div>',
            '<figure class="lightbox-figure">',
            '    <img class="lightbox-img" alt="">',
            '</figure>'
        ].join('');
        document.body.appendChild(overlay);

        var imgEl = overlay.querySelector('.lightbox-img');
        var counterEl = overlay.querySelector('.lightbox-counter');
        var closeBtn = overlay.querySelector('.lightbox-close');
        var prevBtn = overlay.querySelector('.lightbox-prev');
        var nextBtn = overlay.querySelector('.lightbox-next');

        var currentIndex = 0;
        var isOpen = false;

        function update() {
            var src = images[currentIndex].src;
            // Project pages display 1800px-wide thumbnails from .../display/ to keep
            // page weight low; when the lightbox opens we want the full-resolution
            // original (one level up from the display/ folder) for maximum zoom quality.
            var fullSrc = src.replace('/display/', '/');
            var alt = images[currentIndex].alt || '';
            imgEl.src = fullSrc;
            imgEl.alt = alt;
            counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;
        }

        function open(index) {
            currentIndex = index;
            update();
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lightbox-locked');
            isOpen = true;
        }

        function close() {
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-locked');
            isOpen = false;
        }

        function next() {
            currentIndex = (currentIndex + 1) % images.length;
            update();
        }

        function prev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            update();
        }

        images.forEach(function (img, i) {
            img.classList.add('lightbox-trigger');
            img.addEventListener('click', function (e) {
                e.preventDefault();
                open(i);
            });
        });

        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            close();
        });
        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            prev();
        });
        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            next();
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay || e.target.classList.contains('lightbox-figure')) {
                close();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (!isOpen) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'ArrowLeft') prev();
        });

        // Basic touch swipe support for mobile.
        var touchStartX = null;
        overlay.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
        }, { passive: true });
        overlay.addEventListener('touchend', function (e) {
            if (touchStartX === null) return;
            var dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) next();
                else prev();
            }
            touchStartX = null;
        });
    });
})();
