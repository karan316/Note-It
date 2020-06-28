import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
    const commandId = "sample.showNoteIt";
    subscriptions.push(vscode.commands.registerCommand(commandId, () => {}));

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = commandId;
    subscriptions.push(statusBarItem);

    subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
    );
    subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
    );

    // update status bar item once at start
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

// this method is called when your extension is deactivated
export function deactivate() {}
