const express = require("express");
const ProductManager = require("./ProductManager");

const productManager = new ProductManager();
const app = express();

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    if (!limit) {
      const products = await productManager.getProducts();
      res.send(products);
    } else {
      const productsLimited = [];
      const products = await productManager.getProducts();
      for (let index = 0; index < limit && index < products.length; index++) {
        productsLimited.push(products[index]);
      }
      res.send(productsLimited);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la consulta");
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const idBuscado = Number(req.params.pid);
    const product = await productManager.getProductById(idBuscado);
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("No se encontró el producto con ese ID");
  }
});

app.listen(8080, () => console.log("Servidor Arriba"));
