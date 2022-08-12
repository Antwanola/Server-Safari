
// Async

const express = require('express');
const app = express();
const routes = require('./routes/routes')
, {notFound, errorMessage} = require('./helpers/error')
, morgan = require('morgan')
, connectDB = require('./db/connect')
, passport = require('passport')
, session = require('express-session')
, cors = require('cors')
require('./helpers/Auth/userAuth-google')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}



app.use(cors())
app.use(morgan('dev'))

app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{httpOnly:true}
  

}))
app.use(session())
app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());
//Google auth primitive code
app.use('/api/v1', routes)

app.use((req, res, next)=>{
    res.locals.user = req.user || null
    req.secret = 'bllodwhite'
    next()
})

app.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
app.get('/', (req,res)=>{

    res.send('Home')
})

app.get('/success', passport.authenticate('google', {scope:['profile', 'email']}), (req,res)=>{

    res.send('success')
})

app.get('/auth/google/failure',(req,res)=>{
    res.send('failure')
})


app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/success',
        failureRedirect: '/auth/google/failure'
}));


app.use(notFound)
app.use(errorMessage)


const port = process.env.PORT || 4000

const start = async ()=>{
try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Sever is running on port ${port} `))
    
} catch (error) {
    console.log(error)
}
}

start()

