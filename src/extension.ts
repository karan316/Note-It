import * as vscode from "vscode";
import * as fs from "fs";
import { posix } from "path";

let statusBarItem: vscode.StatusBarItem;
let code: any;
let comments: any;
let fileInput: any;
export function activate({ subscriptions }: vscode.ExtensionContext) {
    const showNoteCommand = "note-it.showNoteIt";
    const openInputBoxCommand = "note-it.openInputBox";

    subscriptions.push(
        vscode.commands.registerCommand(showNoteCommand, async () => {
            const editor: any = vscode.window.activeTextEditor;
            console.log(
                "Editor Selection: " + editor.document.getText(editor.selection)
            );
            code = await editor.document.getText(editor.selection);
            // code = getSelectedLines();
            console.log("Code: " + code);
            fileInput = Buffer.from(code, "utf-8");

            // function getSelectedLines(): string | undefined {
            //     let text: string | undefined;
            //     console.log("Text :" + text);
            //     return text;
            // }
        })
    );

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    statusBarItem.command = openInputBoxCommand;
    subscriptions.push(statusBarItem);

    subscriptions.push(
        vscode.commands.registerCommand(openInputBoxCommand, async () => {
            comments = await vscode.window.showInputBox({
                placeHolder: "Add your comments",
            });
            console.log(comments + code);
            if (!vscode.workspace.workspaceFolders) {
                return vscode.window.showInformationMessage(
                    "No folder or workspace opened"
                );
            }

            try {
                if (comments) {
                    const folderUri = vscode.workspace.workspaceFolders[0].uri;
                    const fileUri = folderUri.with({
                        path: posix.join(folderUri.path, "Notes.txt"),
                    });

                    // console.log(fs.existsSync(__dirname + "Notes.txt"));
                    // if the file exists read the data from the existing file
                    if (fs.existsSync(__dirname + "Notes.txt")) {
                        const readData = await vscode.workspace.fs.readFile(
                            fileUri
                        );
                        // file input of comment + code + existing file data
                        fileInput = Buffer.from(
                            fileInput + readData + comments,
                            "utf-8"
                        );

                        await vscode.workspace.fs.writeFile(fileUri, fileInput);
                    } else {
                        fileInput = Buffer.from(fileInput + comments, "utf-8");

                        await vscode.workspace.fs.writeFile(fileUri, fileInput);
                    }
                } else {
                    return vscode.window.showInformationMessage(
                        "Add a comment please!"
                    );
                }
            } catch (error) {
                console.log(error);
            }
        })
    );
    subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
    );

    updateStatusBarItem();
    function updateStatusBarItem(): void {
        const text = getSelectedLines();
        if (text) {
            statusBarItem.text = "Note it";
            statusBarItem.show();
        } else {
            statusBarItem.hide();
        }
    }
    function getSelectedLines(): string | undefined {
        let text: string | undefined;
        const editor: any = vscode.window.activeTextEditor;
        text = editor.document.getText(editor.selection);
        console.log("Text :" + text);
        return text;
    }
}

export function deactivate() {}
