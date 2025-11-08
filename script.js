document.getElementById('godina').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function showSectionFromHash() {

        const id = (location.hash || '#pocetna').replace('#', '');
        const sections = document.querySelectorAll('main section');

        sections.forEach(s => {

            if (s.id === id) {

                s.classList.add('active');
                s.setAttribute('aria-hidden', 'false');

            } else {

                s.classList.remove('active');
                s.setAttribute('aria-hidden', 'true');

            }
        });
    }

    navLinks.forEach(link => {

        link.addEventListener('click', (e) => {

            e.preventDefault();
            const id = link.getAttribute('href').replace('#', '') || 'pocetna';

            history.pushState(null, '', '#' + id);
            showSectionFromHash();

        });
    });

    window.addEventListener('hashchange', showSectionFromHash);

    showSectionFromHash();
});

class Finansije {

    constructor(brRacuna, ime, prezime, stanje, pin) {

        this.brRacuna = brRacuna;
        this.ime = ime;
        this.prezime = prezime;
        this.stanje = stanje;
        this.pin = pin;
        this.zakljucan = false;
        this.transakcije = [];

    }

    prihod(iznos, opis = "Uplata") {

        if (this.zakljucan) return "Račun je zaključan!";
        if (iznos <= 0) return "Iznos mora biti veći od nule.";

        this.stanje += iznos;
        this.transakcije.push(`[PRIHOD] +${iznos} RSD | ${opis} | Novo stanje: ${this.stanje} RSD`);

        return `Uspešno dodat prihod: +${iznos} RSD. Novo stanje: ${this.stanje} RSD.`;
    }

    rashod(iznos, opis = "Isplata") {

        if (this.zakljucan) return "Račun je zaključan!";
        if (iznos <= 0) return "Iznos mora biti veći od nule.";
        if (iznos > this.stanje) return "Nedovoljno sredstava!";

        this.stanje -= iznos;
        this.transakcije.push(`[RASHOD] -${iznos} RSD | ${opis} | Novo stanje: ${this.stanje} RSD`);

        return `Uspešno skinuto ${iznos} RSD. Novo stanje: ${this.stanje} RSD.`;
    }

    zakljucajRacun() {

        if (this.zakljucan) return "Račun je već zaključan.";
        this.zakljucan = true;

        this.transakcije.push("[OBAVEŠTENJE] Račun zaključan.");
        return "Račun je zaključan.";

    }

    otkljucajRacun(pinUnos) {

        if (!this.zakljucan) return "Račun je već otključan.";
        if (pinUnos === this.pin) {

            this.zakljucan = false;
            this.transakcije.push("[OBAVEŠTENJE] Račun uspešno otključan.");
            return "Račun je uspešno otključan.";

        } else {

            this.transakcije.push("[POKUŠAJ] Neispravan PIN pri otključavanju.");
            return "Neispravan PIN! Pokušaj ponovo.";

        }
    }

    prikaziTransakcije() {

        if (this.transakcije.length === 0) return ["Nema transakcija."];
        return this.transakcije;

    }
}

let racun = null;

document.getElementById("kreirajRacun").addEventListener("click", () => {

    const br = document.getElementById("brRacuna").value.trim();
    const ime = document.getElementById("ime").value.trim();
    const prez = document.getElementById("prezime").value.trim();
    const stanje = parseFloat(document.getElementById("pocetnoStanje").value) || 0;
    const pin = document.getElementById("pin").value.trim();

    if (!br || !ime || !prez || !pin) {

        document.getElementById("infoRacun").textContent = "Molimo unesite sve podatke, uključujući PIN.";
        return;

    }
    if (pin.length !== 4 || isNaN(pin)) {

        document.getElementById("infoRacun").textContent = "PIN mora imati 4 cifre.";
        return;

    }

    racun = new Finansije(br, ime, prez, stanje, pin);
    document.getElementById("infoRacun").textContent = `Račun kreiran za ${ime} ${prez}. Stanje: ${stanje} RSD.`;
});

document.getElementById("dodajPrihod").addEventListener("click", () => {

    if (!racun) return alert("Prvo kreirajte račun!");
    const iznos = parseFloat(document.getElementById("prihodIznos").value);

    const opis = document.getElementById("prihodOpis").value;
    alert(racun.prihod(iznos, opis));

});

