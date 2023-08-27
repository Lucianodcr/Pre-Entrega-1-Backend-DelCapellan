import express from "express";
import { __dirname } from "./path.js";
import prodRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import ProductManager from "../classes/ProductManager.js";

const app = express();
const PORT = 8080;


const productManager = new ProductManager();


const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.engine("handlebars", engine());
app.set("view engine", "handlebars"); 
app.set("views", path.resolve(__dirname, "./views"));


const io = new Server(serverExpress);

io.on("connection", (socket) => {
  console.log(`Servidor Socket.io Conectado`);

  socket.on('nuevoProducto', async (newProd)=> {
    console.log(newProd)
    await productManager.addProduct(newProd);
    const products = await productManager.getProducts();
    socket.emit('prodsData', products)
  })
  
  socket.on('getProducts', async ()=> {
    const products = await productManager.getProducts();
    socket.emit('prodsData', products)
  })

});


app.use("/api/products", prodRouter);
app.use("/api/carts", cartRouter);


app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public")));


app.get("/static", async (req, res) => {
  res.render("index", {
    css: "style.css",
    title: "Home",
    js: "App.js",
  });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", {
    css: "style.css",
    title: "Productos en tiempo Real",
    js: "RealTimeProducts.js",
  });
});



app.get("/products", (req, res) => {
  res.render("products");
});

