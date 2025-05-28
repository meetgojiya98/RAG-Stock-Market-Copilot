from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select

app = FastAPI()
sqlite_url = "sqlite:///./users.db"
engine = create_engine(sqlite_url, echo=True)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    email: str

SQLModel.metadata.create_all(engine)

@app.post("/users/")
def create_user(user: User):
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

@app.get("/users/")
def read_users():
    with Session(engine) as session:
        return session.exec(select(User)).all()
