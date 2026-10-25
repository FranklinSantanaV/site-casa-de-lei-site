
/* AGENDAMENTO DE JOGO DE BÚZIOS E PIX */

const formularioJogo = document.querySelector(".agenda-formulario");

if (formularioJogo) {
    const botaoPix = document.querySelector("#copiar-pix");
    const botaoComprovante = document.querySelector("#enviar-comprovante");
    const campoMensagem = document.querySelector("#mensagem-agenda");

    const chavePix = "11958483252";
    const numeroCasa = "5511986005002";

    

botaoPix.addEventListener("click", async function () {
    let copiou = false;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(chavePix);
            copiou = true;
        }
    } catch (erro) {
        copiou = false;
    }

    if (!copiou) {
        const campoTemporario = document.createElement("textarea");
        campoTemporario.value = chavePix;
        campoTemporario.style.position = "fixed";
        campoTemporario.style.left = "-9999px";

        document.body.appendChild(campoTemporario);
        campoTemporario.select();

        try {
            copiou = document.execCommand("copy");
        } catch (erro) {
            copiou = false;
        }

        campoTemporario.remove();
    }

    if (copiou) {
        campoMensagem.textContent =
            "Chave Pix copiada! Abra o aplicativo do seu banco para pagar R$ 100,00.";
    } else {
        campoMensagem.textContent =
            "Não foi possível copiar automaticamente. Selecione e copie a chave Pix: " + chavePix;
    }
});



    botaoComprovante.addEventListener("click", function () {
        const data = document.querySelector("#data-jogo").value;
        const horario = document.querySelector("#horario-jogo").value;
        const nome = document.querySelector("#nome-jogo").value.trim();
        const whatsapp = document.querySelector("#whatsapp-jogo").value.trim();

        if (!data || !horario || !nome || !whatsapp) {
            alert("Preencha todos os campos antes de continuar.");
            return;
        }

        const dataEscolhida = new Date(data + "T12:00:00");
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataEscolhida < hoje) {
            alert("Escolha uma data de hoje em diante.");
            return;
        }

        const dataFormatada = data.split("-").reverse().join("/");

        const mensagem =
            "Olá! Quero solicitar um agendamento para Jogo de Búzios.\n\n" +
            "Nome: " + nome + "\n" +
            "Meu WhatsApp: " + whatsapp + "\n" +
            "Data desejada: " + dataFormatada + "\n" +
            "Horário desejado: " + horario + "\n" +
            "Atendimento presencial\n" +
            "Valor: R$ 100,00\n" +
            "Pix utilizado: " + chavePix + "\n\n" +
            "Realizei o pagamento e vou enviar o comprovante nesta conversa. Por favor, confirmem o recebimento e a disponibilidade do horário.";

        const link = "https://wa.me/" + numeroCasa +
            "?text=" + encodeURIComponent(mensagem);

        window.open(link, "_blank");
    });
}


/* ABRIR E FECHAR OS ÁLBUNS DA GALERIA */

document.querySelectorAll(".titulo-album").forEach(function (botao) {
    botao.addEventListener("click", function () {
        const album = botao.nextElementSibling;
        const estaAberto = botao.getAttribute("aria-expanded") === "true";

        botao.setAttribute("aria-expanded", String(!estaAberto));
        album.hidden = estaAberto;

        const seta = botao.querySelector(".seta-album");
        if (seta) {
            seta.textContent = estaAberto ? "＋" : "－";
        }
    });
});

/* ABRIR E FECHAR O MENU PRINCIPAL */

const botaoMenu = document.querySelector("#botao-menu");
const menuPrincipal = document.querySelector("#menu-principal");
const iconeMenuPrincipal = document.querySelector("#icone-menu-principal");

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", function () {
        const estaFechado = menuPrincipal.classList.contains("menu-fechado");

        menuPrincipal.classList.toggle("menu-fechado");

        botaoMenu.setAttribute("aria-expanded", String(estaFechado));
        botaoMenu.setAttribute(
            "aria-label",
            estaFechado ? "Fechar menu" : "Abrir menu"
        );

        if (iconeMenuPrincipal) {
            iconeMenuPrincipal.textContent = estaFechado ? "✕" : "☰";
        }
    });

    menuPrincipal.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menuPrincipal.classList.add("menu-fechado");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");

            if (iconeMenuPrincipal) {
                iconeMenuPrincipal.textContent = "☰";
            }
        });
    });
}

/* ABRIR E FECHAR A HISTÓRIA */

document.querySelectorAll(".titulo-recolhivel").forEach(function (botao) {
    botao.addEventListener("click", function () {
        const idConteudo = botao.getAttribute("aria-controls");
        const conteudo = document.getElementById(idConteudo);
        const aberto = botao.getAttribute("aria-expanded") === "true";

        botao.setAttribute("aria-expanded", String(!aberto));
        conteudo.hidden = aberto;

        const sinal = botao.querySelector(".sinal-recolher");
        sinal.textContent = aberto ? "＋" : "−";
    });
});


