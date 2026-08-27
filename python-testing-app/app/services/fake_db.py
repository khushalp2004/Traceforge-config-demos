from app.models.user import User

# In-memory database simulation for testing without a real DB container sometimes
class FakeDB:
    def __init__(self):
        self.users = {}
        self.counter = 1

    def add_user(self, user: User) -> User:
        user.id = self.counter
        self.users[self.counter] = user
        self.counter += 1
        return user

    def get_user_by_email(self, email: str) -> User | None:
        for user in self.users.values():
            if user.email == email:
                return user
        return None
        
    def get_user_by_username(self, username: str) -> User | None:
        for user in self.users.values():
            if user.username == username:
                return user
        return None

    def get_user(self, user_id: int) -> User | None:
        return self.users.get(user_id)

db = FakeDB()
