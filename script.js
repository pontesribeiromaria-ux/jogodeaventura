/* =====================================================
   A CASA DO QUARTO 13
   Jogo de aventura e terror
   ===================================================== */


/* =====================================================
   ESTADO DO JOGADOR
   ===================================================== */

let jogador = {
    sanidade: 100,
    bateria: 100,
    capitulo: 1,

    inventario: [],

    flags: {
        portaAberta: false,
        encontrouBilhete: false,
        viuRetrato: false,
        pegouChave: false,
        ouviuTelefone: false,
        ligouTelefone: false,
        abriuQuarto13: false,
        encontrouDiario: false,
        descobriuNome: false,
        encontrouSalaSecreta: false,
        viuEspelho: false,
        pegouMedalhao: false,
        acendeuPorão: false,
        descobriuFinal: false
    },

    cenaAtual: "entrada",

    finais: []
};


/* =====================================================
   ITENS
   ===================================================== */

const itens = {

    chave: {
        nome: "🔑 Chave enferrujada",
        descricao: "Uma chave antiga encontrada perto da escada."
    },

    bilhete: {
        nome: "📜 Bilhete",
        descricao: "Um pedaço de papel com uma mensagem estranha."
    },

    lanterna: {
        nome: "🔦 Lanterna",
        descricao: "Uma lanterna velha. Ainda possui alguma bateria."
    },

    diario: {
        nome: "📕 Diário",
        descricao: "Um diário antigo encontrado na casa."
    },

    medalhao: {
        nome: "🧿 Medalhão",
        descricao: "Um medalhão com o símbolo de um olho."
    },

    fotografia: {
        nome: "📷 Fotografia",
        descricao: "Uma fotografia antiga da família que viveu aqui."
    },

    codigo: {
        nome: "🔢 Código",
        descricao: "O número 1313 escrito em uma folha."
    },

    fita: {
        nome: "📼 Fita VHS",
        descricao: "Uma fita sem identificação."
    }
};


/* =====================================================
   ELEMENTOS DA PÁGINA
   ===================================================== */

const sanidadeEl = document.getElementById("sanidade");
const bateriaEl = document.getElementById("bateria");
const capituloEl = document.getElementById("capitulo");

const barraSanidade = document.getElementById("barraSanidade");

const iconeLocal = document.getElementById("iconeLocal");
const nomeLocal = document.getElementById("nomeLocal");

const tituloCena = document.getElementById("tituloCena");
const imagemCena = document.getElementById("imagemCena");

const historiaTexto = document.getElementById("historiaTexto");
const dialogo = document.getElementById("dialogo");
const opcoes = document.getElementById("opcoes");

const inventarioEl = document.getElementById("inventario");
const inventarioModal = document.getElementById("inventarioModal");

const objetivoEl = document.getElementById("objetivo");

const notificacao = document.getElementById("notificacao");


/* =====================================================
   UTILIDADES
   ===================================================== */

function possuiItem(id) {
    return jogador.inventario.includes(id);
}


function adicionarItem(id) {

    if (!itens[id]) {
        return;
    }

    if (possuiItem(id)) {
        mostrarNotificacao("Você já possui este item.");
        return;
    }

    jogador.inventario.push(id);

    atualizarInterface();

    mostrarNotificacao(
        "Item encontrado: " + itens[id].nome
    );
}


function removerItem(id) {

    const index = jogador.inventario.indexOf(id);

    if (index !== -1) {
        jogador.inventario.splice(index, 1);
    }

    atualizarInterface();
}


function perderSanidade(valor) {

    jogador.sanidade -= valor;

    if (jogador.sanidade < 0) {
        jogador.sanidade = 0;
    }

    atualizarInterface();

    if (jogador.sanidade <= 0) {
        finalSanidade();
    }
}


function gastarBateria(valor) {

    jogador.bateria -= valor;

    if (jogador.bateria < 0) {
        jogador.bateria = 0;
    }

    atualizarInterface();

    if (jogador.bateria <= 0) {
        mostrarNotificacao("A bateria da lanterna acabou.");
    }
}


function mostrarNotificacao(texto) {

    notificacao.textContent = texto;

    notificacao.classList.add("mostrar");

    setTimeout(() => {
        notificacao.classList.remove("mostrar");
    }, 2500);
}


/* =====================================================
   INTERFACE
   ===================================================== */

