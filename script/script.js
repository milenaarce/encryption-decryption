function encryptMessage(message, cle, algorithme) {
    switch (algorithme) {
        case "cesar":
            return cesarEncrypt(message, parseInt(cle));
        case "vigenere":
            return vigenereEncrypt(message, cle);
        case "xor":
            return xorEncrypt(message, cle);
        default:
            return "algorithmee non supporté.";
    }
}

function decryptMessage(encryptedMessage, cle, algorithme) {
    switch (algorithme) {
        case "cesar":
            return cesarEncrypt(encryptedMessage, -parseInt(cle)); // Même fonction pour chiffrer/déchiffrer, inverser la clé pour déchiffrer
        case "vigenere":
            return vigenereDecrypt(encryptedMessage, cle);
        case "xor":
            return xorEncrypt(encryptedMessage, cle); // Même fonction pour chiffrer/déchiffrer
        default:
            return "algorithmee non supporté.";
    }
}

function cesarEncrypt(message, n) {
    return message
        .split("")
        .map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0);
                const base = char >= "a" ? 97 : 65; // Majuscule ou minuscule
                return String.fromCharCode(((code - base + n) % 26 + 26) % 26 + base);
            }
            return char;
        })
        .join("");
}

function vigenereEncrypt(message, cle) {
    cle = cle.toLowerCase();
    let cleIndex = 0;
    return message
        .split("")
        .map(char => {
            if (char.match(/[a-z]/i)) {
                const base = char >= "a" ? 97 : 65;
                const n = cle[cleIndex % cle.length].charCodeAt(0) - 97;
                cleIndex++;
                return String.fromCharCode(((char.charCodeAt(0) - base + n) % 26) + base);
            }
            return char;
        })
        .join("");
}

function vigenereDecrypt(encryptedMessage, cle) {
    cle = cle.toLowerCase();
    let cleIndex = 0;
    return encryptedMessage
        .split("")
        .map(char => {
            if (char.match(/[a-z]/i)) {
                const base = char >= "a" ? 97 : 65;
                const n = cle[cleIndex % cle.length].charCodeAt(0) - 97;
                cleIndex++;
                return String.fromCharCode(((char.charCodeAt(0) - base - n + 26) % 26) + base);
            }
            return char;
        })
        .join("");
}

function xorEncrypt(message, cle) {
    return message
        .split("")
        .map((char, index) => String.fromCharCode(char.charCodeAt(0) ^ cle.charCodeAt(index % cle.length)))
        .join("");
}


let historique = JSON.parse(sessionStorage.getItem("historique")) || [];

const encryptForm = document.querySelector("#encrypt-form");
const decryptForm = document.querySelector("#decrypt-form");

if (encryptForm) {
    encryptForm.addEventListener("submit", e => {
        e.preventDefault();
        const algorithme = e.target.algorithme.value;
        const message = e.target.message.value;
        const cle = e.target.cle.value;
        const encrypted = encryptMessage(message, cle, algorithme);
        
        document.querySelector("#resultat").innerHTML = `<h3>Message chiffré : ${encrypted}</h3>`;

        historique.push({ "messO":message, "messCD":encrypted, "algorithme":algorithme, "cle":cle, "date": new Date().toLocaleString()});
        console.log(historique)
        sessionStorage.setItem("historique", JSON.stringify(historique));

        e.target.reset();
    });
}

if (decryptForm) {
    decryptForm.addEventListener("submit", e => {
        e.preventDefault();
        const algorithme = e.target.algorithme.value;
        const encryptedMessage = e.target.message.value;
        const cle = e.target.cle.value;
        const decrypted = decryptMessage(encryptedMessage, cle, algorithme);
        
        document.querySelector("#resultat").innerHTML = `<h3>Message déchiffré : ${decrypted}</h3>`;

        historique.push( { "messO":encryptedMessage, "messCD":decrypted, "algorithme":algorithme, "cle":cle, "date": new Date().toLocaleString()});
        console.log(historique)
        sessionStorage.setItem("historique", JSON.stringify(historique));

        e.target.reset();
    });
} 


const historiqueButton = document.querySelector("#btn-historique");
if (historiqueButton) {
    historiqueButton.addEventListener("click", montrerHistorique);
} 

function codeHistorique(historique){
    let hist = ""
    
    hist += `
    <thead>
        <tr>
            <th>Message original</th>
            <th>Message chiffré/déchiffré</th>
            <th>Algorithme</th>
            <th>Clé</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>`
    for (const elt of historique) {
        hist += `
        <tr>
            <td>${elt.messO}</td>
            <td>${elt.messCD}</td>
            <td>${elt.algorithme}</td>
            <td>${elt.cle}</td>
            <td>${elt.date}</td>
        </tr>`;
    }
    hist+= `</tbody>`
    console.log(hist)
    return hist
}
function montrerHistorique(){
    const historique = JSON.parse(sessionStorage.getItem("historique")) || [];
    console.log(historique)
    const historiqueData = document.querySelector("#historique-data");
    if (historiqueData) {
        if (historique.length === 0) {
            historiqueData.innerHTML = "<p>Il n'y a pas encore d'historique disponible</p>";
            return
        }
        historiqueData.innerHTML = codeHistorique(historique);
    } else {
        console.error("L'élément #historique-data n'existe pas.");
    }
}


