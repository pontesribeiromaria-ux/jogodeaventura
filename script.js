
// ==========================
// THE FORGOTTEN HOUSE
// Parte 3
// ==========================

// Elementos
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const hud = document.getElementById("hud");

const playBtn = document.getElementById("playBtn");

const door = document.getElementById("door");
const cabinet = document.getElementById("cabinet");
const painting = document.getElementById("painting");
const windowObj = document.getElementById("window");
const key = document.getElementById("key");

const messageBox = document.getElementById("messageBox");
const message = document.getElementById("message");
const closeMessage = document.getElementById("closeMessage");

const objective = document.querySelector("#objective span");

// Sons
const ambient = document.getElementById("ambient");
const doorSound = document.getElementById("doorSound");
const pickupSound = document.getElementById("pickupSound");

// Variáveis
let hasKey = false;
let cabinetOpened = false;

// Mostrar mensagens
function showMessage(text) {
    message.innerText = text;
    messageBox.style.display = "block";
}

closeMessage.onclick = () => {
    messageBox.style.display = "none";
};

// Iniciar jogo
playBtn.onclick = () => {

    menu.style.display = "none";
    game.style.display = "flex";
    hud.style.display = "block";

    ambient.volume = 0.35;

    ambient.play().catch(() => {});
};

// Armário
cabinet.onclick = () => {

    if (!cabinetOpened) {

        cabinetOpened = true;

        showMessage(
            "Você abre o armário. Há muita poeira... algo caiu no chão."
        );

        key.classList.remove("hidden");

    } else {

        showMessage(
            "O armário está vazio."
        );

    }

};

// Pegar chave
key.onclick = () => {

    hasKey = true;

    key.classList.add("hidden");

    pickupSound.play();

    objective.innerText = "Abra a porta.";

    showMessage(
        "Você encontrou uma chave enferrujada."
    );

};

// Quadro
painting.onclick = () => {

    showMessage(
        "Os olhos do retrato parecem seguir você..."
    );

};

// Janela
windowObj.onclick = () => {

    showMessage(
        "Está completamente escuro lá fora. Algo parece ter passado pela janela."
    );

};

// Porta
door.onclick = () => {

    if (!hasKey) {

        showMessage(
            "A porta está trancada."
        );

        return;

    }

    doorSound.play();

    objective.innerText = "Escapar.";

    document.getElementById("victory").style.display = "flex";

};

// ==========================
// PARTE 4
// Terror e Eventos
// ==========================

const ghost = document.getElementById("ghost");
const jumpSound = document.getElementById("jumpSound");
const batteryLevel = document.getElementById("batteryLevel");

let battery = 100;
let flashlightOn = true;

// Atualiza a bateria
function updateBattery() {
    batteryLevel.style.width = battery + "%";

    if (battery > 60) {
        batteryLevel.style.background = "lime";
    } else if (battery > 30) {
        batteryLevel.style.background = "yellow";
    } else {
        batteryLevel.style.background = "red";
    }
}

// Consumo da bateria
setInterval(() => {

    if (!flashlightOn) return;

    battery -= 0.5;

    if (battery < 0) battery = 0;

    updateBattery();

    if (battery <= 0) {

        flashlightOn = false;

        document.body.style.filter = "brightness(0.15)";

        showMessage(
            "Sua lanterna ficou sem bateria..."
        );

    }

}, 1000);

// Liga/desliga lanterna (tecla F)
document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "f") {

        if (battery <= 0) return;

        flashlightOn = !flashlightOn;

        if (flashlightOn) {
            document.body.style.filter = "brightness(1)";
        } else {
            document.body.style.filter = "brightness(0.35)";
        }

    }

});

// Aparição do fantasma
function ghostAppear() {

    ghost.classList.remove("hidden");
    ghost.style.opacity = "1";

    jumpSound.play();

    document.body.classList.add("flash");

    setTimeout(() => {

        ghost.style.opacity = "0";

        setTimeout(() => {
            ghost.classList.add("hidden");
        }, 200);

        document.body.classList.remove("flash");

    }, 700);

}

// Eventos aleatórios
setInterval(() => {

    if (menu.style.display !== "none") return;

    const random = Math.floor(Math.random() * 100);

    if (random < 18) {
        ghostAppear();
    }

}, 8000);

// Mensagens assustadoras
const scaryMessages = [

    "Você ouviu passos atrás de você...",

    "Algo respirou perto do seu ouvido.",

    "O silêncio ficou estranho.",

    "Você sente que está sendo observado.",

    "A temperatura caiu de repente."

];

setInterval(() => {

    if (menu.style.display !== "none") return;

    if (Math.random() < 0.25) {

        const text =
            scaryMessages[
                Math.floor(Math.random() * scaryMessages.length)
            ];

        showMessage(text);

    }

}, 15000);

// Inicializa bateria
updateBattery();

// ==========================
// PARTE 5
// IA DO FANTASMA
// ==========================

let playerAlive = true;

let ghostX = 430;
let ghostY = 140;

ghost.style.left = ghostX + "px";
ghost.style.top = ghostY + "px";

// Movimenta o fantasma
function moveGhost() {

    if (!playerAlive) return;

    const objects = [door, cabinet, painting, windowObj];

    const target =
        objects[Math.floor(Math.random() * objects.length)];

    const targetX = target.offsetLeft;
    const targetY = target.offsetTop;

    ghost.classList.remove("hidden");
    ghost.style.opacity = "0.35";

    ghostX = targetX;
    ghostY = targetY;

    ghost.style.left = ghostX + "px";
    ghost.style.top = ghostY + "px";
}

// Patrulha
setInterval(() => {

    if (menu.style.display !== "none") return;

    if (!playerAlive) return;

    moveGhost();

}, 6000);

// Ataque aleatório
function ghostAttack() {

    if (!playerAlive) return;

    ghost.classList.remove("hidden");
    ghost.style.opacity = "1";

    jumpSound.currentTime = 0;
    jumpSound.play();

    document.body.classList.add("flash");

    showMessage("O fantasma encontrou você!");

    setTimeout(() => {

        document.body.classList.remove("flash");

        playerAlive = false;

        document.getElementById("gameOver").style.display = "flex";

    }, 2500);

}

// Chance de ataque
setInterval(() => {

    if (menu.style.display !== "none") return;

    if (!playerAlive) return;

    if (Math.random() < 0.15) {
        ghostAttack();
    }

}, 12000);

// Mensagens do fantasma
const whispers = [

    "Saia daqui...",

    "Você não deveria estar aqui...",

    "Estou observando você...",

    "Não há saída...",

    "Você será o próximo..."

];

setInterval(() => {

    if (!playerAlive) return;

    if (Math.random() < 0.30) {

        showMessage(
            whispers[Math.floor(Math.random() * whispers.length)]
        );

    }

}, 18000);