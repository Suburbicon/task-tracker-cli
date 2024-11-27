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
		console.error('Error handling the JSON file: ', error)
	}
}

async function main() {
	try {
		const userInput = await inputHandler('task-cli: ');

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
				console.log('add');
				break;
			case 'mark-in-done':
				console.log('add');
				break;
			case 'list':
				const data = fs.readFileSync(filePath, 'utf8');
				console.log('LIST TASKS 📝: ');
				console.info(JSON.parse(data));
				console.log('\n');
				break;
			case 'list done':
				console.log('add');
				break;
			case 'list todo':
				console.log('add');
				break;
			case 'list in-progress':
				console.log('add');
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