function atualizarInterface() {

    sanidadeEl.textContent = jogador.sanidade;

    bateriaEl.textContent = jogador.bateria + "%";

    capituloEl.textContent = jogador.capitulo;

    barraSanidade.style.width =
        jogador.sanidade + "%";

    atualizarInventario();

    atualizarObjetivo();
}


function atualizarInventario() {

    if (jogador.inventario.length === 0) {

        inventarioEl.innerHTML =
            '<p class="vazio">Você não possui itens.</p>';

        inventarioModal.innerHTML =
            '<p class="vazio">Você não possui itens.</p>';

        return;
    }

    let html = "";

    jogador.inventario.forEach(id => {

        html += `
            <div class="item">
                ${itens[id].nome}
            </div>
        `;

    });

    inventarioEl.innerHTML = html;

    let detalhes = "";

    jogador.inventario.forEach(id => {

        detalhes += `
            <div class="painel">
                <strong>${itens[id].nome}</strong>
                <p>${itens[id].descricao}</p>
            </div>
        `;

    });

    inventarioModal.innerHTML = detalhes;
}


function atualizarObjetivo() {

    let objetivo = "Descubra o que aconteceu nesta casa.";

    if (!jogador.flags.portaAberta) {
        objetivo = "Entre na casa abandonada.";
    }

    else if (!jogador.flags.encontrouBilhete) {
        objetivo = "Procure alguma pista dentro da casa.";
    }

    else if (!jogador.flags.pegouChave) {
        objetivo = "Encontre uma maneira de abrir as portas trancadas.";
    }

    else if (!jogador.flags.abriuQuarto13) {
        objetivo = "Descubra onde fica o Quarto 13.";
    }

    else if (!jogador.flags.encontrouDiario) {
        objetivo = "Descubra o segredo da casa.";
    }

    else {
        objetivo = "Descubra a verdade e encontre uma saída.";
    }

    objetivoEl.textContent = objetivo;
}


/* =====================================================
   SISTEMA DE CENAS
   ===================================================== */

