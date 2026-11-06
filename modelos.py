

from sqlmodel import Field, Relationship, SQLModel


class Videos(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    source: str
    categoria: str = Field(default="General")
    miniatura_url: str = Field(default="")
    descripcion: str = Field(default="")
    es_publico: bool = Field(default=True)

    comentarios: list["Comments"] = Relationship(back_populates="video")


class Comments(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    autor: str
    contenido: str
    video_id: int = Field(foreign_key="videos.id")

    video: Videos | None = Relationship(back_populates="comentarios")


class VideosCreate(SQLModel):
    titulo: str
    source: str
    categoria: str = "General"
    miniatura_url: str = ""
    descripcion: str = ""
    es_publico: bool = True


class CommentsCreate(SQLModel):
    autor: str
    contenido: str