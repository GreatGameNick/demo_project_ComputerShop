# API
## Магазин
api/session              get
api/shop/:shelf          get
api/shop/:shelf/:id      get



## Быстрый заказ
api/basket/:sessionId + query(shelf=id;)    get, del




## Заказ из личного кабинета (отследить ход выполнения заказа)
- пока делать не буду.
api/basketAuth            put   //проверка авторизации

auth/registration         post  //создание нового аккаунта
auth/:customer + query(password)           get   //запрос на идентификацию 



## запрос изображения
api/imgs/:shelf/:imgName  get









