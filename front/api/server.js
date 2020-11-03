const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bodyParser = require('body-parser');

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter({
    "/api/*": "/$1"
});

const db = (req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = new Date().toISOString();
        req.body.lastModifiedAt = new Date().toISOString();
        req.body.id = uuidv4();
    }
    if (req.method === 'PUT') {
        req.method = 'PATCH';
        req.body.lastModifiedAt = new Date().toISOString();
    }
    if (req.method === 'GET') {
        ['createdAt', 'lastModifiedAt', 'purchasedOn'].forEach(key => {
            if (req.query[key] && req.query[key].substr(0, 6) === 'since,') {
                req.query[`${key}_gte`] = req.query[key].substr(6);
                delete req.query[key];
            }
        });
    }
    next();
}

server.use(bodyParser.json());
server.use(rewriter);
server.use(db);
server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log('Cleemy api is running on port 3000')
});
