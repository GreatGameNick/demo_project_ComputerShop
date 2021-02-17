# Стек проекта
Docker
nginx
express
mongoDb
mongoose
multer.diskStorage - for images
session (via express-session)

Vue-CLI_project (vuex, routing as well)
  grid, flexbox
  SCSS (class inheritance, variables, mixins, functions)
  TypeScript
  //validation
  //authorization
  //jwt token
  cooke for sessionId
  Jest



# Архитектура проекта
- База данных хранится в mongoDb(via mongoose) в api_db-сервисе докера.
- При инициации проекта в mongoDb загружаются демонстрационные данные из папки initialData.  
- Файлы изображений хранятся в diskStorage у api-сервиса докера. 
  При DEV-работе изображения синхронизированы с папкой проекта посредством volumes api-сервиса ./api/initialData:/usr/src/app/initialData
  (надо проверить, не исчезают ли картинки при prodaction-запуске !!!)

- При первом обращении пользователя к сайту - на бакенде генерируется sessionId via express-session.
  Далее sessionId сохраняется:
  = via connect-mongo && mongoose в mongoDb api_db-сервиса,
  = а так же на пользователе в cookie броузера.
  Запись cookie в броузере происходит через команду Set-Cookie at respons первого request'a пользователя.

- В течении всего времени, пока пользователь находится на сайте, корзина сохраняется во Vuex.
  Одновременно, что бы пользователь мог возвратиться к своей корзине при повторных посещениях сайта даже после перезапуска броузера, корзина сохраняется на backend'e в mongoDb(via mongoose).
- Привязка пользователя к его корзине, хранящейся на бакенде в mongoDb, происходит через значение sessionId.
  В результате этого пользователь способен вернуться к своей прежней корзине даже после перезапуска броузера.





# Перед запуском
Если проект уже ранее билдился (создавались контейнеры), но из другого места на компьютере,
то необходимо предварительно эти контейнеры удалить by

>sudo docker ps -a              //Все контейнеры в системе (включая остановленные контейнеры)
>sudo docker stop $(docker ps -a -q)
>sudo docker rm $(docker ps -a -q)




# Запуск проекта для DEV-разработки.
На компьютере должен быть установлен docker и docker-compose.

В терминале, открытом в корне проекта, необходимо набрать
>sudo docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build

В броузере проект открывается на localhost:80 или localhost.



# Запуск проекта для PRODUCTION_mode.
На компьютере должен быть установлен docker и docker-compose.

В терминале, открытом в корне проекта, необходимо набрать
>sudo docker-compose up --build

В броузере проект открывается на localhost:80 или localhost.



# Остановка докера
>Ctrl + C



# Удаление всех образов и контейнеров.
>sudo docker-compose down   //Остановить и УДАЛИТЬ контейнеры, сети, изображения и тома
>sudo docker-compose stop   //Остановить службы только.
>sudo docker ps -a              //Все контейнеры в системе (включая остановленные контейнеры)



# Для production_mode можно сымитировать доменное имя хостинга, например - sw.ru.
Для этого в nginx.conf.prod необходимо строку
  server_name localhost;
заменить на строку
  server_name sw.ru;

Если при этом мы работаем в разработке, на рабочем компьютере, то дополнительно совершаем следующее:
-открываем на компьютере файл
/etc/hosts
(на windows - c:\windows\system32\drivers\etc\hosts)

-добавляем в него новую строку
127.0.0.1 http://sw.ru
127.0.0.1 sw.ru

-что бы изменить права доступа к файлу необходимо, когда терминал открыт по папке /etc, забить
sudo chmod -R -f 777 ./hosts











