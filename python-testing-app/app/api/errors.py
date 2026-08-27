from fastapi import APIRouter
import json
import os
import asyncio
from sqlalchemy.exc import OperationalError

router = APIRouter(prefix="/errors", tags=["error_laboratory"])

@router.get("/name-error")
async def trigger_name_error():
    print(undefined_user.name)  # type: ignore

@router.get("/attribute-error")
async def trigger_attribute_error():
    user = None
    print(user.name)  # type: ignore

@router.get("/key-error")
async def trigger_key_error():
    data = {}
    return data["email"]

@router.get("/index-error")
async def trigger_index_error():
    arr = []
    return arr[5]

@router.get("/json-error")
async def trigger_json_error():
    return json.loads("{bad json}")

@router.get("/file-not-found")
async def trigger_file_not_found():
    open("missing_file.txt", "r")

@router.get("/database")
async def trigger_database_error():
    raise OperationalError("SELECT * FROM missing_table", params={}, orig=Exception("Connection refused"))

@router.get("/env")
async def trigger_env_error():
    return os.environ["MISSING_SECRET_KEY_123"]

@router.get("/async")
async def trigger_async_error():
    async def async_task():
        raise RuntimeError("Async task failed unexpectedly")
    await async_task()

@router.get("/timeout")
async def trigger_timeout_error():
    async def long_running_task():
        await asyncio.sleep(10)
    
    try:
        await asyncio.wait_for(long_running_task(), timeout=1.0)
    except asyncio.TimeoutError:
        raise RuntimeError("Request timeout")
