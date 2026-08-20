// ==========================================
// A FLORESTA ESQUECIDA
// SISTEMA PRINCIPAL DO JOGO
// ==========================================


// ------------------------------------------
// ESTADO DO JOGADOR
// ------------------------------------------

let jogador = {

    vida: 100,

    maxVida: 100,

    moedas: 0,

    capitulo: 1,

    local: "estrada",

    inventario: [],

    escolhas: [],

    flags: {},

    finais: [],

    progresso: 0
};


// ------------------------------------------
// ELEMENTOS HTML
// ------------------------------------------

const vidaElement =
    document.getElementById("vida");

const moedasElement =
    document.getElementById("moedas");

const capituloElement =
    document.getElementById("capitulo");

const barraVida =
    document.getElementById("barraVida");

const tituloElement =
    document.getElementById("titulo");

const historiaElement =
    document.getElementById("historia");

const opcoesElement =
    document.getElementById("opcoes");

const inventarioElement =
    document.getElementById("itens");

const objetivoElement =
    document.getElementById("objetivo");

const localElement =
    document.getElementById("nomeLocal");

const iconeLocalElement =
    document.getElementById("iconeLocal");

const imagemLocalElement =
    document.getElementById("imagemLocal");

const dialogoElement =
    document.getElementById("dialogo");


// ------------------------------------------
// BANCO DE ITENS
// ------------------------------------------

const itens = {

    chave: {
        nome: "Chave enferrujada",
        emoji: "🔑",
        descricao:
            "Uma chave antiga coberta de ferrugem."
    },

    cristal: {
        nome: "Cristal verde",
        emoji: "💎",
        descricao:
            "Um cristal que parece pulsar com energia."
    },

    mapa: {
        nome: "Mapa antigo",
        emoji: "🗺️",
        descricao:
            "Um mapa mostrando lugares que não deveriam existir."
    },

    tocha: {
        nome: "Tocha",
        emoji: "🔥",
        descricao:
            "Uma tocha capaz de iluminar lugares escuros."
    },

    amuleto: {
        nome: "Amuleto",
        emoji: "🔮",
        descricao:
            "Um pequeno amuleto encontrado em uma ruína."
    },

    espada: {
        nome: "Espada antiga",
        emoji: "⚔️",
        descricao:
            "Uma espada velha, mas ainda afiada."
    },

    pocao: {
        nome: "Poção",
        emoji: "🧪",
        descricao:
            "Recupera 30 pontos de vida."
    },

    fragmento: {
        nome: "Fragmento sombrio",
        emoji: "🖤",
        descricao:
            "Uma pedra escura que parece absorver a luz."
    },

    medalhao: {
        nome: "Medalhão",
        emoji: "📿",
        descricao:
            "Um medalhão com o símbolo da floresta."
    }

};


// ------------------------------------------
// LOCAIS
// ------------------------------------------

const locais = {

    estrada: {
        nome: "Estrada abandonada",
        icone: "🛣️",
        imagem: "🌫️"
    },

    floresta: {
        nome: "Floresta",
        icone: "🌲",
        imagem: "🌲"
    },

    cabana: {
        nome: "Cabana abandonada",
        icone: "🏚️",
        imagem: "🏚️"
    },

    rio: {
        nome: "Rio escuro",
        icone: "🌊",
        imagem: "🌊"
    },

    ruinas: {
        nome: "Ruínas antigas",
        icone: "🏛️",
        imagem: "🏛️"
    },

    torre: {
        nome: "Torre esquecida",
        icone: "🏰",
        imagem: "🏰"
    },

    caverna: {
        nome: "Caverna",
        icone: "🕳️",
        imagem: "🪨"
    },

    templo: {
        nome: "Templo da floresta",
        icone: "⛩️",
        imagem: "🔮"
    },

    lago: {
        nome: "Lago da Lua",
        icone: "🌙",
        imagem: "🌙"
    }

};


// ------------------------------------------
// FUNÇÕES DE INTERFACE
// ------------------------------------------

function atualizarInterface() {

    vidaElement.textContent =
        Math.max(0, jogador.vida);

    moedasElement.textContent =
        jogador.moedas;

    capituloElement.textContent =
        jogador.capitulo;

    let porcentagem =
        (jogador.vida / jogador.maxVida) * 100;

    porcentagem =
        Math.max(0, Math.min(100, porcentagem));

    barraVida.style.width =
        porcentagem + "%";

    atualizarInventario();

    atualizarLocal();

    atualizarObjetivo();
}


