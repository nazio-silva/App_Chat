//Referenciando nossos modulos
var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var error = require('./middlewares/error');
var app = express(); //instancia do express
var server = require('http').Server(app);
var io = require('socket.io')(server);

//Configurando nossos Middlewares
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(expressSession());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));//reaproveitando rotas dos metodos http
app.set(express.static(__dirname + '/public'));

//Carregando os modulos do diretorio MVC
load('models')
	.then('controllers')
	.then('routes')
	.into(app);

	//Middllewares de tratamento de erros
app.use(error.notFound);
app.use(error.serverError);

io.sockets.on('connection', function(client) {
	client.on('send-server', function(data) {
		var msg = "<b>" + data.nome + ":</b>" + data.msg + "<br>";
		client.emit('send-client', msg);
		client.broadcast.emit('send-client', msg);
	});
});
	
//Subindo Servidor
server.listen(3000, function() {
	console.log("Servidor Ntalk rodando!");
});

