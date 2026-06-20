// Variável global para o editor ser acessado por outros arquivos
window.editorInstance = null;

async function setupEditor() {
    return new Promise((resolve, reject) => {
        console.log("📦 Monaco Editor: Carregando...");
        
        // Configuração do loader do Monaco
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

        require(['vs/editor/editor.main'], function () {
            const container = document.getElementById('editor-container');
            
            window.editorInstance = monaco.editor.create(container, {
                value: "# Digite seu código Python aqui...\nprint('Olá, Mundo!')",
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 16,
                minimap: { enabled: false }
            });

            console.log("✅ Monaco Editor: Pronto!");
            resolve();
        });
    });
}