function atualizarLocal() {

    const local =
        locais[jogador.local];

    if (!local) return;

    localElement.textContent =
        local.nome;

    iconeLocalElement.textContent =
        local.icone;

    imagemLocalElement.textContent =
        local.imagem;
}


function atualizarInventario() {

    inventarioElement.innerHTML = "";

    if (jogador.inventario.length === 0) {

        inventarioElement.innerHTML =
            `<span class="vazio">
                Você não possui itens.
            </span>`;

        return;
    }


    jogador.inventario.forEach(id => {

        const item =
            itens[id];

        if (!item) return;

        const elemento =
            document.createElement("div");

        elemento.className =
            "item";

        elemento.innerHTML =
            `${item.emoji} ${item.nome}`;

        inventarioElement.appendChild(
            elemento
        );

    });

}


function atualizarObjetivo() {

    const objetivos = {

        1:
            "Descubra onde você está e encontre uma saída da floresta.",

        2:
            "Encontre a cabana abandonada e descubra o segredo da chave.",

        3:
            "Explore as ruínas e descubra a origem da floresta.",

        4:
            "Encontre a entrada da caverna.",

        5:
            "Descubra como chegar ao templo.",

        6:
            "Encontre os três símbolos antigos.",

        7:
            "Chegue à Torre Esquecida.",

        8:
            "Decida o destino da floresta."

    };


    objetivoElement.textContent =
        objetivos[jogador.capitulo] ||
        objetivos[8];
}


// ------------------------------------------
// NARRAÇÃO
// ------------------------------------------

function mostrarCena(
    titulo,
    texto,
    opcoes = [],
    dialogo = ""
) {

    tituloElement.textContent =
        titulo;

    historiaElement.textContent =
        texto;

    dialogoElement.innerHTML = "";

    if (dialogo) {

        dialogoElement.innerHTML =
            `<div class="dialogo-caixa">
                ${dialogo}
            </div>`;

    }


    opcoesElement.innerHTML = "";


    opcoes.forEach(opcao => {

        const botao =
            document.createElement("button");

        botao.className =
            "opcao";

        if (opcao.perigosa) {

            botao.classList.add(
                "perigosa"
            );

        }

        botao.textContent =
            opcao.texto;

        botao.onclick =
            opcao.acao;

        opcoesElement.appendChild(
            botao
        );

    });


    atualizarInterface();
}


// ------------------------------------------
// SISTEMA DE ITENS
// ------------------------------------------

function adicionarItem(id) {

    if (!itens[id]) return;

    if (
        jogador.inventario.includes(id)
    ) {

        mostrarNotificacao(
            "Você já possui este item."
        );

        return false;
    }


    jogador.inventario.push(id);

    mostrarNotificacao(
        `${itens[id].emoji} ${itens[id].nome} adquirido!`
    );

    atualizarInterface();

    return true;
}


function removerItem(id) {

    const indice =
        jogador.inventario.indexOf(id);

    if (indice === -1)
        return false;

    jogador.inventario.splice(
        indice,
        1
    );

    atualizarInterface();

    return true;
}


function possuiItem(id) {

    return jogador.inventario.includes(
        id
    );

}


// ------------------------------------------
// VIDA
// ------------------------------------------

function perderVida(valor) {

    jogador.vida -= valor;

    jogador.vida =
        Math.max(
            0,
            jogador.vida
        );

    atualizarInterface();

    if (jogador.vida <= 0) {

        finalMorte();

        return true;
    }

    return false;
}


function recuperarVida(valor) {

    jogador.vida += valor;

    jogador.vida =
        Math.min(
            jogador.maxVida,
            jogador.vida
        );

    atualizarInterface();
}


// ------------------------------------------
// MOEDAS
// ------------------------------------------

function ganharMoedas(valor) {

    jogador.moedas += valor;

    mostrarNotificacao(
        `💰 +${valor} moedas`
    );

    atualizarInterface();
}


function gastarMoedas(valor) {

    if (
        jogador.moedas < valor
    ) {

        mostrarNotificacao(
            "Você não possui moedas suficientes."
        );

        return false;
    }


    jogador.moedas -= valor;

    atualizarInterface();

    return true;
}


// ------------------------------------------
// CAPÍTULO 1
// ------------------------------------------