function mostrarCena(cena) {

    jogador.cenaAtual = cena;

    const dados = cenas[cena];

    if (!dados) {
        console.error("Cena não encontrada:", cena);
        return;
    }

    iconeLocal.textContent = dados.icone;

    nomeLocal.textContent = dados.local;

    tituloCena.textContent = dados.titulo;

    imagemCena.textContent = dados.imagem;

    historiaTexto.textContent = dados.texto;

    /* diálogo */

    if (dados.dialogo) {

        dialogo.textContent = dados.dialogo;

        dialogo.classList.add("ativo");

    } else {

        dialogo.textContent = "";

        dialogo.classList.remove("ativo");
    }

    /* opções */

    opcoes.innerHTML = "";

    dados.opcoes.forEach(opcao => {

        const botao = document.createElement("button");

        botao.className = "opcao";

        botao.textContent = opcao.texto;

        botao.addEventListener("click", () => {

            if (typeof opcao.acao === "function") {
                opcao.acao();
            }

        });

        opcoes.appendChild(botao);

    });

    atualizarInterface();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   CENAS DO JOGO
   ===================================================== */

const cenas = {


    /* =================================================
       INÍCIO
       ================================================= */

    entrada: {

        icone: "🏚️",

        local: "Entrada da casa",

        titulo: "A porta",

        imagem: "🚪",

        texto:
            "A chuva cai forte quando você encontra uma casa abandonada no meio da estrada.\n\n" +
            "Seu celular está sem sinal. A bateria está quase acabando.\n\n" +
            "Você tenta voltar pelo caminho por onde veio, mas percebe que não consegue mais enxergar a estrada.\n\n" +
            "Então ouve três batidas vindas de dentro da casa.\n\n" +
            "Toc. Toc. Toc.",

        opcoes: [

            {
                texto: "🚪 Abrir a porta",
                acao: () => {

                    jogador.flags.portaAberta = true;

                    mostrarCena("sala");

                }
            },

            {
                texto: "🏃 Tentar voltar pela estrada",
                acao: () => {

                    perderSanidade(5);

                    mostrarCena("estrada");

                }
            },

            {
                texto: "👂 Escutar atrás da porta",
                acao: () => {

                    perderSanidade(8);

                    mostrarCena("escutarPorta");

                }
            }

        ]

    },


    /* =================================================
       ESTRADA
       ================================================= */

    estrada: {

        icone: "🌧️",

        local: "Estrada",

        titulo: "A estrada desapareceu",

        imagem: "🌫️",

        texto:
            "Você corre de volta pela estrada.\n\n" +
            "Depois de alguns minutos, percebe algo impossível.\n\n" +
            "A casa continua exatamente na sua frente.\n\n" +
            "Você olha para trás.\n\n" +
            "Não existe mais estrada.\n\n" +
            "Só uma parede de neblina.",

        dialogo:
            "Uma voz atrás de você sussurra: \"Você já esteve aqui antes.\"",

        opcoes: [

            {
                texto: "🏚️ Voltar para a casa",
                acao: () => mostrarCena("sala")
            },

            {
                texto: "🌫️ Entrar na neblina",
                acao: () => {

                    perderSanidade(25);

                    mostrarCena("nevoeiro");

                }
            }

        ]

    },


    /* =================================================
       ESCUTAR PORTA
       ================================================= */

    escutarPorta: {

        icone: "🚪",

        local: "Entrada",

        titulo: "Do outro lado",

        imagem: "👂",

        texto:
            "Você aproxima o ouvido da porta.\n\n" +
            "Silêncio.\n\n" +
            "Então escuta uma respiração lenta.\n\n" +
            "Ela está do outro lado.\n\n" +
            "Você se afasta rapidamente.\n\n" +
            "A maçaneta começa a girar sozinha.",

        opcoes: [

            {
                texto: "🚪 Abrir imediatamente",
                acao: () => {

                    jogador.flags.portaAberta = true;

                    mostrarCena("sala");

                }
            },

            {
                texto: "🏃 Correr",
                acao: () => {

                    perderSanidade(15);

                    mostrarCena("estrada");

                }
            }

        ]

    },


    /* =================================================
       SALA
       ================================================= */

    sala: {

        icone: "🕯️",

        local: "Sala principal",

        titulo: "A sala",

        imagem: "🕯️",

        texto:
            "A porta se fecha atrás de você.\n\n" +
            "A casa cheira a madeira velha e poeira.\n\n" +
            "Há um sofá coberto por um lençol, um relógio parado e vários retratos nas paredes.\n\n" +
            "No fundo da sala existe uma escada que leva ao andar superior.\n\n" +
            "Uma pequena mesa possui um bilhete sobre ela.",

        opcoes: [

            {
                texto: "📜 Ler o bilhete",
                acao: () => {

                    jogador.flags.encontrouBilhete = true;

                    adicionarItem("bilhete");

                    mostrarCena("bilhete");

                }
            },

            {
                texto: "🖼️ Examinar os retratos",
                acao: () => mostrarCena("retratos")
            },

            {
                texto: "🪜 Subir as escadas",
                acao: () => mostrarCena("corredor")
            },

            {
                texto: "🚪 Tentar abrir a porta de saída",
                acao: () => mostrarCena("portaSaida")
            }

        ]

    },


    /* =================================================
       BILHETE
       ================================================= */

    bilhete: {

        icone: "📜",

        local: "Sala principal",

        titulo: "O bilhete",

        imagem: "📜",

        texto:
            "O papel está amarelado.\n\n" +
            "A mensagem diz:\n\n" +
            "\"Se você está lendo isto, não suba para o segundo andar depois da meia-noite.\"\n\n" +
            "Abaixo da mensagem existe outra frase, escrita com uma letra diferente:\n\n" +
            "\"Ela escuta os passos.\"",

        opcoes: [

            {
                texto: "🖼️ Examinar os retratos",
                acao: () => mostrarCena("retratos")
            },

            {
                texto: "🪜 Ignorar o aviso e subir",
                acao: () => {

                    perderSanidade(10);

                    mostrarCena("corredor");

                }
            },

            {
                texto: "🔎 Procurar algo atrás do bilhete",
                acao: () => {

                    adicionarItem("chave");

                    jogador.flags.pegouChave = true;

                    mostrarCena("chave");

                }
            }

        ]

    },


    /* =================================================
       RETRATOS
       ================================================= */

    retratos: {

        icone: "🖼️",

        local: "Sala",

        titulo: "Os retratos",

        imagem: "👤",

        texto:
            "Você examina os retratos.\n\n" +
            "Todos mostram a mesma família.\n\n" +
            "Um homem.\n" +
            "Uma mulher.\n" +
            "Uma criança.\n\n" +
            "Mas há algo estranho.\n\n" +
            "Em todos os retratos, a criança está olhando diretamente para você.",

        dialogo:
            "Você sente que está sendo observado.",

        opcoes: [

            {
                texto: "📷 Pegar uma fotografia",
                acao: () => {

                    adicionarItem("fotografia");

                    jogador.flags.viuRetrato = true;

                    mostrarCena("sala");

                }
            },

            {
                texto: "👁️ Continuar olhando",
                acao: () => {

                    perderSanidade(12);

                    mostrarCena("retratoOlhar");

                }
            },

            {
                texto: "🪜 Subir as escadas",
                acao: () => mostrarCena("corredor")
            }

        ]

    },


    /* =================================================
       RETRATO
       ================================================= */

    retratoOlhar: {

        icone: "👁️",

        local: "Sala",

        titulo: "Ela mudou de posição",

        imagem: "🖼️",

        texto:
            "Você pisca.\n\n" +
            "A criança não está mais olhando para você.\n\n" +
            "Agora ela está olhando para uma porta no final do corredor.\n\n" +
            "Você olha para o corredor.\n\n" +
            "A porta está fechada.\n\n" +
            "Você volta a olhar para o retrato.\n\n" +
            "A criança está olhando para você novamente.",

        opcoes: [

            {
                texto: "🪜 Subir para o corredor",
                acao: () => mostrarCena("corredor")
            },

            {
                texto: "🏃 Ficar na sala",
                acao: () => mostrarCena("sala")
            }

        ]

    },


    /* =================================================
       CHAVE
       ================================================= */

    chave: {

        icone: "🔑",

        local: "Sala",

        titulo: "Uma chave escondida",

        imagem: "🔑",

        texto:
            "Atrás do bilhete existe uma pequena chave enferrujada.\n\n" +
            "Ela possui o número 13 gravado nela.\n\n" +
            "Talvez abra alguma porta no andar superior.",

        opcoes: [

            {
                texto: "🪜 Subir as escadas",
                acao: () => mostrarCena("corredor")
            },

            {
                texto: "🕯️ Continuar investigando a sala",
                acao: () => mostrarCena("sala")
            }

        ]

    },


    /* =================================================
       PORTA DE SAÍDA
       ================================================= */

    portaSaida: {

        icone: "🚪",

        local: "Entrada",

        titulo: "A saída",

        imagem: "🔒",

        texto:
            "Você tenta abrir a porta.\n\n" +
            "Ela está trancada.\n\n" +
            "Não existe maçaneta do lado de dentro.\n\n" +
            "No metal existe apenas uma frase gravada:\n\n" +
            "\"Primeiro encontre o quarto.\"",

        opcoes: [

            {
                texto: "🪜 Procurar o quarto",
                acao: () => mostrarCena("corredor")
            },

            {
                texto: "🔨 Forçar a porta",
                acao: () => {

                    perderSanidade(10);

                    mostrarCena("portaTrancada");

                }
            }

        ]

    },


    /* =================================================
       CORREDOR
       ================================================= */

    corredor: {

        icone: "🕯️",

        local: "Segundo andar",

        titulo: "O corredor",

        imagem: "🚪",

        texto:
            "O segundo andar é completamente escuro.\n\n" +
            "Você liga a lanterna.\n\n" +
            "Existem quatro portas.\n\n" +
            "101.\n" +
            "102.\n" +
            "103.\n\n" +
            "E uma quarta porta no final do corredor.\n\n" +
            "Nela está escrito apenas:\n\n" +
            "13.",

        opcoes: [

            {
                texto: "🚪 Abrir quarto 101",
                acao: () => mostrarCena("quarto101")
            },

            {
                texto: "🚪 Abrir quarto 102",
                acao: () => mostrarCena("quarto102")
            },

            {
                texto: "🚪 Abrir quarto 103",
                acao: () => mostrarCena("quarto103")
            },

            {
                texto: "🔑 Tentar a chave no quarto 13",
                acao: () => {

                    if (possuiItem("chave")) {

                        jogador.flags.abriuQuarto13 = true;

                        mostrarCena("quarto13");

                    } else {

                        mostrarNotificacao(
                            "Você precisa encontrar uma chave."
                        );

                    }

                }
            }

        ]

    },


    /* =================================================
       QUARTO 101
       ================================================= */

    quarto101: {

        icone: "🛏️",

        local: "Quarto 101",

        titulo: "O quarto vazio",

        imagem: "🛏️",

        texto:
            "O quarto está vazio.\n\n" +
            "Há apenas uma cama e um armário.\n\n" +
            "A cama parece ter sido usada recentemente.\n\n" +
            "Você encontra marcas de mãos na parede.",

        opcoes: [

            {
                texto: "🚪 Abrir o armário",
                acao: () => mostrarCena("armario")
     