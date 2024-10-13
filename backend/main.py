from fastapi import  Depends, FastAPI, HTTPException, Query
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from .models import create_db_and_tables, get_session, Cutiees
from typing import Annotated
from sqlmodel import Session, select

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
async def get_cutiees(session: SessionDep, country: str = None, gender: str = None, age: int = 0):
    """
    1. get all cuties from the database
    2. filter the cuties based on the query parameters
        2.1. if country is not None, filter the cuties based on the country
        2.2. if gender is not None, filter the cuties based
        2.3. if age is not None, filter the cuties based
    3. return the filtered cuties

    1. データベースからすべてのキューティーを取得します
    2. クエリパラメータに基づいてキューティーをフィルタリングします
        2.1. countryがNoneでない場合、国に基づいてキューティーをフィルタリングします
        2.2. genderがNoneでない場合、フィルタリングされたキューティーを返します
        2.3. ageがNoneでない場合、フィルタリングされたキューティーを返します
    3. フィルタリングされたキューティーを返します
    """

    cutiees_items = session.exec(select(Cutiees).country(country).gender(gender).age(age)).all()
    return cutiees_items

@app.get("/cutiees/{cutiee_id}/report")
async def report_cutiee():
    pass

@app.delete("/cutiees/{cutiee_id}")
async def delete_cutiee():
    pass