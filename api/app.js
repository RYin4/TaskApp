const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { List, Task } = require('./db/models');

//load middleware
app.use(bodyParser.json())

// CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//GET /lists
//purpose: to get all lists
app.get('/lists', (req, res) => {
    List.find().then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e)
    })
})

//POST /lists
//purpose: to create a list 
app.post('/lists', (req, res) => {
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })
});

//PATCH /lists/:id
//purpose: to update the specified list 
app.patch('/lists/:id', (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200)
    })
})

//DELETE /lists/:id
//purpose: to delete the specified list 
app.delete('/lists/:id', (req, res) => {
    List.findOneAndRemove({ _id: req.params.id }, {
    }).then((removedListDoc) => {
        res.send(removedListDoc)
    })
})

//GET /lists/:listId/tasks
//purpose: get all tasks in a specific list
app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks)
    })
})

//POST /lists/:listId/tasks
//purpose: create a new task in a specific list  
app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    })
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc)
    })
})

//PATCH /lists/:listId/tasks/:taskId
//purpose: update an existing task
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
        }
    ).then(() => {
        res.send({message: "Updated Sucessfully"})
    })
})  

//DELETE /lists/:listId/tasks/:taskId
//purpose: delete a task
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params._listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc)
    })
})

app.listen(3000, () => {
    console.log("server is listening on port 3000")
})
