// Estado do sistema
let lessons = [];
let currentLessonIndex = 0;

async function initApp() {
    console.log("⚙️ Iniciando Plataforma...");
    const statusBadge = document.getElementById('status-badge');

    try {
        // 1. Carregar Lições
        console.log("📚 Buscando lições...");
        const response = await fetch('/content/lessons.json');
        if (!response.ok) throw new Error("Não foi possível carregar lessons.json");
        
        const data = await response.json();
        // Blindagem para aceitar tanto lista [] quanto objeto { lessons: [] }
        lessons = Array.isArray(data) ? data : data.lessons;

        if (!lessons || lessons.length === 0) throw new Error("Nenhuma lição encontrada no JSON.");
        console.log(`✅ ${lessons.length} lições carregadas.`);

        // 2. Renderizar a primeira lição
        renderLesson(lessons[0]);

        // 3. Carregar o Editor e o Python em paralelo
        console.log("⏳ Carregando ferramentas...");
        await Promise.all([
            setupEditor(),
            setupPyodide()
        ]);

        // 4. Configurar Navegação e Botões
        setupNavigation();

        // 5. Tudo pronto!
        statusBadge.innerText = "🚀 Sistema Pronto";
        statusBadge.className = "text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded border border-green-500/50";
        
        const runBtn = document.getElementById('run-button');
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.addEventListener('click', runPythonCode);
        }

    } catch (error) {
        console.error("❌ Erro Crítico na Inicialização:", error);
        statusBadge.innerText = "❌ Erro de Inicialização";
        statusBadge.className = "text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded border border-red-500/50";
    }
}

function renderLesson(lesson) {
    const titleEl = document.getElementById('lesson-title');
    const contentEl = document.getElementById('lesson-content');
    const counterEl = document.getElementById('lesson-counter');

    if (titleEl && contentEl) {
        titleEl.innerText = lesson.title;
        contentEl.innerHTML = lesson.content;
        
        // Atualiza o contador (ex: Lição 1 de 3)
        if (counterEl) {
            counterEl.innerText = `Lição ${currentLessonIndex + 1} de ${lessons.length}`;
        }
        console.log(`📖 Lição ${currentLessonIndex + 1} exibida.`);
    }
    
    // Atualiza o estado dos botões (desabilitar se for a primeira ou última)
    updateButtonStates();
}

function setupNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentLessonIndex > 0) {
                currentLessonIndex--;
                renderLesson(lessons[currentLessonIndex]);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentLessonIndex < lessons.length - 1) {
                currentLessonIndex++;
                renderLesson(lessons[currentLessonIndex]);
            }
        });
    }
}

function updateButtonStates() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.disabled = (currentLessonIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentLessonIndex === lessons.length - 1);
}

// Iniciar tudo quando a página carregar
window.addEventListener('DOMContentLoaded', initApp);