"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user, login_required
from forms import LoginForm, ProfileForm
from models import UserProfile
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename

import datetime


###
# Routing for your application.
###

@app.route('/')
def home():
    """Render website's home page."""
    return render_template('home.html')


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html')

@app.route('/profile', methods=["GET", "POST"])
def addProfile():
    pForm = ProfileForm()
    uFolder = app.config['UPLOAD_FOLDER']
    
    if request.method == "POST" and pForm.validate_on_submit():
        f_name = request.form['f_name']
        l_name = request.form['l_name']
        gender = request.form['gender']
        email = request.form['email']
        location = request.form['location']
        bio = request.form['bio']
        
        image_file = request.files['photo']
        filename = secure_filename(image_file.filename)
        image_file.save(os.path.join(uFolder, filename))
        
        now = datetime.datetime.now()
        joined = format_date_joined(now.year, now.month, now.day)
        
        user = UserProfile(f_name, l_name, gender, email, location, bio, filename, joined)
        
        db.session.add(user)
        db.session.commit()
        
        flash('New profile added!', 'sucess')
        return redirect(url_for('listProfiles'))
    return render_template('profile.html', pForm=pForm) 
    
def format_date_joined(year, month, day):
    date_joined = datetime.date(year, month, day)
    return date_joined.strftime("%B %d, %Y")
    
@app.route('/profiles')
def listProfiles():
    users = db.session.query(UserProfile).all()
    return render_template('profiles.html', users=users)
   
@app.route('/profile/<userid>', methods=["GET", "POST"])
def showProfile(userid):
    userid = str(userid)
    
    user = UserProfile.query.filter_by(id=userid).first()
    
    return render_template('user_profile.html', user=user)
    
###
#  This function stores the names of the uploaded images in the uploads folder and returns them as a list
###

def get_uploaded_images():
    rootdir = os.getcwd()
    
    file_list = []
    
    for subdir, dirs, files in os.walk(rootdir + '/app/static/uploads'):
        for file in files:
		    name, ext = os.path.splitext(file)
		    if ((ext == '.jpg') or (ext == '.jpeg') or (ext == '.png')):
		        file_list.append(file)
	return file_list
    
#@app.route("/login", methods=["GET", "POST"])
#def login():
#    form = LoginForm()
#    if request.method == "POST":
        # changed this to actually validate the entire form submission
        # and not just one field
#        if form.validate_on_submit():
#            u_name = form.username.data
#            pwd = form.password.data
            
#            user = UserProfile.query.filter_by(username=u_name, password=pwd).first()
            
#            if user is not None and check_password_hash(user.pwd, pwd):
#                remember_me = False

#                if 'remember_me' in request.form:
#                    remember_me = True
#                # get user id, load into session
#                login_user(user, remember=remember_me)

                # remember to flash a message to the user
#                flash('Successfully logged in', 'success')
#                return redirect(url_for('secure_page'))  # redirected to a secure-page route instead
#            else:
#                flash('Username or Password is incorrect.', 'danger')

#    flash_errors(form)
#    return render_template("login.html", form=form)

#@app.route('/logout')
#@login_required
#def logout():
#    """Logs out current user"""
#    logout_user()
    
#    flash ('You are now logged out', 'danger')
#    return redirect( url_for('home'))


@app.route('/secure-page')
@login_required
def secure_page():
    """Renders a secure page that only logged in users can access."""
    return render_template('secure_page.html')

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
#@login_manager.user_loader
#def load_user(id):
#    return UserProfile.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
