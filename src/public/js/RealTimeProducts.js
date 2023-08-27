const socket = io()
const form = document.getElementById("idForm");
const table = document.querySelector("#prodTable tbody")

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  datForm.get("nombre");
  const prod = Object.fromEntries(datForm);
  console.log(prod);
  socket.emit("nuevoProducto", prod);
  e.target.reset();
});



socket.on('prodsData', (products=> {
  let tableInfo = ""
  if (products) {
    products.forEach(prod => {
        tableInfo += `
        <tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>${prod.description}</td>
        <td>${prod.precio}</td>
        <td>${prod.image}</td>
        <td>${prod.code}</td>
        <td>${prod.stock}</td>
        </tr>
        `
    });
  } else {
    console.error("Error al cargar los productos")
  }
  table.innerHTML = tableInfo
}))

socket.emit('getProducts')


