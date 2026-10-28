/* ============================================================
   1. REGISTRO E CONSULTA DA ASSISTÊNCIA (SUPABASE)
   ============================================================ */

const btnCadastrarAssistencia = document.querySelector("#cadastrar-assistencia");
const msgAssistencia = document.querySelector("#mensagem-assistencia");

if (btnCadastrarAssistencia) {
    btnCadastrarAssistencia.addEventListener("click", async () => {
        const gira = document.querySelector("#assistencia-gira").value;
        const responsavel = document.querySelector("#assistencia-responsavel").value.trim();
        const nome = document.querySelector("#assistencia-nome").value.trim();
        const email = document.querySelector("#assistencia-email").value.trim();
        const telefone = document.querySelector("#assistencia-telefone").value.trim();
        const endereco = document.querySelector("#assistencia-endereco").value.trim();
        const frequentou = document.querySelector("#assistencia-frequentou").value;
        const grupo = document.querySelector("#assistencia-grupo").value;
        const observacao = document.querySelector("#assistencia-observacao").value.trim();
        const soubeOutroTexto = document.querySelector("#assistencia-soube-outro").value.trim();

        // Capturar checkboxes de "Como soube"
        const checkboxesSoube = document.querySelectorAll('input[name="como_soube"]:checked');
        let comoSoubeArr = Array.from(checkboxesSoube).map(cb => cb.value);
        if (soubeOutroTexto) {
            comoSoubeArr.push("Detalhe: " + soubeOutroTexto);
        }
        const comoSoubeStr = comoSoubeArr.join(", ");

        // Capturar checkboxes de "Motivos"
        const checkboxesMotivos = document.querySelectorAll('input[name="motivo"]:checked');
        let motivosArr = Array.from(checkboxesMotivos).map(cb => cb.value);
        const motivosStr = motivosArr.join(", ");

        if (!nome) {
            msgAssistencia.textContent = "Por favor, preencha ao menos o nome completo.";
            msgAssistencia.style.color = "red";
            return;
        }

        msgAssistencia.textContent = "Salvando registro...";
        msgAssistencia.style.color = "#174c70";

        const { data, error } = await supabaseClient
            .from("registro_assistencia")
            .insert([
                {
                    gira: gira,
                    responsavel: responsavel,
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    endereco: endereco,
                    como_soube: comoSoubeStr,
                    frequentou_terreiro: frequentou,
                    participar_grupo: grupo,
                    motivos: motivosStr,
                    observacao: observacao
                }
            ]);

        if (error) {
            msgAssistencia.textContent = "Erro ao salvar: " + error.message;
            msgAssistencia.style.color = "red";
        } else {
            msgAssistencia.textContent = "Ficha cadastrada com sucesso!";
            msgAssistencia.style.color = "green";

            // Limpar formulário
            document.querySelector("#assistencia-gira").value = "";
            document.querySelector("#assistencia-responsavel").value = "";
            document.querySelector("#assistencia-nome").value = "";
            document.querySelector("#assistencia-email").value = "";
            document.querySelector("#assistencia-telefone").value = "";
            document.querySelector("#assistencia-endereco").value = "";
            document.querySelector("#assistencia-soube-outro").value = "";
            document.querySelector("#assistencia-frequentou").value = "";
            document.querySelector("#assistencia-grupo").value = "";
            document.querySelector("#assistencia-observacao").value = "";

            document.querySelectorAll('input[name="como_soube"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('input[name="motivo"]').forEach(cb => cb.checked = false);

            carregarAssistencia();
        }
    });
}

async function carregarAssistencia() {
    const containerLista = document.querySelector("#lista-assistencia");
    if (!containerLista) return;

    containerLista.innerHTML = "<p>Carregando registros...</p>";

    const { data, error } = await supabaseClient
        .from("registro_assistencia")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        containerLista.innerHTML = "<p>Erro ao carregar lista.</p>";
        return;
    }

    if (!data || data.length === 0) {
        containerLista.innerHTML = "<p>Nenhum registro encontrado.</p>";
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">';

    data.forEach(item => {
        const dataCadastro = new Date(item.created_at).toLocaleDateString("pt-BR");
        html += `
            <div style="padding: 16px; border: 1px solid #e2d5b5; border-radius: 8px; background: #f8f6f0;">
                <h4 style="color: #174c70; margin-bottom: 6px;">${item.nome}</h4>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Gira:</strong> ${item.gira || 'Não informada'}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Recepção por:</strong> ${item.responsavel || 'Não informado'}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Contato:</strong> ${item.telefone || '-'} | ${item.email || '-'}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Endereço:</strong> ${item.endereco || 'Não informado'}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Como soube:</strong> ${item.como_soube || '-'}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Frequenta terreiro?</strong> ${item.frequentou_terreiro || '-'} | <strong>Quer grupo?</strong> ${item.participar_grupo || '-'}</p>
                <p style="margin: 2px 0; font-size: 0.9rem;"><strong>Motivos:</strong> ${item.motivos || '-'}</p>
                ${item.observacao ? `<p style="margin: 2px 0; font-size: 0.9rem;"><strong>Obs:</strong> ${item.observacao}</p>` : ''}
                <small style="color: #888; display: block; margin-top: 6px;">Data do cadastro: ${dataCadastro}</small>
            </div>
        `;
    });

    html += '</div>';
    containerLista.innerHTML = html;
}

const btnAtualizarAssistencia = document.querySelector("#atualizar-assistencia");
if (btnAtualizarAssistencia) {
    btnAtualizarAssistencia.addEventListener("click", carregarAssistencia);
}


/* ============================================================
   2. AGENDAMENTO DE JOGO DE BÚZIOS E PIX
   ============================================================ */

const formularioJogo = document.querySelector(".agenda-formulario");

if (formularioJogo) {
    const botaoPix = document.querySelector("#copiar-pix");
    const botaoComprovante = document.querySelector("#enviar-comprovante");
    const campoMensagem = document.querySelector("#mensagem-agenda");

    const chavePix = "11958483252";
    const numero
   
