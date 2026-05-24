
let globalBudget = 100;
let currentTurn = 1;
let selectedRegionId = null;
let regions = {}; 

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
    regions[playerCountryId].owner = "player";
    regions[playerCountryId].stability = 100;
    document.getElementById('ui-player-country').innerText = regions[playerCountryId].name;
    document.getElementById('start-screen').style.display = 'none';
    updateMapColors();
}

function updateMapColors() {
    for (let id in regions) {
        let elem = document.getElementById(id);
        if (elem) {
            elem.classList.remove('owner-player', 'owner-enemy');
            elem.classList.add('owner-' + regions[id].owner);
        }
    }
}

// Buraya clickRegion, executeTrain, executeAttack gibi diğer fonksiyonları 
// önceki koddan aynen kopyalayıp buraya yapıştırabilirsin.
// (Karakter sınırı için hepsini yazmadım, bir önceki kodun içindeki JS kısmını buraya al.)