function iniciarJogo() {

    jogador.capitulo = 1;

    jogador.local =
        "estrada";

    mostrarCena(

        "Acordando na floresta",

        "Você abre os olhos lentamente. " +
        "A primeira coisa que percebe é o frio. " +
        "A segunda é que não sabe onde está. " +
        "Uma estrada coberta por neblina se estende à sua frente. " +
        "Ao seu redor existem árvores enormes. " +
        "Nenhum pássaro canta. Nenhum inseto faz barulho.",

        [

            {
                texto:
                    "🌲 Entrar na floresta",

                acao:
                    entrarFloresta
            },

            {
                texto:
                    "🛣️ Seguir pela estrada",

                acao:
                    seguirEstrada
            },

            {
                texto:
                    "🔍 Examinar o local",

                acao:
                    examinarEstrada
            }

        ],

        "Uma voz distante sussurra seu nome..."
    );
}


function examinarEstrada() {

    if (
        !possuiItem("mapa")
    ) {

        adicionarItem("mapa");

        mostrarCena(

            "O mapa",

            "Debaixo de algumas folhas você encontra " +
            "um pedaço de papel dobrado. " +
            "É um mapa antigo da região. " +
            "Há três lugares marcados: uma cabana, " +
            "uma torre e um templo.",

            [

                {
                    texto:
                        "🌲 Entrar na floresta",

                    acao:
                        entrarFloresta
                },

                {
                    texto:
                        "🛣️ Seguir pela estrada",

                    acao:
                        seguirEstrada
                }

            ]

        );

    }

}


function seguirEstrada() {

    jogador.local =
        "estrada";

    mostrarCena(

        "A estrada abandonada",

        "Você segue pela estrada. " +
        "A neblina fica mais espessa conforme avança. " +
        "Depois de alguns minutos, você encontra uma pequena cabana. " +
        "Uma luz fraca aparece pela janela.",

        [

            {
                texto:
                    "🏚️ Entrar na cabana",

                acao:
                    entrarCabana
            },

            {
                texto:
                    "🌲 Ir para a floresta",

                acao:
                    entrarFloresta
            },

            {
                texto:
                    "👀 Observar a cabana de longe",

                acao:
                    observarCabana
            }

        ]

    );

}


function observarCabana() {

    mostrarCena(

        "A janela",

        "Você observa a cabana pela janela. " +
        "Existe alguém sentado diante de uma mesa. " +
        "A pessoa parece estar esperando por você.",

        [

            {
                texto:
                    "🚪 Entrar",

                acao:
                    entrarCabana
            },

            {
                texto:
                    "🏃 Ir embora",

                acao:
                    entrarFloresta
            }

        ]

    );

}


// ------------------------------------------
// FLORESTA
// ------------------------------------------

function entrarFloresta() {

    jogador.local =
        "floresta";

    mostrarCena(

        "A floresta",

        "As árvores fecham o caminho atrás de você. " +
        "Você tenta voltar, mas não consegue encontrar " +
        "a estrada. Então percebe três caminhos: " +
        "um leva até um rio, outro até algumas ruínas " +
        "e o terceiro desce por uma trilha escura.",

        [

            {
                texto:
                    "🌊 Ir até o rio",

                acao:
                    irRio
            },

            {
                texto:
                    "🏛️ Explorar as ruínas",

                acao:
                    irRuinas
            },

            {
                texto:
                    "🌑 Seguir a trilha escura",

                acao:
                    trilhaEscura,
                perigosa:
                    true
            },

            {
                texto:
                    "🏚️ Procurar a cabana",

                acao:
                    procurarCabana
            }

        ]

    );

}


function procurarCabana() {

    jogador.local =
        "floresta";

    mostrarCena(

        "A cabana escondida",

        "Depois de caminhar entre as árvores, " +
        "você finalmente encontra a cabana. " +
        "A porta está entreaberta.",

        [

            {
                texto:
                    "🏚️ Entrar",

                acao:
                    entrarCabana
            },

            {
                texto:
                    "🌲 Voltar",

                acao:
                    entrarFloresta
            }

        ]

    );

}


// ------------------------------------------
// CABANA
// ------------------------------------------

function entrarCabana() {

    jogador.capitulo = 2;

    jogador.local =
        "cabana";

    mostrarCena(

        "A cabana",

        "O interior da cabana está coberto de poeira. " +
        "Há livros espalhados pelo chão. " +
        "No centro existe uma mesa com uma vela acesa. " +
        "Você tem certeza de que a vela não estava acesa quando entrou.",

        [

            {
                texto:
                    "📚 Examinar os livros",

                acao:
                    examinarLivros
            },

            {
                texto:
                    "🕯️ Examinar a vela",

                acao:
                    examinarVela
            },

            {
                texto:
                    "🚪 Procurar outro cômodo",

                acao:
                    procurarQuarto
            }

        ],

        "??? — Finalmente você chegou."
    );

}


