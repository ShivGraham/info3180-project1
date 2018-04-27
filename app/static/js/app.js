/* Add your Application JavaScript */
//FIX HEADER & FOOTER COMPONENTS
Vue.component('app-header', {
    template: `
   
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color:#4c8ef7;">
      <a class="navbar-brand" href="#"><img src='http://www.yim778.com/data/out/217/1289093.png' class='image1' alt='camera' style="width:35px; height:35px;"><h4>Photogram</h4></i></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        
          <li class="nav-item active">
            <router-link class="nav-link"to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/register">Register<span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/users/{user_id}">My Profile <span class="sr-only">(current)</span></router-link>
          </li>
          
          
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Register = Vue.component('register', {
    template: `
    <div class="jumbotron">
        <h2>Register</h2>
        <div id='conta'>
            <div v-if="messages.errors" v-for="m in messages" class="alert alert-danger">
                <li v-for="error in m">    
                    {{ error }}
                </li>
            </div>
            <div v-else="messages.info" v-for="info in messages" class="alert alert-success">
                {{ info.message }}
            </div>
            
            <form method="post" enctype="multipart/form-data" id="registerForm" @submit.prevent="uploadInfo">
                <br>
                <label> Username </label><br>
                <input type="text" name="username"><br>
                <br>
                
                <label> Password </label><br>
                <input type="password" name="password"><br>
                <br>
        
                <label> First Name </label><br>
                <input type="text" name="firstname"><br>
                <br>
                
                <label> Last Name </label><br>
                <input type="text" name="lastname"><br>
                <br>
        
                <label> Email </label><br>
                <input type="text" name="email"><br>
                <br>
        
                <label> Location </label><br>
                <input type="text" name="location"><br>
                <br>
        
                <label> Biography </label><br>
                <textarea name="biography"></textarea><br>
                <br>
                
                <div>
                    <label for="photo">Photo</label>
                    <div> <input type="file" id="photo" name="profile_photo" /> </div>
                </div>
                <br><br>
                
                <button class="btn btn-success2" type="submit" name="submit">Register</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        uploadInfo: function() {
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm);
            let self = this;
            
            fetch("/api/users/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    console.log(jsonResponse);
                    
                    if (jsonResponse.hasOwnProperty('info'))
                    {
                        console.log(jsonResponse.info);
                        router.push('/login')
                        
                    }
                    else if (jsonResponse.hasOwnProperty('errors'))
                    {
                        console.log(jsonResponse.errors);
                    }
                    self.messages = jsonResponse;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        
    },
    data: function() {
        return {
            messages: []
        }
    }
});

