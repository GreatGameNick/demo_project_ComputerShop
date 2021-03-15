//process.env. мы декларируем в docker-compose.yml
module.exports.port = process.env.PORT;
module.exports.host = process.env.HOST;
module.exports.MONGO_URL = process.env.MONGO_URL;
module.exports.apiUrl = process.env.API_API_URL;
module.exports.mode = process.env.MODE;
