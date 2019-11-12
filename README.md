### Домашнее задание №2 по Highload. Балансировщик нагрузки

----------------------
* хостинг Digital Ocean
* сервера на Node Express
* Nginx, L7
* метрики на Grafana + Prometeus

----------------------
##### Бэкенды:
1. 142.93.52.228 (алиас do1)
2. 167.71.181.19 (алиас do2)
3. 167.71.98.62 (алиас do3)

##### Балансировщик:
142.93.68.122 (алиас don)

----------------------
#### Запуск

`npm install && npm start`

----------------------
#### Бэкенды

##### Старт
 
 `./start.sh` - скрипт, собирающий и запускающий докер

##### API

`/api/switch` - включение/выключение бэкенда (переключение с 200 на 500 и наоборот)

`/api/status` - проверка, включен ли бэкенд (текущий статус ответа)

`/api/data` - запрос с задержкой в 200 мс, возвращает { 'Response delay is ${response delay} ms', ${response status code} }

`:8080/metrics` - собранные прометеусом метрики 

##### Nginx

Конфиг лежит в /etc/nginx/nginx.conf ([образец для бэкенда](/configs/backend/backend.conf))

После изменения конфига **не забыть**: 
* `nginx -t` - валидация конфига
* `nginx -s reload` - перезагрузка конфигурации, рестарт

**Порты**:

* *:80* - Nginx
* *:8000* - бэкенд, проксируется Nginx'ом на :80
* *:8080* - метрики, прокисруется Nginx'ом :80

Посмотреть занятые порты:
`sudo netstat -ntulp`

-----------

#### Балансировщик

##### Nginx + Openresty

Конфиг лежит в /usr/local/openresty/nginx/conf/nginx.conf (взяла [отсюда](https://github.com/openresty/lua-resty-upstream-healthcheck))

`openresty -t` - валидация конфига

`openresty` - старт Nginx с Openresty

По урлу */check* доступен отчет о статусах серверов из апстрима бэкенда

`sudo fuser -k 80/tcp` - убить процесс на 80 порту

##### Prometheus
`./run.sh` - запуск docker-compose, контейнер *monitoring-prometheus*

[Образец конфига prometheus](/configs/balancer/prometheus.yml)

`promtool check config prometheus.yml` - валидация конфига прометеуса

##### Grafana

Слушает 3000 порт ([142.93.68.122:3000](http://142.93.68.122:3000)).

`sudo service grafana-server restart` - рестарт