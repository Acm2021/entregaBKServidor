const { error } = require("console");
const path = require('path');

class ProductManager {
  static #ultimoIdEvento = 1;

  constructor() {
    this.products = [];
    this.path = path.join(__dirname, '../data/products.json');//default
    this.fileManager= new FileManager()
  }
  async reloadData() {
    
    try {
      this.products = await this.fileManager.readingFile(this.path);
  
      if (this.products.length !== 0) {
        let maxId = this.products.reduce((max, product) => {
          return product.id > max ? product.id : max;
        }, this.products[0].id);
        
        maxId++
        ProductManager.#ultimoIdEvento = maxId;
      } else {
        ProductManager.#ultimoIdEvento = 1;
      }
    } catch (error) {
      console.error("Error al recargar datos:", error);
    }
  }


  #getNuevoId() {
    const id = ProductManager.#ultimoIdEvento;
    ProductManager.#ultimoIdEvento++;
    return id;
  }

  #codeVerificationOk(codeToVerify) {
    let codeOK = true;
    this.products.forEach((product) => {
      if (product.code === codeToVerify) {
        codeOK = false;
      }
    });
    return codeOK;
  }

  changePath() {
    this.path = prompt("Ingrese nuevo Path");
  }





  async addProduct(title, description, price, thumbnail, code, stock) {
    await this.reloadData();
    const product = {
      id: this.#getNuevoId(),
      title: title ?? throwError("title es nulo"),
      description: description ?? throwError("description es nulo"),
      price: price ?? throwError("price"),
      thumbnail: thumbnail ?? throwError("thumbnail es nulo"),
      code: code ?? throwError("code es nulo"),
      stock: stock ?? throwError("stock es nulo"),
    };
    //console.log("ID ES",product.id)
    if (this.#codeVerificationOk(code)) {
      this.products.push(product);
      await this.fileManager.writingFile(this.path, this.products);
    } else {
      console.log("codigo repetido");
    }
  }

  getProducts() {
    const fileManager= new FileManager()
    this.products= fileManager.readingFile(this.path);
    return this.products;
  }

  async indexById(id) {
    const fileManager= new FileManager()
    this.products=await fileManager.readingFile(this.path);
    const indexToReturn = this.products.findIndex(
      (product) => product.id === id
    );
    if (indexToReturn !== -1) {
      return indexToReturn;
    } else {
      //console.log("No se encontró el ID buscado");
      throw new Error("Not found index");
    }
  }

  async getProductById(idBuscado) {
    try {
      const indexProduct = await this.indexById(idBuscado);
      console.log("Found:", this.products[indexProduct]);
      return this.products[indexProduct];
    } catch (error) {
      //console.log(error);
      throw new Error("Not found index");
    }
  }

  async DeleteProductById(idToEliminate) {
    const fileManager= new FileManager()
    try {
      const indexToEliminate = await this.indexById(idToEliminate);
      this.products.splice(indexToEliminate, 1);
      await fileManager.writingFile(this.path, this.products);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(idToUpdate, updatedProduct) {
    const fileManager= new FileManager()
    try {
      const indexProduct = await this.indexById(idToUpdate);
      const { id, ...restoPropiedades } = this.products[indexProduct];
      console.log("VIEJO",this.products)
      this.products[indexProduct] = {
        id,
        ...restoPropiedades,
        ...updatedProduct,
      };
      console.log("NUEVO",this.products)
      await fileManager.writingFile(this.path, this.products);
    } catch (error) {
      console.log(error);
    }
  }
}


class FileManager{
    
  constructor(){
    this.path = null

  }
  
  //Lee el contenido de un archivo a partir de un path y devuelve el contenido parseado.
  async readingFile(path) {
    const fs = require("fs");

    try {
      const contentFile = await fs.promises.readFile(path, "utf-8");
      if (contentFile.trim() === "") {
        return []

      } else {
        return JSON.parse(contentFile)
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        // El archivo no existe, así que lo creamos vacío
        await fs.promises.writeFile(path, '');
        return [];
      } else {
        console.log("El archivo no se ha podido leer");
      }
    }
  }

 //Escribe en un archivo un contenido, transformandolo a formato JSON.
  async writingFile(path, content) {
    const fs = require("fs");

    try {
      const contentFileToWrite = JSON.stringify(content, null, "\t");
      await fs.promises.writeFile(path, contentFileToWrite);
    } catch (err) {
      console.log("No se ha podido escribir");
    }
  }

}

module.exports = ProductManager;