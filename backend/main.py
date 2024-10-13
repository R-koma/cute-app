from fastapi import  Depends, FastAPI, HTTPException, Query
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from .models import create_db_and_tables, get_session, Cutiees
from typing import Annotated
from sqlmodel import Session

app = FastAPI()

SessionDep = Annotated[Session, Depends(get_session)]

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/ping")
async def root():
    return {"ping": "pong"}


"""
APIs

1. Creating a new cutiee | POST /cutiees
    Constraints:
    1. File Size Limit: 2MB
2. Getting cutiees | GET /cutiees
    2.1. Gender filter | GET /cutiees?gender=...
    2.2. Country filter | GET /cutiees?country=...
    2.3. Age filter | GET /cutiees?age=...
3. Reporting a cutiee (anyone can do it) | GET /cutiees/{cutiee_id}/report
4. Deleting a cutiee (only admin, with a password) | DELETE /cutiees/{cutiee_id}

API

1. 新しいキューティーの作成 | POST /cutiees
    制約:
    1. ファイルサイズ制限: 2MB
2. キューティーの取得 | GET /cutiees
    2.1. 性別フィルター | GET /cutiees?gender=...
    2.2. 国フィルター | GET /cutiees?country=...
    2.3. 年齢フィルター | GET /cutiees?age=...
3. キューティーを報告する（誰でもできます）| GET /cutiees/{cutiee_id}/report
4. キューティーを削除する（管理者のみ、パスワードが必要です）| DELETE /cutiees/{cutiee_id}
"""

class CutieeRequest(BaseModel):
    text: str = None
    image: str = None
    country: str = None
    gender: str = None
    age: int = None

class CutieePassword(BaseModel):
    password: str = None

@app.post("/cutiees")
async def create_cutiee(cutiee_request: CutieeRequest, session: SessionDep):
    """
    1. File Size Limit: 2MB
    2. Either text or image must be provided

    1. ファイルサイズ制限: 2MB
    2. テキストまたは画像のいずれかが必要です
    """

    if cutiee_request.text is None and cutiee_request.image is None:
        return {"error": "Either text or image must be provided"}

    # File Size Limit: 2MB
    if cutiee_request.image is not None:
    
        if len(cutiee_request.image) > 2 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 2MB"
            )
        
    # Save the cutiee to the database

    cutiee = Cutiees(
        text=cutiee_request.text,
        image=cutiee_request.image,
        country=cutiee_request.country,
        gender=cutiee_request.gender,
        age=cutiee_request.age
    )

    session.add(cutiee)
    session.commit()

    return cutiee


@app.get("/cutiees")
async def get_cutiees():
    pass

@app.put("/cutiees/{cutiee_id}/report")
async def report_cutiee(cutie_id: int, session: SessionDep):
    cutiee_db = session.get(Cutiee, cutiee_id)
    if not cutiee_db:
        raise HTTPException(status_code=404, detail="cutiee_id not found")
    cutiee_data = cutiee.model_dump(exclude_unset=True)
    cutiee_db.sqlmodel_update(cutiee_data)
    session.add(cutiee_db)
    session.commit()
    session.refresh(cutiee_db)
    return cutiee_db

@app.delete("/cutiees/{cutiee_id}")
async def delete_cutiee(cutie_id: int, cutiee_password: CutieePassword, session: SessionDep):
    if cutiee_password.password == 'abc':
        cutiee = session.get(cutiee, cutiee_id)
        if not cutiee:
            raise HTTPException(status_code=404, detail="cutiee not found")
        session.delete(cutiee)
        session.commit()
        return {"ok": True}
    else:
         return {"password mismatched": False}