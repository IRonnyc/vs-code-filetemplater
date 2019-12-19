// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path')
const os = require('os');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function getUserInput(msg) {
	let inputbox = vscode.window.createInputBox();
	inputbox.prompt = msg;
	return new Promise((resolve) => {
		inputbox.onDidAccept(function() {
			inputbox.hide();
			resolve(inputbox.value);
		});
		inputbox.show();
	});
}

async function createFileFromTemplate() {
	/*let source = await getUserInput("Which template should I use?").catch((err) => { vscode.window.showErrorMessage(err); });
	source = source.replace(/^~/, os.homedir());
	console.log(source);
	let target = await getUserInput("Where should I put your file?").catch((err) => { vscode.window.showErrorMessage(err); });
	target = target.replace(/^~/, os.homedir());
	console.log(target);
	*/
	let source = "/home/nicolas/ownCloud/Pen-and-Paper/Dalam/Kampagne 2/Notes/LaTeX/template.tex";
	let target = "/home/nicolas/ownCloud/Pen-and-Paper/Dalam/Kampagne 2/Notes/LaTeX/test.tex";

	let text = fs.readFileSync(path.resolve(__dirname, source)).toString('utf8');

	let i = 1;
	while (text.indexOf("$" + i) != -1) {
		text = text.replace("$" + i, await getUserInput("Parameter " + i));
	}

	let parameter_name = null;
	console.log("matches: " + text.match(/\$\w+/));
	while ((parameter_name = text.match(/\$\w+/)) != null) {
		let search = parameter_name[0];
		let replacement = await getUserInput("Parameter " + parameter_name[0]);
		text = text.split(search).join(replacement);
	}
	fs.writeFile(target, text, (err) => {
		if (err) { vscode.window.showErrorMessage(err.toString()); };
		vscode.window.showInformationMessage("File created");
	});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "filetemplater" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', createFileFromTemplate);

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand("extension.template", createFileFromTemplate);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
