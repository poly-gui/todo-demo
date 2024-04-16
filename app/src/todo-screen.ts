import { ApplicationContext } from "poly";
import {
	Button,
	Center,
	Column,
	FILL_PARENT,
	ListView,
	ListViewItem,
	PolyWidget,
	Row,
	Text,
	TextField,
	WidgetController,
} from "poly-widgets";

function randomTodoId() {
	return Math.floor(Math.random() * 2 ** 32);
}

interface Todo {
	id: number;
	content: string;
}

class TodoScreen extends WidgetController {
	private todoList: Todo[] = [];

	private readonly rootView: PolyWidget;
	private readonly textField: TextField;
	private readonly todoListView: ListView<TodoListItem>;

	constructor(context: ApplicationContext) {
		super(context);

		this.todoListView = new ListView(context);
		this.todoListView.width = FILL_PARENT;
		this.todoListView.itemHeight = 32;
		this.todoListView.itemCount = this.todoList.length;
		this.todoListView.onCreate = this.createTodoListItem.bind(this);
		this.todoListView.onBind = this.bindTodoListItem.bind(this);

		this.textField = new TextField(context);

		const addBtn = new Button(context);
		addBtn.label = "Add todo";
		addBtn.onClick = this.addNewTodo.bind(this);

		const row = new Row(context);
		row.width = FILL_PARENT;
		row.addChildren(this.textField, addBtn);

		const col = new Column(context);
		col.width = FILL_PARENT;
		col.height = FILL_PARENT;
		col.addChildren(row, this.todoListView);

		this.rootView = col;
	}

	widget(): PolyWidget {
		return this.rootView;
	}

	private addNewTodo() {
		this.todoList.push({
			id: randomTodoId(),
			content: this.textField.value,
		});
		this.todoListView.update(() => {
			this.todoListView.appendItem();
		});
	}

	private createTodoListItem(): TodoListItem {
		return new TodoListItem(this.context);
	}

	private bindTodoListItem({
		itemIndex,
		item,
	}: { itemIndex: number; item: TodoListItem }): [PolyWidget] {
		const todo = this.todoList[itemIndex];
		item.contentText.content = todo.content;
		item.onMarkedDone = () => {
			this.markTodoAsDone(todo);
		};
		return [item.contentText];
	}

	private markTodoAsDone(todo: Todo) {
		const i = this.todoList.indexOf(todo);
		this.todoList.splice(i, 1);
		this.todoListView.update(() => {
			this.todoListView.deleteItems(i);
		});
	}
}

class TodoListItem extends ListViewItem {
	public readonly contentText: Text;
	public onMarkedDone!: () => void;

	private rootView: PolyWidget;

	constructor(context: ApplicationContext) {
		super(context);

		this.contentText = new Text(context);

		const doneBtn = new Button(context);
		doneBtn.label = "Done";
		doneBtn.onClick = this.markTodoAsDone.bind(this);

		const row = new Row(context);
		row.addChildren(this.contentText, doneBtn);

		const center = new Center(context);
		center.child = row;
		this.rootView = center;
	}

	widget(): PolyWidget {
		return this.rootView;
	}

	private markTodoAsDone() {
		this.onMarkedDone();
	}
}

export { TodoScreen };
