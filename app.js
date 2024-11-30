const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');
const { STATUSES, filePath } = require('./config')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

function inputHandler(query) {
	return new Promise((res) => rl.question(query, res))
}

console.log("Welcome to the Task Tracker CLI App! Type 'q' to stop. 👾");

function addTask(taskDescription) {
	const idTask = crypto.randomBytes(8).toString('hex');
	const task = {
		id: idTask,
		description: taskDescription,
		status: STATUSES.TODO,
		createdAt: new Date(),
		updatedAt: new Date()
	}

	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		jsonData.push(task);

		fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

		console.log('Object added successfully!');
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function updateTask(id, taskDescription) {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		let existedTask = jsonData.find(jd => jd.id === id);

		if (!existedTask) {
			console.info(`Not found task by id: ${id}`);
		} else {
			existedTask.description = taskDescription;
			existedTask.updateAt = new Date();

			fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

			console.log('Task updated successfully!');
		}
	} catch (error) {
		console.error('Error handling the JSON file: ', error)
	}
}

function deleteTask(id) {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		let existedTask = jsonData.find(jd => jd.id === id);

		if (!existedTask) {
			console.info(`Not found task by id: ${id}`);
		} else {
			const updatedJsonData = jsonData.filter(jd => jd.id !== id);
			fs.writeFileSync(filePath, JSON.stringify(updatedJsonData, null, 2), 'utf8');

			console.log('Task deleted successfully!');
		}
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function serializeDiplayTask(data) {
	data.forEach((task, n) => {
		console.log(`№${n+1}.`)
		console.log(`id: ${task.id}`);
		console.log(`description: ${task.description}`);
		console.log(`status: ${task.status}`);
		console.log(`created at: ${task.createdAt}`);
		console.log(`updated at: ${task.updatedAt}`);
		console.log('\n');
	});
}

function displayList() {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		console.log('\nLIST TASKS 📝: ');
		serializeDiplayTask(JSON.parse(data));
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function displayListInDone() {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		console.log('\nLIST TASKS IN DONE 📝: ');
		const filteredData = JSON.parse(data).filter(d => d.status === STATUSES.DONE);
		serializeDiplayTask(filteredData);
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function displayListInProgress() {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		console.log('\nLIST TASKS IN PROGRESS 📝: ');
		const filteredData = JSON.parse(data).filter(d => d.status === STATUSES.IN_PROGRESS);
		serializeDiplayTask(filteredData);
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function displayListInTodo() {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		console.log('\nLIST TASKS IN TODO 📝: ');
		const filteredData = JSON.parse(data).filter(d => d.status === STATUSES.TODO);
		serializeDiplayTask(filteredData);
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function markInProgress(id) {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		const existedTask = jsonData.find(jd => jd.id === id);

		if (!existedTask) {
			console.info(`Not found task by id: ${id}`);
		} else {
			existedTask.status = STATUSES.IN_PROGRESS;
			console.log('Task marked as IN PROGRESS');
			fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
		}
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

function markInDone(id) {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		const existedTask = jsonData.find(jd => jd.id === id);

		if (!existedTask) {
			console.info(`Not found task by id: ${id}`);
		} else {
			existedTask.status = STATUSES.DONE;
			console.log('Task marked as IN DONE');
			fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
		}
	} catch (error) {
		console.error('Error handling the JSON file: ', error);
	}
}

async function main() {
	try {
		const userInput = await inputHandler('\ntask-cli: ');

		const [command, ...value] = userInput.split(' ');
		const [id, ...description] = value;

		switch(command) {
			case 'q':
				console.log('Goodbye!');
      	rl.close();
			case 'add':
				addTask(value.join(' '));
				break;
			case 'update':
				updateTask(id, description.join(' '));
				break;
			case 'delete':
				deleteTask(id);
				break;
			case 'mark-in-progress':
				markInProgress(id);
				break;
			case 'mark-in-done':
				markInDone(id);
				break;
			case 'list':
				displayList();
				break;
			case 'list-done':
				displayListInDone();
				break;
			case 'list-todo':
				displayListInTodo();
				break;
			case 'list-in-progress':
				displayListInProgress();
				break;
			default: 
				console.log('Unknowm command ❌, Please try again...')
		}
		
		main();
	} catch (error) {
		console.error('An error occurred:', error.message);
	}
}


main();