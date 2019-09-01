"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const regionRegex = new RegExp(/^#/);
    vscode.languages.registerFoldingRangeProvider('ssb', {
        provideFoldingRanges(document, context, provider) {
            let currentRangeStart = void 0;
            const ranges = [];
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                // If there is no match for a region in this line, look at next line
                if (line.text.match(regionRegex) === null) {
                    continue;
                }
                // If this is the very first region we don't push a range yet since we don't know the end yet
                if (currentRangeStart === void 0) {
                    currentRangeStart = i;
                    continue;
                }
                // We hit a new region, thus we now figure out the end of the range by finding the last non empty line of the last region
                let previousLine = document.lineAt(i - 1);
                let currentRangeEnd = i - 1;
                while (previousLine.text.trim() === '') {
                    currentRangeEnd = currentRangeEnd - 1;
                    previousLine = document.lineAt(currentRangeEnd);
                }
                ranges.push(new vscode.FoldingRange(currentRangeStart, currentRangeEnd));
                currentRangeStart = i;
            }
            // Add range until end of file but only if there has been a range start at all
            if (currentRangeStart !== void 0) {
                ranges.push(new vscode.FoldingRange(currentRangeStart, document.lineCount - 1));
            }
            return ranges;
        }
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map