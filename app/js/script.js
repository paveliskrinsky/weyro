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
    });
}

function notify() {
    const key = 'notifyClosedUntil';
    const week = 7 * 24 * 60 * 60 * 1000;

    let closed = false;
    try {
        closed = Date.now() < Number(localStorage.getItem(key));
    } catch (err) {}

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
        } catch (err) {}
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

function inits() {
    tabs();
    tel();
    header();
    notify();
    platform();
    times();
}

window.addEventListener("DOMContentLoaded", inits);