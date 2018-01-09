function ToDoList(selector, listUniqueId) {
    //TODO check if selector is valid
    this.container = document.querySelector(selector)
    this.tasks = []
    this.listUniqueId = listUniqueId || Date.now()

    this.init()
    this.render()
}

ToDoList.prototype.load = function () {
    var list = JSON.parse(
        localStorage.getItem('toDoList' + this.listUniqueId) || '[]'
    )
    var self = this
    list.forEach(function (taskFromLocalStorage) {
        self.addTask(taskFromLocalStorage.text, taskFromLocalStorage.completed)
    })
}

ToDoList.prototype.save = function () {
    var newListToSave = JSON.stringify(
        this.tasks.map(function (task) {
        return {text: task.text, completed: task.completed}
    })
    )
    localStorage.setItem('toDoList' + this.listUniqueId, newListToSave)

}

ToDoList.prototype.init = function () {
    this.newToDoInput = document.createElement('input')
    this.addToDoButton = document.createElement('button')
    this.tasksContainer = document.createElement('div')
    this.addToDoButton.innerText ='Add'

    var self = this
    this.addToDoButton.addEventListener('click', function(){
        self.addTask(self.newToDoInput.value)
        self.newToDoInput.value = ''
    })

    this.container.appendChild(this.newToDoInput)
    this.container.appendChild(this.addToDoButton)
    this.container.appendChild(this.tasksContainer)
}

ToDoList.prototype.addTask = function (taskText, completed) {
    this.tasks.push(new Task(taskText, this, completed))
    this.render()
}

ToDoList.prototype.deleteTask = function (task) {
    var taskIndex = this.tasks.indexOf(task)
    this.tasks = deleteArrayElement(this.tasks, taskIndex)
    this.render()

    function deleteArrayElement(array, index){
        return array.slice(0, index).concat(array.slice(index + 1))
    }
}

ToDoList.prototype.render = function () {
    this.save()
    var self = this
    this.tasksContainer.innerHTML=''
    this.tasks.forEach(function(task) {
        self.tasksContainer.appendChild(task.makeDiv())
    })
}

function Task(taskText, list, completed) {
    this.text = taskText
    this.list = list
    this.completed = completed || false
}

Task.prototype.makeDiv = function () {
    var wrapper = document.createElement('div')

    var div = document.createElement('div')
    div.innerText = this.text

    var button = document.createElement('button')
    button.innerText = 'Delete'

    if (this.completed) {
        div.className = 'completed'
    }

    div.addEventListener('click', this.toggleComplete.bind(this))

    var self=this
    button.addEventListener('click', function() {
        self.list.deleteTask(self)
    })

    wrapper.appendChild(div)
    wrapper.appendChild(button)

    return wrapper

}

Task.prototype.toggleComplete = function () {
    this.completed = !this.completed
    this.list.render()
}

var toDo = new ToDoList('body')

toDo.addTask('first task')
console.log(toDo)