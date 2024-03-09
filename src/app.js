const express= require('express')
const   ProductManager = require('./ProductManager')

const productManager =new ProductManager
const app= express()

app.get('/saludo', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      console.log(products);
      res.send(products); // O puedes enviar los productos directamente si prefieres
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en la consulta');
    }
  });


app.listen(8080,()=>console.log("Servidor Arriba"))