document.getElementById("dodajRashod").addEventListener("click", () => {

    if (!racun) return alert("Prvo kreirajte račun!");

    const iznos = parseFloat(document.getElementById("rashodIznos").value);
    const opis = document.getElementById("rashodOpis").value;

    alert(racun.rashod(iznos, opis));

});

document.getElementById("izracunajStednju").addEventListener("click", () => {

    const opcija = document.getElementById("stednjaOpcija").value;
    const glavnica = parseFloat(document.getElementById("glavnica").value);
    const kamata = parseFloat(document.getElementById("kamata").value);
    const godine = parseFloat(document.getElementById("godine").value);
    const konacno = parseFloat(document.getElementById("konacno").value);
    let rezultat = "";

    switch (opcija) {

        case "1":

            rezultat = glavnica * Math.pow((1 + kamata / 100), godine);
            document.getElementById("rezultatStednje").textContent = `Konačno stanje: ${rezultat.toFixed(2)} RSD.`;
            break;

        case "2":

            rezultat = konacno / Math.pow((1 + kamata / 100), godine);
            document.getElementById("rezultatStednje").textContent = `Glavnica: ${rezultat.toFixed(2)} RSD.`;
            break;

        case "3":

            rezultat = (Math.pow((konacno / glavnica), (1 / godine)) - 1) * 100;
            document.getElementById("rezultatStednje").textContent = `Kamata: ${rezultat.toFixed(2)}%.`;
            break;

        case "4":

            rezultat = Math.log(konacno / glavnica) / Math.log(1 + kamata / 100);
            document.getElementById("rezultatStednje").textContent = `Broj godina: ${rezultat.toFixed(2)}.`;
            break;

    }
});

document.getElementById("izracunajKredit").addEventListener("click", () => {

    const opcija = document.getElementById("kreditOpcija").value;
    const iznos = parseFloat(document.getElementById("iznosKredita").value);
    const rata = parseFloat(document.getElementById("mesecnaRata").value);
    const kamata = parseFloat(document.getElementById("godisnjaKamata").value);
    const godine = parseFloat(document.getElementById("brojGodina").value);
    let rezultat = "";

    switch (opcija) {

        case "1":

            rezultat = (rata * godine * 12) / (1 + (kamata / 100 * godine));
            document.getElementById("rezultatKredita").textContent = `Iznos kredita: ${rezultat.toFixed(2)} RSD.`;
            break;

        case "2":

            rezultat = (iznos * (1 + (kamata / 100 * godine))) / (godine * 12);
            document.getElementById("rezultatKredita").textContent = `Mesečna rata: ${rezultat.toFixed(2)} RSD.`;
            break;

        case "3":

            rezultat = ((rata * godine * 12) / iznos - 1) * (100 / godine);
            document.getElementById("rezultatKredita").textContent = `Godišnja kamata: ${rezultat.toFixed(2)}%.`;
            break;

        case "4":

            rezultat = ((rata * godine * 12) / iznos - 1) * (100 / (godine * 12));
            document.getElementById("rezultatKredita").textContent = `Mesečna kamata: ${rezultat.toFixed(2)}%.`;
            break;

        case "5":

            rezultat = ((iznos * (1 + (kamata / 100))) / rata) / 12;
            document.getElementById("rezultatKredita").textContent = `Broj godina: ${rezultat.toFixed(2)}.`;
            break;

    }
});

document.getElementById("prikaziTransakcije").addEventListener("click", () => {

    if (!racun) return alert("Prvo kreirajte račun!");
    const lista = document.getElementById("listaTransakcija");
    lista.innerHTML = "";

    racun.prikaziTransakcije().forEach(t => {

        const li = document.createElement("li");
        li.textContent = t;
        lista.appendChild(li);

    });
});

document.getElementById("zakljucaj").addEventListener("click", () => {

    if (!racun) return alert("Prvo kreirajte račun!");
    document.getElementById("statusRacuna").textContent = racun.zakljucajRacun();

});

document.getElementById("otkljucaj").addEventListener("click", () => {

    if (!racun) return alert("Prvo kreirajte račun!");
    const pinUnos = document.getElementById("otkljucajPin").value.trim();

    document.getElementById("statusRacuna").textContent = racun.otkljucajRacun(pinUnos);

});
