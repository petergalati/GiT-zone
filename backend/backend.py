from fastapi import FastAPI
from typing import Union

app = FastAPI()

@app.get("/assign-zone")
def read_root():
    return {"message": "Zone assigned successfully"}