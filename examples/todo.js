class ToDo {
    constructor() {
        this.todoItems = [
            { text: 'do this...' },
            { text: 'do that...' }
        ];
        ex.introduce('todos', this.todoItems);
        ex.introduce('addtodo', this.addTodo);

        this.persons = [
            { firstname: 'Homer', lastname: 'Simpson' },
            { firstname: 'Marge', lastname: 'Simpson' },
            { firstname: 'Bart', lastname: 'Simpson' },
            { firstname: 'Lisa', lastname: 'Simpson' },
            { firstname: 'Maggie', lastname: 'Simpson' }
        ];
        ex.introduce('persons', this.persons);
    }

    addTodo(evt) {
        evt.preventDefault();
        if (evt.key !== 'Enter') {
            return false;
        }

        console.log('add toto...');
    }
}

const td = new ToDo();
