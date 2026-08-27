from fastapi import APIRouter
import time
import asyncio
from app.core.config import settings

router = APIRouter(prefix="/performance", tags=["performance_laboratory"])

# Global state to simulate memory leak
global_cache = []

@router.get("/cpu")
async def cpu_intensive():
    # Warning: In a real async app, this blocks the event loop!
    # This is intentional for the laboratory.
    start = time.perf_counter()
    result = 0
    # Limited to a safe number to avoid completely locking up the container for too long
    for i in range(settings.CPU_LIMIT_ITERATIONS):
        result += i
    duration = time.perf_counter() - start
    return {"message": "CPU task completed", "duration": duration}

@router.get("/memory")
async def memory_leak():
    # Simulate a memory leak safely (adds ~1MB per request)
    big_object = "A" * 1024 * 1024
    if len(global_cache) < 100:  # Safety limit: max 100MB
        global_cache.append(big_object)
    return {"message": "Memory allocated", "cache_size": len(global_cache)}

@router.get("/large-response")
async def large_response():
    # Generates 100,000 records
    start = time.perf_counter()
    data = [{"id": i, "name": f"Item {i}", "value": i * 2} for i in range(100000)]
    duration = time.perf_counter() - start
    return {"message": "Data generated", "duration": duration, "data": data}

@router.get("/slow-query")
async def slow_database_query():
    # Simulate a slow database query
    start = time.perf_counter()
    await asyncio.sleep(5)
    duration = time.perf_counter() - start
    return {"message": "Query completed", "duration": duration}

@router.get("/thread-blocking")
async def thread_blocking_example():
    # This intentionally uses time.sleep instead of asyncio.sleep to block the worker
    start = time.perf_counter()
    time.sleep(3)
    duration = time.perf_counter() - start
    return {"message": "Thread blocked for 3 seconds", "duration": duration}
