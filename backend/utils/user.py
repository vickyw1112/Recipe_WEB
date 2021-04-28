from flask_login import UserMixin, login_user, current_user

class User(UserMixin):
    def __init__(self, name, email, uid):
        super()
        self.email = email
        self.name = name
        self.user_id = str(uid)

    def get_id(self):
        return self.user_id
