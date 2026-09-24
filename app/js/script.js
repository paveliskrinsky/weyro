"use strict";

document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.js-toggle, .js-parent-toggle');
    if (toggle) {
        if (toggle.classList.contains('js-parent-toggle')) {
            toggle.parentNode.classList.toggle('active');
        } else {
            toggle.classList.toggle('active');
        }
        e.preventDefault();
    }
});

function tabs() {
    document.querySelectorAll('.js-tabs').forEach(container => {
        const tabs = container.querySelectorAll("[data-tab-id]");
        const bodies = container.querySelectorAll("[data-body-id]");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const id = tab.dataset.tabId;
                tabs.forEach(tabItem => {
                    tabItem.classList.remove("active");
                });
                bodies.forEach(bodyItem => {
                    bodyItem.classList.remove("active");
                });
                container.querySelector(`[data-tab-id="${id}"]`).classList.add("active");
                container.querySelectorAll(`[data-body-id="${id}"]`).forEach(bodyItem => {
                    bodyItem.classList.add("active");
                });
            });
        });
    });
}

function tel() {
    document.querySelectorAll('[type=tel]').forEach(tel => {
        IMask(tel, '+{7} (000) 000-00-00');
    });
}

function header() {
    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.closest('.js-burger-open')) {
            document.body.classList.toggle('burger-opened');
            e.preventDefault();
        }

        if (target.closest('.js-burger-close')) {
            document.body.classList.remove('burger-opened');
            e.preventDefault();
        }

        // Ссылка-якорь в мобильном меню: закрываем меню, а переход к секции оставляем браузеру
        if (target.closest('.js-anchor')) {
            document.body.classList.remove('burger-opened');
        }
    });
}

function notify() {
    const key = 'notifyClosedUntil';
    const week = 7 * 24 * 60 * 60 * 1000;

    let closed = false;
    try {
        closed = Date.now() < Number(localStorage.getItem(key));
    } catch (err) { }

    if (!closed) {
        document.querySelectorAll('.js-notify').forEach(el => el.classList.add('active'));
    }

    document.addEventListener('click', (e) => {
        const close = e.target.closest('.js-notify-close');
        if (!close) return;

        const container = close.closest('.js-notify');
        if (container) container.classList.remove('active');
        try {
            localStorage.setItem(key, Date.now() + week);
        } catch (err) { }
        e.preventDefault();
    });
}

function platform() {
    document.querySelectorAll('.platform').forEach(container => {

    });
}

function times() {
    const desktop = window.matchMedia('(min-width: 798px)');

    document.querySelectorAll('.js-times').forEach(container => {
        const slides = container.querySelectorAll('.times__slide');
        const swiper = new Swiper(container.querySelector('.swiper'), {
            slidesPerView: 'auto',
            spaceBetween: 20,
            pagination: {
                el: container.querySelector('.times__pagination'),
                clickable: true,
            },
            navigation: {
                prevEl: container.querySelector('.times__nav-button_prev'),
                nextEl: container.querySelector('.times__nav-button_next'),
            },
        });

        swiper.on('click', (s) => {
            const slide = s.clickedSlide;
            const index = s.clickedIndex;
            if (!desktop.matches || !slide || slide.classList.contains('active')) return;

            slides.forEach(item => item.classList.remove('active'));
            slide.classList.add('active');

            let timer;
            const onEnd = (e) => {
                if (e && (e.target !== slide || e.propertyName !== 'width')) return;
                slide.removeEventListener('transitionend', onEnd);
                clearTimeout(timer);
                swiper.update();
                swiper.slideTo(index);
            };
            slide.addEventListener('transitionend', onEnd);
            timer = setTimeout(onEnd, 400);
        });
    });
}

function expandSlider(container, block, gap = 20) {
    const desktop = window.matchMedia('(min-width: 798px)');
    const desktopGap = 20;
    const el = container.querySelector('.swiper');
    const slides = container.querySelectorAll(`.${block}__slide`);

    const offsetAfter = () => {
        if (!desktop.matches) return 0;
        const slideWidth = slides[0].offsetWidth;
        return Math.min(el.clientWidth - slideWidth, (slides.length - 1) * (slideWidth + desktopGap));
    };

    const swiper = new Swiper(el, {
        slidesPerView: 'auto',
        spaceBetween: gap,
        speed: 500,
        slidesOffsetAfter: offsetAfter(),
        breakpoints: {
            798: {
                spaceBetween: desktopGap,
            },
        },
        pagination: {
            el: container.querySelector(`.${block}__pagination`),
            clickable: true,
        },
        navigation: {
            prevEl: container.querySelector(`.${block}__nav-button_prev`),
            nextEl: container.querySelector(`.${block}__nav-button_next`),
        },
        on: {
            beforeResize(s) {
                s.params.slidesOffsetAfter = offsetAfter();
            },
        },
    });

    swiper.on('click', (s) => {
        if (!desktop.matches || s.clickedIndex === undefined) return;
        s.slideTo(s.clickedIndex);
    });
}

function optimize() {
    document.querySelectorAll('.js-optimize').forEach(container => expandSlider(container, 'optimize'));
}

function dashboard() {
    document.querySelectorAll('.js-dashboard').forEach(container => expandSlider(container, 'dashboard', 10));
}

function video() {
    document.querySelectorAll('.js-video').forEach(preview => {
        preview.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${preview.dataset.videoId}?autoplay=1&rel=0`;
            iframe.title = 'Видео WEYRO';
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            iframe.allowFullscreen = true;
            preview.replaceWith(iframe);
        });
    });
}

function aos() {
    if (typeof AOS === 'undefined') return;

    AOS.init({
        once: true,
        duration: 700,
        easing: 'ease-out-cubic',
        offset: 40,
    });

    window.addEventListener('load', () => AOS.refresh());
}

function inits() {
    tabs();
    tel();
    header();
    notify();
    platform();
    times();
    optimize();
    dashboard();
    video();
    aos();
}

window.addEventListener("DOMContentLoaded", inits);