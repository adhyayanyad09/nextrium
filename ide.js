// Load Monaco Editor and set up editor instance
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        language: 'javascript', // Use 'nextrium' if a syntax file is available
        theme: 'vs-dark',
        automaticLayout: true
    });
});

let nextriumInterpreter;

// Initialize WebAssembly for the Nextrium interpreter
async function initWasm() {
    try {
        const wasm = await fetch('nextrium_interpreter.wasm');
        const buffer = await wasm.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buffer);
        nextriumInterpreter = instance.exports.interpret_nextrium;
        console.log("Nextrium interpreter loaded successfully.");
    } catch (error) {
        console.error("Failed to load Nextrium interpreter:", error);
        document.getElementById('output').innerText = "Error: Unable to load interpreter.";
    }
}

// Execute the code in the editor using the WebAssembly interpreter
function runCode() {
    const code = editor.getValue();
    if (!nextriumInterpreter) {
        document.getElementById('output').innerText = "Error: Interpreter not loaded.";
        return;
    }
    try {
        // Run the code and get output from interpreter
        const output = nextriumInterpreter(code);
        document.getElementById('output').innerText = output;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}

// Bind the runCode function to the run button
document.getElementById('run-button').addEventListener('click', runCode);

// Load WebAssembly interpreter
initWasm();
