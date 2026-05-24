let globalBudget = 100;
let currentTurn = 1;
let selectedRegionId = null;
let regions = {}; 

window.onload = function() {
    initializeMap();
};

function initializeMap() {
    let paths = document.querySelectorAll('#map-container svg path');
    let selectEl = document.getElementById('country-select');
    
    paths.forEach(path => {
        let id = path.id || "region_" + Math.random().toString(36).substr(2, 5);
        path.id = id;
        
        if (path.getAttribute('d') && path.getAttribute('d').length > 30) {
            regions[id] = {
                name: id.toUpperCase(),
                owner: "enemy",
                troops: Math.floor(Math.random() * 8) + 2, 
                stability: 40,
                income: Math.floor(Math.random() * 20) + 10
            };

            let option = document.createElement('option');
            option.value = id;
            option.text = id.toUpperCase() + " Bölgesi";
            selectEl.appendChild(option);

            path.addEventListener('click', function(e) { 
                e.stopPropagation(); 
                clickRegion(id); 
            });
        }
    });
}

function startGame() {
    let playerCountryId = document.getElementById('country-select').value;
    if(!playerCountryId) return alert("Ülke seç!");
    
    regions[playerCountryId].owner = "player";
    regions[playerCountryId].stability = 100;
    regions[playerCountryId].troops += 10;
    
    document.getElementById('ui-player-country').innerText = regions[playerCountryId].name;
    document.getElementById('start-screen').style.display = 'none';
    updateMapColors();
    logNews("Oyun başladı! Komuta sizde.", "player");
}

function updateMapColors() {
    for (let id in regions) {
        let elem = document.getElementById(id);
        if (elem) {
            elem.className.baseVal = ""; // reset
            elem.classList.add('owner-' + regions[id].owner);
        }
    }
}

function clickRegion(id) {
    selectedRegionId = id;
    let reg = regions[id];
    
    document.querySelectorAll('path').forEach(p => p.classList.remove('selected-region'));
    document.getElementById(id).classList.add('selected-region');

    document.getElementById('panel-region-name').innerText = reg.name;
    document.getElementById('panel-status').innerText = "Sahibi: " + reg.owner;
    document.getElementById('panel-troops').innerText = reg.troops + " Tugay";
    document.getElementById('panel-stability').innerText = "%" + reg.stability;
    document.getElementById('panel-income').innerText = reg.income + "M $";

    document.getElementById('btn-action-train').disabled = (reg.owner !== "player" || globalBudget < 20);
    document.getElementById('btn-action-attack').disabled = (reg.owner === "player");
    document.getElementById('btn-action-stabilize').disabled = (reg.owner !== "player" || reg.stability >= 100 || globalBudget < 15);
}

function executeTrain() {
    globalBudget -= 20;
    regions[selectedRegionId].troops += 1;
    logNews("Tugay eğitildi.", "player");
    updateUI();
}

function executeStabilize() {
    globalBudget -= 15;
    regions[selectedRegionId].stability = Math.min(100, regions[selectedRegionId].stability + 30);
    logNews("Asimilasyon yapıldı.", "player");
    updateUI();
}

function executeAttack() {
    document.getElementById('battle-modal').style.display = 'flex';
    let diceA = document.getElementById('dice-attacker');
    let diceD = document.getElementById('dice-defender');
    
    let count = 0;
    let interval = setInterval(() => {
        diceA.innerText = Math.floor(Math.random() * 6) + 1;
        diceD.innerText = Math.floor(Math.random() * 6) + 1;
        count++;
        if (count > 10) {
            clearInterval(interval);
            finishBattle();
        }
    }, 100);
}

function finishBattle() {
    let rollA = parseInt(document.getElementById('dice-attacker').innerText);
    let rollD = parseInt(document.getElementById('dice-defender').innerText);
    
    if (rollA + 5 > rollD + regions[selectedRegionId].troops) {
        regions[selectedRegionId].owner = "player";
        document.getElementById('battle-result-text').innerText = "ZAFER!";
        logNews("Bölge fethedildi!", "player");
    } else {
        document.getElementById('battle-result-text').innerText = "YENİLGİ!";
        logNews("Saldırı başarısız.", "enemy");
    }
    document.getElementById('btn-close-battle').style.display = 'block';
    updateUI();
}

function closeBattleModal() { document.getElementById('battle-modal').style.display = 'none'; }

function endTurn() {
    currentTurn++;
    globalBudget += 50; 
    document.getElementById('ui-turn').innerText = "Tur: " + currentTurn;
    document.getElementById('ui-budget').innerText = "Bütçe: " + globalBudget + "M $";
    logNews("Yeni tur başladı.", "player");
}

function updateUI() {
    document.getElementById('ui-budget').innerText = "Bütçe: " + globalBudget + "M $";
    updateMapColors();
    if (selectedRegionId) clickRegion(selectedRegionId);
}

function logNews(text, type) {
    let box = document.getElementById('news-feed-box');
    box.innerHTML += `<div class="news-item news-${type}">${text}</div>`;
}
