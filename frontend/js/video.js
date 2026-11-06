const id = new URLSearchParams(window.location.search).get("id");

const reproductor = document.querySelector("#reproductor");
const tituloVideo = document.querySelector("#titulo-video");
const descripcionVideo = document.querySelector("#descripcion-video");
const listaRecomendaciones = document.querySelector("#lista-recomendaciones");
const listaComentarios = document.querySelector("#lista-comentarios");
const formulario = document.querySelector("#formulario-comentario");

fetch("http://127.0.0.1:8000/videos/" + id)
  .then((respuesta) => respuesta.json())
  .then((video) => {
    reproductor.src = video.source;
    tituloVideo.textContent = video.titulo;
    descripcionVideo.textContent = video.descripcion;

    cargarRecomendaciones(video.categoria);
  })
  .catch((error) => console.log("Error al cargar el video:", error));

function cargarRecomendaciones(categoria) {
  fetch(
    "http://127.0.0.1:8000/videos/recommendations/?categoria=" +
      categoria +
      "&video_id=" +
      id,
  )
    .then((respuesta) => respuesta.json())
    .then((videos) => {
      videos.forEach((recomendado) => {
        const tarjeta = document.createElement("a");
        tarjeta.className = "tarjeta-recomendada";
        tarjeta.href = "video.html?id=" + recomendado.id;

        const imagen = document.createElement("img");
        imagen.src = recomendado.miniatura_url;
        imagen.alt = recomendado.titulo;

        const titulo = document.createElement("h3");
        titulo.textContent = recomendado.titulo;

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(titulo);
        listaRecomendaciones.appendChild(tarjeta);
      });
    })
    .catch((error) => console.log("Error al cargar recomendaciones:", error));
}

function cargarComentarios() {
  fetch("http://127.0.0.1:8000/videos/" + id + "/comments/")
    .then((respuesta) => respuesta.json())
    .then((comentarios) => {
      listaComentarios.textContent = "";

      comentarios.forEach((comentario) => {
        const elemento = document.createElement("p");
        elemento.textContent = comentario.autor + ": " + comentario.contenido;
        listaComentarios.appendChild(elemento);
      });
    })
    .catch((error) => console.log("Error al cargar comentarios:", error));
}

cargarComentarios();

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nuevoComentario = {
    autor: document.querySelector("#autor").value,
    contenido: document.querySelector("#contenido").value,
  };

  fetch("http://127.0.0.1:8000/videos/" + id + "/comments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoComentario),
  })
    .then((respuesta) => respuesta.json())
    .then(() => {
      formulario.reset();
      cargarComentarios();
    })
    .catch((error) => console.log("Error al publicar comentario:", error));
});