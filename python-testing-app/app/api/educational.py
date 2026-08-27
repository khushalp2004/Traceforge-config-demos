from fastapi import APIRouter
from datetime import datetime, timezone
import asyncio

router = APIRouter(prefix="/educational", tags=["educational"])

# 1. Mutable Default Argument Bug
def add_item_buggy(item, items=[]):
    items.append(item)
    return items

def add_item_correct(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

@router.get("/mutable-default")
async def mutable_default_example():
    # Calling it multiple times without passing items
    res1 = add_item_buggy("apple")
    res2 = add_item_buggy("banana")
    
    res_correct1 = add_item_correct("apple")
    res_correct2 = add_item_correct("banana")
    
    return {
        "buggy_result_1": res1,
        "buggy_result_2": res2,  # Will have both apple and banana!
        "correct_result_1": res_correct1,
        "correct_result_2": res_correct2,
        "explanation": "Default arguments are evaluated once when the function is defined. Using a mutable type like [] means all calls share the same list."
    }

# 2. Race Condition Example
counter = 0

async def increment():
    global counter
    current = counter
    await asyncio.sleep(0.01)  # Simulate context switch
    counter = current + 1

@router.get("/race-condition")
async def race_condition_example():
    global counter
    counter = 0
    # Run 100 increments concurrently
    await asyncio.gather(*[increment() for _ in range(100)])
    
    return {
        "expected": 100,
        "actual": counter,
        "explanation": "Multiple tasks read the counter before any task writes the incremented value back, leading to lost updates."
    }

# 3. Generator Exhaustion
@router.get("/generator-exhaustion")
async def generator_exhaustion_example():
    gen = (x for x in range(3))
    
    first_pass = list(gen)
    second_pass = list(gen)
    
    return {
        "first_pass": first_pass,
        "second_pass": second_pass, # Will be empty!
        "explanation": "Generators can only be iterated over once. The second pass yields nothing."
    }

# 4. Datetime Timezone Bug
@router.get("/timezone-bug")
async def timezone_bug_example():
    naive = datetime.now()
    aware = datetime.now(timezone.utc)
    
    try:
        diff = aware - naive  # This will fail
    except Exception as e:
        error = str(e)
        
    return {
        "naive": naive.isoformat(),
        "aware": aware.isoformat(),
        "error_when_subtracting": error,
        "explanation": "You cannot subtract offset-naive and offset-aware datetimes."
    }

# 5. Circular Import (Explanation only, since an actual circular import would break the app at startup)
@router.get("/circular-import")
async def circular_import_explanation():
    return {
        "concept": "Module A imports B, and Module B imports A.",
        "symptom": "ImportError: cannot import name 'X' from partially initialized module 'Y'.",
        "fix": "Refactor to extract shared logic into Module C, or import locally inside a function instead of at the module level."
    }
