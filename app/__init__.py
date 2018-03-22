from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = "Y9%cv'_Sm9u=LAi"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://cycrlfvvypvdwt:07704ac40ef84a570437a75308b1f33b5ec3caf4601fa42f0f79a95886a81ac1@ec2-54-243-210-70.compute-1.amazonaws.com:5432/dd807rpu8rfpdb"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
app.config['UPLOAD_FOLDER'] = './app/static/uploads'

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views
