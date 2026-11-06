import random

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from db import SessionDep
from modelos import Comments, CommentsCreate, Videos, VideosCreate


router = APIRouter(prefix="/videos")


@router.get("/")
def get_videos(session: SessionDep, categoria: str | None = None):
    if categoria:
        videos = session.exec(
            select(Videos).where(Videos.categoria == categoria)
        ).all()
    else:
        videos = session.exec(select(Videos)).all()

    videos = list(videos)
    random.shuffle(videos)

    return videos


@router.get("/recommendations/")
def get_recommendations(categoria: str, video_id: int, session: SessionDep):
    videos = session.exec(
        select(Videos).where(
            Videos.id != video_id,
            Videos.es_publico == True,
        )
    ).all()

    misma_categoria = []
    otras_categorias = []

    for video in videos:
        if video.categoria == categoria:
            misma_categoria.append(video)
        else:
            otras_categorias.append(video)

    random.shuffle(misma_categoria)
    random.shuffle(otras_categorias)

    recomendados = misma_categoria + otras_categorias
    return recomendados[:10]


@router.get("/{video_id}/comments/")
def get_comments(video_id: int, session: SessionDep):
    video = session.get(Videos, video_id)

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado",
        )

    return session.exec(
        select(Comments).where(Comments.video_id == video_id)
    ).all()


@router.post("/{video_id}/comments/", status_code=status.HTTP_201_CREATED)
def create_comment(video_id: int, comment_data: CommentsCreate, session: SessionDep):
    video = session.get(Videos, video_id)

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado",
        )

    comment = Comments(
        autor=comment_data.autor,
        contenido=comment_data.contenido,
        video_id=video_id,
    )

    session.add(comment)
    session.commit()
    session.refresh(comment)

    return comment


@router.get("/{video_id}")
def get_video_by_id(video_id: int, session: SessionDep):
    video = session.get(Videos, video_id)

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado",
        )

    return video


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_video(video_data: VideosCreate, session: SessionDep):
    video = Videos.model_validate(video_data)

    session.add(video)
    session.commit()
    session.refresh(video)

    return video


@router.delete("/{video_id}")
def delete_video(video_id: int, session: SessionDep):
    video = session.get(Videos, video_id)

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El video no fue encontrado",
        )

    comentarios = session.exec(
        select(Comments).where(Comments.video_id == video_id)
    ).all()

    for comentario in comentarios:
        session.delete(comentario)

    session.delete(video)
    session.commit()

    return {"mensaje": "Video y comentarios eliminados"}