from . import db

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    
    id = db.Column(db.Integer, primary_key=True, unique=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    #username = db.Column(db.String(80), unique=True)
    #password = db.Column(db.String(255))
    gender = db.Column(db.String(6))
    email = db.Column(db.String(120), unique=True)
    location = db.Column(db.String(50))
    bio = db.Column(db.String(100))
    photo_name = db.Column(db.String(100))
    created_on = db.Column(db.DateTime)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __init__(self, first_name, last_name, gender, email, location, bio, photo_name, created_on):
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.email = email
        self.location = location
        self.bio = bio
        self.photo_name = photo_name
        self.created_on = created_on
        
    def __repr__(self):
        return '<User %r>' % (self.first_name)
