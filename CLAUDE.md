# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Фигма
Работать с фигмой только через токен (REST API, заголовок `X-Figma-Token`). Сам токен хранится в `CLAUDE.local.md` — файл в `.gitignore`, в репозиторий не коммитится.

Графику с фигмы не сохранять, использовать для заглушек сервис placeholdit.com и теги img вставлять в picture

## Проект

Статический лендинг для WEYRO (AI-сервис для организации командировок). Тексты интерфейса на русском (`<html lang="ru">`). Фреймворка, бандлера, линтера и тестов нет — только пайплайн на Gulp 4, который компилирует SCSS и собирает HTML из частей.

## Команды

```bash
npm install
npx gulp          # по умолчанию: сборка HTML + SCSS, watch и раздача app/ через BrowserSync
npx gulp sass     # только компиляция SCSS
npx gulp fileinclude  # только сборка HTML
```

`npm test` — заглушка и всегда завершается с ошибкой.

## Архитектура

Исходники лежат в `src/`, результат сборки — в `app/` (именно он раздаётся/деплоится). Обе папки коммитятся.

- **HTML**: `src/html-layouts/*.html` — точки входа страниц; они подключают части из `src/html-layouts/templates/` через gulp-file-include (`@include('templates/header.html')`, префикс `@`, пути относительно подключающего файла). Результат пишется в `app/*.html`. **Никогда не редактируйте `app/*.html` напрямую** — файлы перезаписываются при сборке. В templates вынесены только общие части (head, header, footer, sprite, modals, scripts); секции лендинга (например, `.hero`) пишутся прямо в `src/html-layouts/index.html`. Модальные окна (Fancybox) — в `templates/modals.html`.
- **CSS**: `src/scss/style.scss` — единственная точка входа (не partial), компилируется в `app/css/style.css` (expanded + autoprefixer). **Никогда не редактируйте `app/css/style.css` напрямую.** Каждый компонент — partial `src/scss/components/_<name>.scss`, который начинается с `@use "global" as *;` и должен быть подключён в `style.scss` строкой `@use "components/<name>";`. Используется модульная система Dart Sass (`@use`, а не `@import`).
- **`src/scss/_global.scss`** содержит общие дизайн-токены и базовые стили: CSS-переменные на `:root` (цвета `--black`, `--violet`, `--violet-gradient`, `--bg-light`, `--text-muted`, …, пары `--*-rgb` для прозрачности: `rgba(var(--black-rgb), 0.5)`, `--transition`), SCSS-брейкпоинты (`$md` 798px, `$lg` 960px, `$xl` … `$xxxxl` — остаются SCSS, т.к. CSS-переменные не работают в `@media`), миксины (`line`, `lines($n)`, `abs50`, `picture-img`), ресеты, `.button`/`.button_gradient` и `.container`. Используйте их вместо захардкоженных значений.
- **JS**: `app/js/script.js` редактируется прямо на месте (папки `src/js` нет); Gulp лишь отслеживает его для перезагрузки. Используются делегированные обработчики кликов на `document`, привязанные к классам `js-*` (`.js-toggle`, `.js-parent-toggle`, `.js-burger-open/close`, `.js-notify-close`), которые переключают `active` на элементах или классы состояния на `<body>` (`burger-opened`, `notify-closed`); контейнеры `.js-tabs` связывают `[data-tab-id]` с `[data-body-id]`; ко всем `input[type=tel]` автоматически применяется маска IMask `+7 (000) 000-00-00`. Новое поведение добавляется в виде функций, вызываемых из `inits()`.
- **Сторонние библиотеки** (normalize.css 8.0.1, Fancybox 6.1.15, Swiper 14.2.0, IMask 7.6.1, AOS 2.3.4) лежат локально минифицированными файлами в `app/css/` и `app/js/` (скачаны с jsDelivr, не через npm) и подключаются в `templates/head.html` и `templates/scripts.html`. Шрифты локальные, `@font-face` в `app/fonts/stylesheet.css`: Geist для основного текста (вариативный 100–900, только обычное начертание, наборы `cyrillic` и `latin` через `unicode-range`, скачан с Google Fonts; курсив и наборы latin-ext/cyrillic-ext/vietnamese удалены как неиспользуемые — при появлении `₽`, курсива и т.п. их нужно докачать) и BlackerPro Text для заголовков.
- **Иконки**: инлайн SVG-спрайт в `templates/sprite.html`; символы имеют id вида `i_<name>` и используются как `<svg><use href="#i_name"></use></svg>`. Растровые изображения кладутся в `app/media/`.

## Соглашения

- Именование классов в стиле БЭМ: `.block__element`, модификаторы через одно подчёркивание (`.button_gradient`).
- Отступ 2 пробела в SCSS/HTML; 4 пробела в `script.js`.
- Анимации появления при скролле — AOS (`data-aos="fade-up"` / `"fade"`, у повторяющихся карточек `data-aos-delay` с шагом 50–100 мс; настройки в функции `aos()` в `script.js`, смягчённый сдвиг в `components/_aos.scss`). Не вешать `data-aos` на `<a>`/`<button>` и элементы со своими `transform`/`transition`/`position: sticky` — AOS перебивает их `transition` и `transform`; в таком случае анимировать обёртку-контейнер.
