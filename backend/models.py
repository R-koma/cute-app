from typing import Annotated
from datetime import datetime
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Cutiees(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    text: str = Field(default=None)
    image: str | None = Field(default=None)
    
    country: str | None = Field(default=None)
    gender: str | None = Field(default=None)
    age: int | None = Field(default=None)

    report: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now())




sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)