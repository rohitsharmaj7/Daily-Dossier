if(process.env.NODE_ENV === 'production'){
    module.exports={ mongoURI:'mongodb://rohitsharmaj7:rohitsharmaj7@ds349455.mlab.com:49455/diary'}
}
else{
    module.exports = {mongoURI:'mongodb://localhost/diary'}
}
