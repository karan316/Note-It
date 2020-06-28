import * as vscode from "vscode";
import { TextEncoder } from "util";
const { path } = require("path");

let statusBarItem: vscode.StatusBarItem;
let inputBox: vscode.InputBox;
let code: string | undefined;
let comments: string;
export function activate({ subscriptions }: vscode.ExtensionContext) {
    const showNoteCommand = "note-it.showNoteIt";
    const openInputBoxCommand = "note-it.openInputBox";
    subscriptions.push(
        vscode.commands.registerCommand(showNoteCommand, () => {
            code = getSelectedLines(vscode.window.activeTextEditor);
        })
    );

    subscriptions.push(
        vscode.commands.registerCommand(openInputBoxCommand, () => {
            inputBox = vscode.window.createInputBox();
            inputBox.placeholder = "Add your comments for this code";
            inputBox.title = "Comment for this code snippet";
            inputBox.buttons;
            inputBox.show();
            let comments = inputBox.value;
            comments += "\n";
            let fileInput = new TextEncoder().encode(comments + code);
            let uri = vscode.Uri.file(__dirname + "notes.txt");
            vscode.workspace.fs.writeFile(uri, fileInput);
        })
    );

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    statusBarItem.command = openInputBoxCommand;
    subscriptions.push(statusBarItem);

    subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
    );
    subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
    );

    updateStatusBarItem();
}

function updateStatusBarItem(): void {
    const text = getSelectedLines(vscode.window.activeTextEditor);
    if (text) {
        statusBarItem.text = "Make a Note";
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

function getSelectedLines(
    editor: vscode.TextEditor | undefined
): string | undefined {
    let text: string | undefined;
    text = editor?.selections.toString();
    return text;
}

export function deactivate() {}
