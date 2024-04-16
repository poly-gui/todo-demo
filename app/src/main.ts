import {
	createApplication,
	runApplication,
	createWindow,
	StdioChannel,
} from "poly";
import { TodoScreen } from "./todo-screen";

async function main() {
	const context = createApplication({
		messageChannel: new StdioChannel(),
	});

	const instance = runApplication(context);

	await createWindow(
		{
			title: "TodoPoly",
			description: "A Poly application written in TypeScript.",
			width: 600,
			height: 400,
			tag: "main",
		},
		context,
	);

	const screen = new TodoScreen(context);
	await screen.widget().show({ window: "main" });

	await instance;
}

main();
