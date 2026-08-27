import random

class FakeRedis:
    def __init__(self):
        self.data = {}
        self.is_connected = True

    def get(self, key: str):
        if not self.is_connected:
            raise Exception("Redis connection failed")
        return self.data.get(key)

    def set(self, key: str, value: str):
        if not self.is_connected:
            raise Exception("Redis connection failed")
        self.data[key] = value

    def simulate_failure(self):
        self.is_connected = False

    def recover(self):
        self.is_connected = True

cache = FakeRedis()