const Login = Vue.component('login', {
    template: `
    <div class="jumbotron">
        <h2>Login</h2>
        <div id='contain'>
            <div v-if="messages.errors" v-for="m in messages" class="alert alert-danger">
                <li v-for="error in m">    
                    {{ error }}
                </li>
            </div>
            <div v-else="messages.info" v-for="info in messages" class="alert alert-success">
                {{ info.message }}
            </div>
            
            <form method="POST" enctype="multipart/form-data" id="loginForm" @submit.prevent="authUser">
            <br>
                <label> Username </label><br>
                <input type="text" name="username"><br>
                <br>
            
                <label> Password </label><br>
                <input type="password" name="password"><br>
                <br>
    
                <button class="btn btn-success3" type="submit" name="submit">Login</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        authUser: function() {
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            let self = this;
            
            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    console.log(jsonResponse);
                    
                    if (jsonResponse.hasOwnProperty('info'))
                    {
                        let jwt_token = jsonResponse.info.token;
                        
                        localStorage.setItem('token', jwt_token);
                        console.info('Token generated and added to localStorage.');
                        self.token = jwt_token;
                        router.push('/users')
                    }
                    else if (jsonResponse.hasOwnProperty('errors'))
                    {
                        console.log(jsonResponse.errors);
                    }
                    self.messages = jsonResponse;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {
            messages: [],
            token: ''
        }
    }
});

const Logout = Vue.component('logout', {
    template: `
    `,
    created: function() {
        fetch("/api/auth/logout", {
            method: 'GET',
            'headers': {
                // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
                Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                console.log(jsonResponse);
                    
                if (jsonResponse.hasOwnProperty('info'))
                {
                    localStorage.removeItem('token');
                    console.info('Token removed from localStorage.');
                        
                    self.messages = jsonResponse;
                    router.push('/')
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    data: function() {
        return {
            messages: []
        }
    }
});

const Explore = Vue.component('explore', {
    template: `
    <div id="container">
        <div v-for="post in posts">
            <div class="card">
                <div class="card-header">
                    <img :src="{{ url_for('static', filename = 'images/' + 'icon.png') }}" id="iconImg"/> 
                    <div>{{ post.user_id }} </div> <!--change to print username-->
                </div>
                
                <div class="card-body">
                    <img :src="{{ url_for('static', filename = 'uploads/' + post.photo) }}" />
                    
                    <div class="info">
                        {{ post.caption }}
                    </div>
                </div>
                
                <div class="card-footer">
                    <!--add # likes -->
                    <div> {{ post.created_on }} </div>
                </div>
            </div>
        </div>
        
        <div>
            <button class="btn btn-primary" id="exBtn" @click="makePost">New Post</button>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        
        fetch("/api/posts", {
            method: 'GET',
            'headers': {
                // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
                Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                console.log(jsonResponse);
                    
                if (jsonResponse.hasOwnProperty('info'))
                {
                    self.posts = jsonResponse.info;
                    console.log(jsonResponse.info);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods:
    {
        makePost: function() {
            let self = this;
            
            self.$router.push({path: '/posts/new'})
        }
    },
    data: function() {
        return {
            posts: []
        }
    }
});

const NewPost = Vue.component('newPost',{
    template:`
    <div class='jumbotron'>
    <div id="justneedaroot">
        <br>
        <h2>New Post</h2>
        <div id='contain'>
            <br>
            <br>
            <h5><label>Photo</label></h5>
            <input type="file" id="photo" name="profile_photo" />
            <br><br><h5><label> Caption </label></h5>
            <textarea name="caption" placeholder="Write a caption"></textarea><br><br>
            <button class="btn btn-success" id='buttn' type="submit" name="submit">Submit</button>
        </div>
    </div>
    </div>
    `,
    methods: {
        
    },
    data: function() {
        return {}
    }
});

const Profile = Vue.component('profile', {
    template: `
    <div class='formed'>
    <img src="{{ url_for('static', filename='uploads/'+user.profile_photo) }}" height="200" width="200"/>
    <br>
                {{user.firstname+" "+user.lastname}}
                <br>
                <div class='info'>{{user.location}}</div>
                <br>
                <div class='info'>Joined on {{user.created_on}}</div>
                <br>
                <p calss="card-text">{{ user.biography}}</p>
     </div>
    `,
    methods: {
        
    },
    data: function() {
        return {}
    }
});

const Post = Vue.component('post', {
    template: `
    `,
    methods: {
        
    },
    data: function() {
        return {}
    }
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <div id='pic'>
    <img src="https://www.w3schools.com/html/img_girl.jpg" class="image2" alt="Girl in a jacket" style="width:1000px;height:1000px;">
    </div>
    <div id='cont'>
        <i class="material-icons" style="font-size:45px">camera_alt</i><h1>Photogram</h1>
        <hr>
        <p class="lead">Photogram allows family members and friends to share pictures with each other.</p>
        <br>
        <br>
        <div class='but'>
        <div id='left'>
        <button class="btn btn-success"@click="gotoregister" >Register</button>
        </div>
        <div id='right'>
        <button class="btn btn-primary" @click="gotologin">Login</button>
        </div>
        </div>
    </div>
    </div>
   `,
    data: function() {
       return {}
    },
    methods:
    {
        gotologin: function()
        {
            let self=this;
            //const self=this;
            self.$router.push({path: '/login'})
        },
        gotoregister: function()
        {
            //t.self=this;
            const self=this
            self.$router.push({path: '/register'})
        }
        
    }
});

// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/register", component: Register },
        { path: "/login", component: Login },
        { path: "/logout", component: Logout },
        { path: "/explore", component: Explore },
        { path: "/users/{user_id}", component: Profile },
        { path: "/posts/new", component: NewPost }
    ]
});

// Instantiate our main Vue Instance
const app = new Vue({
    el: "#app",
    router
});/* Add your Application JavaScript */
//FIX HEADER & FOOTER COMPONENTS
Vue.component('app-header', {
    template: `
   
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color:#4c8ef7;">
      <a class="navbar-brand" href="#"><img src='http://www.yim778.com/data/out/217/1289093.png' class='image1' alt='camera' style="width:35px; height:35px;"><h4>Photogram</h4></i></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        
          <li class="nav-item active">
            <router-link class="nav-link"to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/register">Register<span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/users/{user_id}">My Profile <span class="sr-only">(current)</span></router-link>
          </li>
          
          
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Register = Vue.component('register', {
    template: `
    <div class="jumbotron">
        <h2>Register</h2>
        <div id='conta'>
            <div v-if="messages.errors" v-for="m in messages" class="alert alert-danger">
                <li v-for="error in m">    
                    {{ error }}
                </li>
            </div>
            <div v-else="messages.info" v-for="info in messages" class="alert alert-success">
                {{ info.message }}
            </div>
            
            <form method="post" enctype="multipart/form-data" id="registerForm" @submit.prevent="uploadInfo">
                <br>
                <label> Username </label><br>
                <input type="text" name="username"><br>
                <br>
                
                <label> Password </label><br>
                <input type="password" name="password"><br>
                <br>
        
                <label> First Name </label><br>
                <input type="text" name="firstname"><br>
                <br>
                
                <label> Last Name </label><br>
                <input type="text" name="lastname"><br>
                <br>
        
                <label> Email </label><br>
                <input type="text" name="email"><br>
                <br>
        
                <label> Location </label><br>
                <input type="text" name="location"><br>
                <br>
        
                <label> Biography </label><br>
                <textarea name="biography"></textarea><br>
                <br>
                
                <div>
                    <label for="photo">Photo</label>
                    <div> <input type="file" id="photo" name="profile_photo" /> </div>
                </div>
                <br><br>
                
                <button class="btn btn-success2" type="submit" name="submit">Register</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        uploadInfo: function() {
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm);
            let self = this;
            
            fetch("/api/users/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    console.log(jsonResponse);
                    
                    if (jsonResponse.hasOwnProperty('info'))
                    {
                        console.log(jsonResponse.info);
                        router.push('/login')
                        
                    }
                    else if (jsonResponse.hasOwnProperty('errors'))
                    {
                        console.log(jsonResponse.errors);
                    }
                    self.messages = jsonResponse;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        
    },
    data: function() {
        return {
            messages: []
        }
    }
});

const Login = Vue.component('login', {
    template: `
    <div class="jumbotron">
        <h2>Login</h2>
        <div id='contain'>
            <div v-if="messages.errors" v-for="m in messages" class="alert alert-danger">
                <li v-for="error in m">    
                    {{ error }}
                </li>
            </div>
            <div v-else="messages.info" v-for="info in messages" class="alert alert-success">
                {{ info.message }}
            </div>
            
            <form method="POST" enctype="multipart/form-data" id="loginForm" @submit.prevent="authUser">
            <br>
                <label> Username </label><br>
                <input type="text" name="username"><br>
                <br>
            
                <label> Password </label><br>
                <input type="password" name="password"><br>
                <br>
    
                <button class="btn btn-success3" type="submit" name="submit">Login</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        authUser: function() {
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            let self = this;
            
            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    console.log(jsonResponse);
                    
                    if (jsonResponse.hasOwnProperty('info'))
                    {
                        let jwt_token = jsonResponse.info.token;
                        
                        localStorage.setItem('token', jwt_token);
                        console.info('Token generated and added to localStorage.');
                        self.token = jwt_token;
                        router.push('/users')
                    }
                    else if (jsonResponse.hasOwnProperty('errors'))
                    {
                        console.log(jsonResponse.errors);
                    }
                    self.messages = jsonResponse;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {
            messages: [],
            token: ''
        }
    }
});

const Logout = Vue.component('logout', {
    template: `
    `,
    created: function() {
        fetch("/api/auth/logout", {
            method: 'GET',
            'headers': {
                // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
                Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                console.log(jsonResponse);
                    
                if (jsonResponse.hasOwnProperty('info'))
                {
                    localStorage.removeItem('token');
                    console.info('Token removed from localStorage.');
                        
                    self.messages = jsonResponse;
                    router.push('/')
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    data: function() {
        return {
            messages: []
        }
    }
});

const Explore = Vue.component('explore', {
    template: `
    <div id="container">
        <div v-for="post in posts">
            <div class="card">
                <div class="card-header">
                    <img :src="{{ url_for('static', filename = 'images/' + 'icon.png') }}" id="iconImg"/> 
                    <div>{{ post.user_id }} </div> <!--change to print username-->
                </div>
                
                <div class="card-body">
                    <img :src="{{ url_for('static', filename = 'uploads/' + post.photo) }}" />
                    
                    <div class="info">
                        {{ post.caption }}
                    </div>
                </div>
                
                <div class="card-footer">
                    <!--add # likes -->
                    <div> {{ post.created_on }} </div>
                </div>
            </div>
        </div>
        
        <div>
            <button class="btn btn-primary" id="exBtn" @click="makePost">New Post</button>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        
        fetch("/api/posts", {
            method: 'GET',
            'headers': {
                // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
                Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                console.log(jsonResponse);
                    
                if (jsonResponse.hasOwnProperty('info'))
                {
                    self.posts = jsonResponse.info;
                    console.log(jsonResponse.info);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods:
    {
        makePost: function() {
            let self = this;
            
            self.$router.push({path: '/posts/new'})
        }
    },
    data: function() {
        return {
            posts: []
        }
    }
});

const NewPost = Vue.component('newPost',{
    template:`
    <div class='jumbotron'>
    <div id="justneedaroot">
        <br>
        <h2>New Post</h2>
        <div id='contain'>
            <br>
            <br>
            <h5><label>Photo</label></h5>
            <input type="file" id="photo" name="profile_photo" />
            <br><br><h5><label> Caption </label></h5>
            <textarea name="caption" placeholder="Write a caption"></textarea><br><br>
            <button class="btn btn-success" id='buttn' type="submit" name="submit">Submit</button>
        </div>
    </div>
    </div>
    `,
    methods: {
        
    },
    data: function() {
        return {}
    }
});

const Profile = Vue.component('profile', {
    template: `
    <div class='formed'>
    <img src="{{ url_for('static', filename='uploads/'+user.profile_photo) }}" height="200" width="200"/>
    <br>
                {{user.firstname+" "+user.lastname}}
                <br>
                <div class='info'>{{user.location}}</div>
                <br>
                <div class='info'>Joined on {{user.created_on}}</div>
                <br>
                <p calss="card-text">{{ user.biography}}</p>
     </div>
    `,
    methods: {
        
    },
    data: function() {
        return {}
    }
});

const Post = Vue.component('post', {
    template: `
    `,
    methods: {
        
    },
    data: function() {
        return {}
    }
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <div id='pic'>
    <img src="https://www.w3schools.com/html/img_girl.jpg" class="image2" alt="Girl in a jacket" style="width:1000px;height:1000px;">
    </div>
    <div id='cont'>
        <i class="material-icons" style="font-size:45px">camera_alt</i><h1>Photogram</h1>
        <hr>
        <p class="lead">Photogram allows family members and friends to share pictures with each other.</p>
        <br>
        <br>
        <div class='but'>
        <div id='left'>
        <button class="btn btn-success"@click="gotoregister" >Register</button>
        </div>
        <div id='right'>
        <button class="btn btn-primary" @click="gotologin">Login</button>
        </div>
        </div>
    </div>
    </div>
   `,
    data: function() {
       return {}
    },
    methods:
    {
        gotologin: function()
        {
            let self=this;
            //const self=this;
            self.$router.push({path: '/login'})
        },
        gotoregister: function()
        {
            //t.self=this;
            const self=this
            self.$router.push({path: '/register'})
        }
        
    }
});

// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/register", component: Register },
        { path: "/login", component: Login },
        { path: "/logout", component: Logout },
        { path: "/explore", component: Explore },
        { path: "/users/{user_id}", component: Profile },
        { path: "/posts/new", component: NewPost }
    ]
});

// Instantiate our main Vue Instance
const app = new Vue({
    el: "#app",
    router
});