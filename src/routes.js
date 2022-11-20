const express = require("express");
const route = express();

const { checkLogin } = require("./middleware/checkLogin");
const { loginUser, addUser } = require("./controllers/user");
const {
  addCar,
  listCars,
  deleteCar,
  attCar,
  teste,
} = require("./controllers/cars");
const {
  addSeller,
  listSellers,
  deleteSellers,
  attSeller,
} = require("./controllers/sellers");
const {
  addSale,
  listSales,
  deleteSale,
  attSale,
} = require("./controllers/sales");
const {
  listSellersAndSales,
  listMonthsAndSales,
  listMonthsAndSalesAvg,
  listCarsAndQtd,
} = require("./controllers/charts");

route.post("/cadastro", addUser);
route.post("/login", loginUser);

route.use(checkLogin);

route.post("/cars", addCar);
route.get("/cars", listCars);
route.delete("/delcar/:id", deleteCar);
route.put("/car/:id", attCar);

route.post("/sellers", addSeller);
route.get("/sellers", listSellers);
route.delete("/delSeller/:id", deleteSellers);
route.put("/seller/:id", attSeller);

route.post("/sales", addSale);
route.get("/sales", listSales);
route.delete("/delSale/:id", deleteSale);
route.put("/sale/:id", attSale);

route.get("/charts1", listSellersAndSales);
route.get("/charts2", listMonthsAndSales);
route.get("/charts3", listMonthsAndSalesAvg);
route.get("/charts4", listCarsAndQtd);
module.exports = route;
