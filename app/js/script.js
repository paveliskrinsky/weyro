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


function inits() {
    tabs();
    tel();
}

window.addEventListener("DOMContentLoaded", inits);