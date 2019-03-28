import React, {Component} from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
const APIURL = '/api/todos/';


class TodoList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      todos: []
    }
    this.addTodo = this.addTodo.bind(this);
  }
  
    componentWillMount() {
    this.loadTodos();
  }
  
  loadTodos() {
    fetch(APIURL)
    .then(res => {
        if(!res.ok) {
            if(res.status >=400 && res.status <500) {
                return res.json().then(data => {
                    let err = { errorMessage: data.message};
                    throw err;
                });
            } else {
                let err = {errorMessage: 'Check for the server response!'};
                throw err;
            }
        }
        
   return res.json();
  })
    .then(todos => this.setState({todos}));
 } 
 
 addTodo(text) {
      fetch(APIURL, {
          method: 'post',
          headers: new Headers({
              'Content-Type' : 'application/json',
          }),
          body: JSON.stringify({name: text})
      })
        .then(res => {
            if(!res.ok) {
                if(res.status >=400 && res.status <500) {
                    return res.json().then(data => {
                        let err = { errorMessage: data.message};
                        throw err;
                    });
                } else {
                    let err = {errorMessage: 'Check for the server response!'};
                    throw err;
                }
            }
            
       return res.json();
      })
        .then(newTodo => this.setState({todos: [...this.state.todos, newTodo]}));
 }
 
 deleteTodo(id) {
     const delURL = APIURL + id; 
     fetch(delURL, {
          method: 'delete'
      })
        .then(res => {
            if(!res.ok) {
                if(res.status >=400 && res.status <500) {
                    return res.json().then(data => {
                        let err = { errorMessage: data.message};
                        throw err;
                    });
                } else {
                    let err = {errorMessage: 'Check for the server response!'};
                    throw err;
                }
            }
            
       return res.json();
      })
        .then(() => {
            const todos = this.state.todos.filter(todo => todo._id !== id);
            this.setState({todos: todos});
        });
 }
 
    render() {
        const todos = this.state.todos.map((t) => (
            <TodoItem 
                key={t._id}
                {...t}
                onDelete = {this.deleteTodo.bind(this, t._id)}
                />
            ));
        return (
        <div>
          <h1>TodoList </h1>
          <TodoForm addTodo={this.addTodo} />
          <ul>
            {todos}
          </ul>
        </div> 
        );
    }
}

export default TodoList;