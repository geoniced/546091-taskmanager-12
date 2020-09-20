const CACHE_PREFIX = `taskmanager-cache`;
const CACHE_VER = `v12`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/style.css`,
            `/fonts/HelveticaNeueCyr-Bold.woff`,
            `/fonts/HelveticaNeueCyr-Bold.woff2`,
            `/fonts/HelveticaNeueCyr-Medium.woff`,
            `/fonts/HelveticaNeueCyr-Medium.woff2`,
            `/fonts/HelveticaNeueCyr-Roman.woff`,
            `/fonts/HelveticaNeueCyr-Roman.woff2`,
            `/img/add-photo.svg`,
            `/img/close.svg`,
            `/img/sample-img.jpg`,
            `/img/wave.svg`
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      // Получаем все !НАЗВАНИЯ! кэшей
      caches.keys()
        .then(
            // Перебираем их и составляем НАБОР промисов на удаление
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      // Удаляем ТЕ кэши, которые начинаются с нашего
                      // ПРЕФИКСА, но отличаются версией
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      // Другие кэши не обрабатываем
                      return null;
                    }
                )
                .filter((key) => key !== null)
            )
        )
  );
});

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          // Если в кэше нашелся ответ на request, возвращаем его вместо запроса на сервер
          if (cacheResponse) {
            return cacheResponse;
          }

          // Если нет – делаем fetch по request
          return fetch(request)
            .then((response) => {
              // Если ответа нет, или ответ не 200, или небезопасный тип ответа, тогда просто передаем ответ дальше и не кэшируем
              if (!response || response.status !== HTTP_STATUS_OK || response.type !== RESPONSE_SAFE_TYPE) {
                return response;
              }

              // Если всему удовлетворяет, клонируем
              const clonedResponse = response.clone();

              // Копию кладем в кэш
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(clonedResponse));

              // Оригинал запроса прокидываем дальше
              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, handleFetch);
