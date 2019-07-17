const express= require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const methodOverride = require('method-override');
const session=require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

//Load  Ideas Routes
const dossiers = require('./routes/dossiers');
//Load Users Route
const users = require('./routes/users');

//BodyParser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Static folder for css,img
app.use(express.static(path.join(__dirname, './public')));  //Public folder will be use for static activites like css,img

//Method Override Middleware
app.use(methodOverride('_method'));

//Config Passport
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Mongoose Middleware
mongoose.connect(db.mongoURI)
.then(()=> console.log("Mongoose connected"))
.catch(err => console.log(err));

//HandleBars(Template Engine) Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));   //It means our template should contain views folder and inside that view folder you should contain one layouts folder and inside that layouts folder you should contain one main.handlebars file
app.set('view engine', 'handlebars');

//Express-session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-Flash Middleware
app.use(flash());

//GlobalVariables Middlewares
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
}); 

//Index Route(Home Page Route)
app.get('/', (req,res) => {
    let title = "Welcome Guys"
    res.render('index' , {
        title: title
    });
});

//About Route
app.get('/about', (req,res)=>{
    res.render('about');
});

//Use Ideas
app.use('/dossiers',dossiers);

//Use users Routes
app.use('/users',users);

const port = process.env.PORT || 5000;
app.listen(port,()=>
{
    console.log(`Starting server at ${port}`);
});