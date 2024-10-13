from fastapi import FastAPI
from .models import create_db_and_tables

app = FastAPI()

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

@app.post("/cutiees")
async def create_cutiee():
    pass

@app.get("/cutiees")
async def get_cutiees():
    pass

@app.get("/cutiees/{cutiee_id}/report")
async def report_cutiee():
    pass

@app.delete("/cutiees/{cutiee_id}")
async def delete_cutiee():
    pass