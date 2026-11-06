# Youtube - Plataforma de Streaming

Proyecto con FastAPI, SQLModel, SQLite y AWS S3.

## Cómo correr el backend en powershell

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

La API queda en http://127.0.0.1:8000 y la documentación en http://127.0.0.1:8000/docs

## Cómo ver el frontend

Opción 1: abrir `frontend/index.html` con Live Server (puerto 5500).

Opción 2: abrir en Firefox el sitio publicado en S3:
http://ariel-codigo-videos.s3-website-us-east-1.amazonaws.com

En los dos casos la API tiene que estar corriendo.

## Autor
Ariel Esparza 
