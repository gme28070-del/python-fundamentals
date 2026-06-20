window.pyodideInstance = null;

async function setupPyodide() {
    console.log("🐍 Pyodide: Carregando motor Python...");
    try {
        // O SEGREDO ESTÁ AQUI: indexURL diz ao Pyodide para não procurar arquivos no seu localhost
        window.pyodideInstance = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        
        window.pyodideInstance.setStdout({
            batched: (str) => {
                const outputEl = document.getElementById('output');
                if (outputEl) outputEl.innerText += str + "\n";
            }
        });

        console.log("✅ Pyodide: Motor Python pronto!");
        return true;
    } catch (err) {
        console.error("❌ Erro ao carregar Pyodide:", err);
        return false;
    }
}

async function runPythonCode() {
    const outputEl = document.getElementById('output');
    if (!outputEl) return;
    
    outputEl.innerText = ""; 

    if (!window.pyodideInstance) {
        outputEl.innerText = "Erro: Python ainda não foi carregado.";
        return;
    }

    const code = window.editorInstance.getValue();

    try {
        await window.pyodideInstance.runPythonAsync(code);
    } catch (err) {
        outputEl.innerText = err.toString();
    }
}