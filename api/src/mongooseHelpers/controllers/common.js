const {ROOT_PATH} = require("../../configuration")    //ROOT_PATH = "/usr/src/app/"

//Роут для diskStorage, для запроса projectDescription.
module.exports.getThisOneFromDiskStorage = async (req, res) => {
  let dataName = req.params.dataName
  const data = require(`${ROOT_PATH}initialData/${dataName}`)
  const dd = data[dataName]
  
  res.send(dd)
}








