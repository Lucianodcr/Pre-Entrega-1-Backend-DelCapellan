import { promises as fs } from "node:fs"

export default class ProductManager {

    constructor() {
        this.path = './data/products.json'
    }
  
    async addProduct(product) {
        const jprod = JSON.parse(product)
        if (!jprod.nombre || !jprod.precio || !jprod.description  || !jprod.code || !jprod.stock) {
            console.log('All fields are Required')
            return
        }
        jprod.status = !jprod.status ? false : true
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const producto = prods.find(prod => prod.id === product.id)

        if (producto) {
            console.log("Existing Product")
        } else {
            jprod.id = await this.idProduct()
            prods.push(jprod)
            await fs.writeFile(this.path, JSON.stringify(prods))
        }
        return console.log('Product Added')
    }
  
    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods
    }

   
    async getProductById(id) {
        const idn = Number(id)
        const product = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const searchedProduct = product.filter(product => product.id === idn)
        return searchedProduct.length > 0
            ? searchedProduct
            : console.log(`Product ID ${id} Not Found`)
    }

   
    async deleteProductById(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const product = prods.find(prod => prod.id === Number(id))
        if (!product) return console.log(`Product ID ${id} Not Found`)

        await fs.writeFile(this.path, JSON.stringify(prods.filter(prod => prod.id !== Number(id))))
        return product
    }
   
    async deleteAllProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        await fs.writeFile(this.path, '[]')
        return console.log('All Products Deleted')
    }
  
    async UpdateProductById(id, product) {

        const idn = Number(id)
        if (!product.nombre || !product.precio || !product.description ||
             !product.code || !product.stock || !product.status) {
            return console.log('All Product Fields are Required')
        }

        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = prods.find(prod => prod.id === idn)
        if (!prod) return console.log(`Product ID ${idn} Not Found`)

        const index = prods.findIndex(prod => prod.id === idn)

        if (index === -1) return console.log(`Product ID ${idn} Was Deleted`)

        prods[index].nombre = product.nombre
        prods[index].precio = product.precio
        prods[index].description = product.description
        prods[index].image = product.image
        prods[index].code = product.code
        prods[index].stock = product.stock
        prods[index].stock = product.status
        await fs.writeFile(this.path, JSON.stringify(prods))

        return console.log('Product Updated')

    }

    async getProductByCode(code) {
        const product = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const searchedProduct = product.filter(product => product.code === code)
        console.log(searchedProduct)
        return searchedProduct.length > 0
            ? searchedProduct
            : console.log('Cannot Create The Product')
    }

   
    async idProduct() {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if (products.length < 1) return 1
        const ids = products.map(product => product.id)
        const id = Math.max(...ids) + 1
        return id
    }

}