const checkAuth = (req, res, next) => {
/*const sidFromUser = req.cookies.sid

if (sesions[sidFromUser] ) {
    return next()
}*/

const currentUser = req.session?.user

  if (currentUser) {
    return next()
  }

    res.redirect('/auth/signin')
}

module.exports = {
    checkAuth,
}