from flask_wtf import FlaskForm
from wtforms import FileField, PasswordField, SelectField, StringField, TextField, TextAreaField
from flask_wtf.file import FileRequired, FileAllowed
from wtforms.validators import Email, InputRequired


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    
class ProfileForm(FlaskForm):
    f_name = TextField('First Name', validators=[InputRequired()])
    l_name = TextField('Last Name', validators=[InputRequired()])
    gender = SelectField('Gender', choices=[('male', 'Male'), ('female', 'Female')])
    email = TextField('Email', validators=[Email()])
    location = TextField('Location', validators=[InputRequired()])
    bio = TextAreaField('Biography', validators=[InputRequired()])
    photo = FileField('Profile Picture', validators=[FileRequired(), FileAllowed(['jpg', 'jpeg', 'png'])])
    
    