function examinarLivros() {

    if (
        !possuiItem("chave")
    ) {

        adicionarItem("chave");

    }


    mostrarCena(

        "O diário",

        "Entre os livros você encontra um diário. " +
        "A maior parte das páginas está ilegível. " +
        "Na última página existe uma frase: " +
        "\"A chave abre o caminho, mas não a saída.\" " +
        "Junto ao diário existe uma pequena chave.",

        [

            {
                texto:
                    "🔑 Pegar a chave",

                acao:
                    depoisDiario
            },

            {
                texto:
                    "🚪 Procurar outro cômodo",

                acao:
                    procurarQuarto
            }

        ]

    );

}


function depoisDiario() {

    adicionarItem("chave");

    procurarQuarto();

}


function examinarVela() {

    mostrarCena(

        "A chama",

        "A chama da vela fica azul por alguns segundos. " +
        "Então você percebe uma sombra atrás de você. " +
        "Quando se vira, não há ninguém.",

        [

            {
                texto:
                    "🏃 Sair da cabana",

                acao:
                    entrarFloresta
            },

            {
                texto:
                    "🔎 Procurar a origem da sombra",

                acao:
                    procurarQuarto
            }

        ]

    );

}


function procurarQuarto() {

    mostrarCena(

        "O quarto",

        "No fundo da cabana existe uma pequena porta. " +
        "Ela possui uma fechadura antiga.",

        [

            {
                texto:
                    "🔑 Usar a chave",

                acao:
                    abrirQuarto
            },

            {
                texto:
                    "🚪 Voltar",

                acao:
                    entrarCabana
            }

        ]

    );

}


function abrirQuarto() {

    if (
        !possuiItem("chave")
    ) {

        mostrarCena(

            "Trancado",

            "Você precisa de uma chave.",

            [

                {
                    texto:
                        "📚 Procurar nos livros",

                    acao:
                        examinarLivros
                }

            ]

        );

        return;
    }


    jogador.capitulo = 3;

    mostrarCena(

        "O quarto secreto",

        "A porta se abre. Dentro existe uma pequena sala subterrânea. " +
        "Nas paredes há desenhos da floresta. " +
        "Um deles mostra uma criatura segurando um cristal.",

        [

            {
                texto:
                    "💎 Pegar o cristal",

                acao:
                    pegarCristal
            },

            {
                texto:
                    "🗺️ Examinar os desenhos",

                acao:
                    examinarDesenhos
            }

        ]

    );

}


function pegarCristal() {

    adicionarItem("cristal");

    mostrarCena(

        "O cristal verde",

        "Assim que você toca no cristal, todas as velas da cabana se acendem. " +
        "Uma voz ecoa pela sala: \"Agora ela sabe que você está aqui.\"", 

        [

            {
                texto:
                    "🏃 Fugir da cabana",

                acao:
                    entrarFloresta
            },

            {
                texto:
                    "🔎 Continuar investigando",

                acao:
                    examinarDesenhos
            }

        ]

    );

}


function examinarDesenhos() {

    adicionarItem("amuleto");

    mostrarCena(

        "O símbolo",

        "Você encontra um desenho que mostra três símbolos: " +
        "a lua, a árvore e o olho. " +
        "Abaixo deles existe uma frase: " +
        "\"Quando os três se encontrarem, a porta despertará.\"", 

        [

            {
                texto:
                    "🏛️ Ir para as ruínas",

                acao:
                    irRuinas
            },

            {
                texto:
                    "🌲 Voltar para a floresta",

                acao:
                    entrarFloresta
            }

        ]

    );

}


// ------------------------------------------
// RIO
// ------------------------------------------

function irRio() {

    jogador.local =
        "rio";

    mostrarCena(

        "O rio escuro",

        "Você chega a um rio de águas extremamente escuras. " +
        "No meio dele existe uma pequena ilha. " +
        "Algo brilha sobre uma pedra.",

        [

            {
                texto:
                    "🌊 Atravessar o rio",

                acao:
                    atravessarRio,
                perigosa:
                    true
            },

            {
                texto:
                    "🔎 Procurar outro caminho",