module.exports = function (req, res, con, next) {
    if(req.cookies.hash == undefined || req.cookies.id == undefined) {
        res.redirect('/login');
        return false;
    }
    con.query(
        'SELECT * FROM user WHERE id=' + req.cookies.id + ' and hash="' + req.cookies.password + '"',
        function (error, result) {
          if (error) throw error;
          if (result.length == 0) {
            console.log('error user not found');
            res.redirect('/login');
          }
          else {
            next()
          }
        })
}