// import user-defidned modules or Schema
const User = require("../models/User");
const Todo = require("../models/Todo");

exports.createTodo = async (req, res) => {
    const newTodo = {
        title: req.body.title,
        body: req.body.body,
        status: false,
        owner: req.user._id,
    };
    const todo = new Todo(newTodo);

    todo.save((err) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Error has occured",
            });
        } else {
            req.user.todos.push(todo); //push ObjectID of newly created todo to the user's todos array
            req.user.save((err) => {
                if (err)
                    res.status(500).json({
                        error: true,
                        errorBody: "Error has occured",
                    });
                else
                    res.status(201).json({
                        error: false,
                        message: "Successfully Published the Article",
                    });
            });
        }
    });
};

exports.profile = async (req, res) => {
    // req.params.username is the actual username form the route
    // whereas, req.user.email is the logged in user
    if (req.params.username !== req.user.email) {
        res.status(401).json({
            error: true,
            errorBody: "User email and params does not match",
        });
    } else {
        User.findById({ _id: req.user._id })
            .populate("todos")
            .exec((err, document) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgError: true,
                            msgBody: "Error has occured",
                        },
                    });
                else {
                    req.user.password = undefined;
                    req.user.todos = undefined;
                    res.status(200).json({
                        user: req.user,
                        todos: document.todos,
                    });
                }
            });
    }
};
