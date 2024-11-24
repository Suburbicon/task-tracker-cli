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
		description: taskDescription.join(' '),
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
		console.error('Error handling the JSON file:', err);
	}
}

async function main() {
	try {
		const userInput = await inputHandler('task-cli: ');

		const [command, ...value] = userInput.split(' ')
		
		switch(command) {
			case 'q':
				console.log('Goodbye!');
      	rl.close();
			case 'add':
				addTask(value);
				break;
			case 'update':
				console.log('add');
				break;
			case 'delete':
				console.log('add');
				break;
			case 'mark-in-progress':
				console.log('add');
				break;
			case 'mark-in-done':
				console.log('add');
				break;
			case 'list':
				console.log('add');
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