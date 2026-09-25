document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // ELEMENOS DOS MODAIS & FUNÇÕES GLOBAIS
    // =========================================
    const modalOverlay = document.getElementById("modalOverlay");
    const modais = document.querySelectorAll(".modal-card");

    function abrirModal(idModal) {
        // Oculta todos os modais primeiro
        modais.forEach(m => m.classList.remove("active"));
        
        const modalAlvo = document.getElementById(idModal);
        if (modalAlvo && modalOverlay) {
            modalOverlay.classList.add("active");
            modalAlvo.classList.add("active");
        }
    }

    function fecharModais() {
        if (modalOverlay) {
            modalOverlay.classList.remove("active");
            modais.forEach(m => m.classList.remove("active"));
        }
    }

    // Modal de Alerta Customizado (Substitui o alert nativo)
    function mostrarAlerta(titulo, mensagem) {
        document.getElementById("alertaTitulo").innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(titulo)}`;
        document.getElementById("alertaMensagem").innerText = mensagem;
        abrirModal("modalAlerta");
    }

    // Botões para fechar modais (ícones X e botões Cancelar)
    document.querySelectorAll(".modal-close, .modal-btn.cancel, #btnFecharAlerta").forEach(btn => {
        btn.addEventListener("click", fecharModais);
    });

    // Fechar ao clicar fora do cartão
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) fecharModais();
        });
    }

    // =========================================
    // 1. ALTERNAR BARRA LATERAL
    // =========================================
    const btnToggle = document.getElementById("btnToggle");
    const minhaSidebar = document.getElementById("minhaSidebar");

    if (btnToggle && minhaSidebar) {
        btnToggle.addEventListener("click", () => {
            minhaSidebar.classList.toggle("escondida");
        });
    }

    // =========================================
    // 2. NAVEGAÇÃO ENTRE SEÇÕES (SPA)
    // =========================================
    const navBtns = document.querySelectorAll(".nav-icons .icon-btn[data-target]");
    const appSections = document.querySelectorAll(".app-section");

    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");

            appSections.forEach(sec => {
                sec.style.display = "none";
                sec.classList.remove("active");
            });

            const targetSec = document.getElementById(targetId);
            if (targetSec) {
                targetSec.style.display = "block";
                targetSec.classList.add("active");
            }

            navBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // =========================================
    // 3. KANBAN: CRIAR TAREFA VIA MODAL
    // =========================================
    const btnNovaTarefa = document.getElementById("btnNovaTarefa");
    const btnConfirmarTarefa = document.getElementById("btnConfirmarTarefa");

    if (btnNovaTarefa) {
        btnNovaTarefa.addEventListener("click", () => {
            document.getElementById("inputTituloTarefa").value = "";
            
            // Define data padrão de hoje
            const hoje = new Date();
            const dia = String(hoje.getDate()).padStart(2, '0');
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const ano = hoje.getFullYear();
            document.getElementById("inputPrazoTarefa").value = `${dia}/${mes}/${ano}`;
            
            abrirModal("modalNovaTarefa");
        });
    }

    if (btnConfirmarTarefa) {
        btnConfirmarTarefa.addEventListener("click", () => {
            const titulo = document.getElementById("inputTituloTarefa").value.trim();
            const prazo = document.getElementById("inputPrazoTarefa").value.trim();
            const colIndex = document.getElementById("selectColunaTarefa").value;

            if (titulo === "") {
                alert("Por favor, preencha o título da tarefa.");
                return;
            }

            const colunas = document.querySelectorAll("#sec-tarefas .column .cards-container");
            const colunaAlvo = colunas[colIndex] || colunas[0];

            const novoCartao = document.createElement("div");
            novoCartao.classList.add("card");

            const dotClass = (colIndex == 2) ? "dot-green" : "dot-yellow";

            novoCartao.innerHTML = `
                <div class="card-content">
                    <h3>${escapeHtml(titulo)}</h3>
                    <p>Prazo: ${escapeHtml(prazo)}</p>
                    <span class="status-dot ${dotClass}"></span>
                </div>
                <i class="fa-solid fa-chevron-down chevron" title="Mover tarefa"></i>
            `;

            colunaAlvo.prepend(novoCartao);
            fecharModais();
            mostrarAlerta("Sucesso", "Nova tarefa adicionada ao quadro!");
        });
    }

    // =========================================
    // 4. KANBAN: MOVER TAREFA ENTRE COLUNAS
    // =========================================
    const kanbanBoard = document.querySelector(".kanban-board");

    if (kanbanBoard) {
        kanbanBoard.addEventListener("click", (event) => {
            if (event.target.classList.contains("chevron")) {
                const cartao = event.target.closest(".card");
                const colunaAtual = cartao.closest(".column");
                const colunas = Array.from(document.querySelectorAll("#sec-tarefas .column"));

                const indiceAtual = colunas.indexOf(colunaAtual);
                const proximoIndice = (indiceAtual + 1) % colunas.length;
                const proximaColunaContainer = colunas[proximoIndice].querySelector(".cards-container");

                const statusDot = cartao.querySelector(".status-dot");
                if (proximoIndice === 2) {
                    statusDot.classList.remove("dot-yellow");
                    statusDot.classList.add("dot-green");
                } else {
                    statusDot.classList.remove("dot-green");
                    statusDot.classList.add("dot-yellow");
                }

                proximaColunaContainer.appendChild(cartao);
            }
        });
    }

    // =========================================
    // 5. EMPRESA: EDITAR DADOS VIA MODAL
    // =========================================
    const btnEditarEmpresa = document.getElementById("btnEditarEmpresa");
    const btnSalvarEmpresa = document.getElementById("btnSalvarEmpresa");

    if (btnEditarEmpresa) {
        btnEditarEmpresa.addEventListener("click", () => {
            // Preenche o modal com os valores atuais do cartão
            document.getElementById("inputEmailEmpresa").value = document.getElementById("fieldEmail").innerText.trim();
            document.getElementById("inputTelefoneEmpresa").value = document.getElementById("fieldTelefone").innerText.trim();
            document.getElementById("inputEnderecoEmpresa").value = document.getElementById("fieldEndereco").innerText.replace(/<br\s*[\/]?>/gi, "\n").trim();
            
            abrirModal("modalEditarEmpresa");
        });
    }

    if (btnSalvarEmpresa) {
        btnSalvarEmpresa.addEventListener("click", () => {
            const novoEmail = document.getElementById("inputEmailEmpresa").value.trim();
            const novoTel = document.getElementById("inputTelefoneEmpresa").value.trim();
            const novoEnd = document.getElementById("inputEnderecoEmpresa").value.trim();

            if (novoEmail) document.getElementById("fieldEmail").innerText = novoEmail;
            if (novoTel) document.getElementById("fieldTelefone").innerText = novoTel;
            if (novoEnd) document.getElementById("fieldEndereco").innerHTML = escapeHtml(novoEnd).replace(/\n/g, '<br>');

            fecharModais();
            mostrarAlerta("Atualizado", "Os dados da empresa foram atualizados com sucesso!");
        });
    }

    // =========================================
    // 6. GUARDAR MINUTA VIA MODAL
    // =========================================
    const btnSalvarMinuta = document.getElementById("btnSalvarMinuta");
    if (btnSalvarMinuta) {
        btnSalvarMinuta.addEventListener("click", () => {
            mostrarAlerta("Minuta Guardada", "A sua minuta foi guardada com sucesso no sistema!");
        });
    }

    // =========================================
    // 7. TERMINAR SESSÃO VIA MODAL
    // =========================================
    const btnSair = document.getElementById("btnSair");
    const btnConfirmarSair = document.getElementById("btnConfirmarSair");

    if (btnSair) {
        btnSair.addEventListener("click", () => {
            abrirModal("modalSair");
        });
    }

    if (btnConfirmarSair) {
        btnConfirmarSair.addEventListener("click", () => {
            fecharModais();
            mostrarAlerta("Sessão Encerrada", "Foi efetuado o logout do sistema.");
        });
    }

    // =========================================
    // 8. CHAT DA IA
    // =========================================
    const btnEnviarChat = document.getElementById("btnEnviarChat");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");

    if (btnEnviarChat && chatInput) {
        btnEnviarChat.addEventListener("click", () => {
            const texto = chatInput.value.trim();
            if (texto !== "") {
                const msgUser = document.createElement("div");
                msgUser.classList.add("chat-msg", "user");
                msgUser.innerHTML = `<p>${escapeHtml(texto)}</p>`;
                chatMessages.appendChild(msgUser);

                chatInput.value = "";
                chatMessages.scrollTop = chatMessages.scrollHeight;

                setTimeout(() => {
                    const msgAi = document.createElement("div");
                    msgAi.classList.add("chat-msg", "ai");
                    msgAi.innerHTML = `<i class="fa-solid fa-robot"></i><p>Analisando o teu pedido sobre "${escapeHtml(texto)}"... Os prazos jurídicos estão atualizados no teu painel.</p>`;
                    chatMessages.appendChild(msgAi);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 800);
            }
        });
    }

    function escapeHtml(texto) {
        const div = document.createElement("div");
        div.textContent = texto;
        return div.innerHTML;
    }

});