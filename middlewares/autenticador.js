module.exports = function(req, res, next) {
	if(!req.session.usuario) {
		return res.redirect('/');
	}
	return next();
};

//Verifica se o usuario esta autenticado