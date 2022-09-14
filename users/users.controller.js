const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const auditService=require('./audit.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/login', login)
router.get('/logout', logout)
router.get('/audit', getAllInfo)

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function login(req,res,next){
    userService.authenticate(req.body)
    .then((user) => {
        if(user){
            req.session.user=user 
            auditService.login(user)
        }
        else{
            res.status(400).json({ message: 'Username or password is incorrect' })
        }

    })
        .catch(err => next(err));
}

function logout(req,res,next){
    const user=req.session.user;
    auditService.logout(user).then((res)=>{
        req.session.user=null
    }).catch((err)=>{
        console.log(err)
    });
}

function getAllInfo(req,res,next){
  const user =req.session.user;
  if(user.role==='auditor'){
    auditService.getAll().then((data)=>{
        res.status(200).json(data)
    }).catch(err=>console.log(err))
  }
  else{
    res.status(401).send("User not in the role of auditor")
  }
}

