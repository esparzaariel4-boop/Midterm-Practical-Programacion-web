const galeria = document.querySelector("#galeria");
const tituloHome = document.querySelector("#titulo-home");
const campoBusqueda = document.querySelector("#busqueda");
const formularioBusqueda = document.querySelector("#formulario-busqueda");

const categoria = new URLSearchParams(window.location.search).get("categoria");

let url = "http://127.0.0.1:8000/videos/";

if (categoria) {
  url = url + "?categoria=" + categoria;
  tituloHome.textContent = "Videos de " + categoria;
}

fetch(url)
  .then((respuesta) => respuesta.json())
  .then((videos) => {
    videos.forEach((video) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "tarjeta";

      const enlace = document.createElement("a");
      enlace.href = "video.html?id=" + video.id;

      const imagen = document.createElement("img");
      imagen.src = video.miniatura_url;
      imagen.alt = video.titulo;

      const titulo = document.createElement("h2");
      titulo.textContent = video.titulo;

      const textoCategoria = document.createElement("p");
      textoCategoria.textContent = video.categoria;

      enlace.appendChild(imagen);
      enlace.appendChild(titulo);
      tarjeta.appendChild(enlace);
      tarjeta.appendChild(textoCategoria);
      galeria.appendChild(tarjeta);
    });
  })
  .catch((error) => console.log("Error al cargar videos:", error));

function filtrarVideos() {
  const texto = campoBusqueda.value.toLowerCase();
  const tarjetas = document.querySelectorAll(".tarjeta");

  tarjetas.forEach((tarjeta) => {
    if (tarjeta.textContent.toLowerCase().includes(texto)) {
      tarjeta.style.display = "block";
    } else {
      tarjeta.style.display = "none";
    }
  });
}

formularioBusqueda.addEventListener("submit", (evento) => {
  evento.preventDefault();
  filtrarVideos();
});

campoBusqueda.addEventListener("input", filtrarVideos);