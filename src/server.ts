import express from "express";
import cors, {CorsOptions} from 'cors';
import morgan from 'morgan';
import db from "./config/db";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

//conection to data base
async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
  } catch (error) {
    console.log(error);
  }
}
connectDB();

const server = express();
//Allowing cors
const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null,true)
    } else {
      callback(new Error('CORS Error'))
    }
  }
}
server.use(cors(corsOptions));

server.use(express.json());

server.use(morgan('dev'))

server.get("/products", getProduct);
server.get(
  "/products/:id",
  param("id").isInt().withMessage("ID not valid"),
  handleInputErrors,
  getProductById
);

server.post(
  "/products",
  body("name").notEmpty().withMessage("Product name is empty"),
  body("price")
    .isNumeric()
    .withMessage("Price value must be numeric")
    .notEmpty()
    .withMessage("Product price is empty")
    .custom((value) => value > 0)
    .withMessage("Price can not be negative"),
  handleInputErrors,
  createProduct
);

server.put(
  "/products/:id",
  param("id").isInt().withMessage("ID not valid"),
  body("name").notEmpty().withMessage("Product name is empty"),
  body("price")
    .isNumeric()
    .withMessage("Price value must be numeric")
    .notEmpty()
    .withMessage("Product price is empty")
    .custom((value) => value > 0)
    .withMessage("Price can not be negative"),
  handleInputErrors,
  updateProduct
);

server.patch(
  "/products/:id",
  param("id").isInt().withMessage("ID not valid"),
  handleInputErrors,
  updateAvailability
);

server.delete(
  "/products/:id",
  param("id").isInt().withMessage("ID not valid"),
  handleInputErrors,
  deleteProduct
);

export default server;
