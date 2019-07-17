module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash('error_msg','You are not Authorized to use this Web App.Login First');
        res.redirect('/users/login');
    }
}