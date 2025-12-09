//Muuttujat HTML-sivun alueille
const kysymysalue = document.getElementById("kysymysalue");
const vastausalue = document.getElementById("vastausalue");

//Taustamusiikin alueet
const bg_music = document.getElementById("bg_music");
const sound_start = document.getElementById("sound_start");
const sound_correct = document.getElementById("sound_correct");
const sound_wrong = document.getElementById("sound_wrong");
const volumeSlider = document.getElementById("volume_slider");
volumeSlider.addEventListener("input", updateVolume);

//Musiikkiefekti-funktio
function playSFX(sfx) {
    //Pausettaa soivan taustamusiikin
    bg_music.pause();
    //Kelaa musiikkiefektin alkuun
    sfx.currentTime = 0;
    //Soittaa efektin
    sfx.play();

    //Kun musiikkiefekti on soinut, käynnistetään taustamusiikki taas
    sfx.onended = () => {
        if (game.gameStarted){
            bg_music.play();
        }
    };
}

//Äänenvoimakkuus
function updateVolume() {
    const v = volumeSlider.value;
    bg_music.volume = v;
    sound_start.volume = v;
    sound_correct.volume = v;
    sound_wrong.volume = v;
}

//Pelimuuttuja
const game = {
    //Alustetaan muuttujia peliin
    //Tähän haetaan kysymys-data
    kysymys: [],
    //Tällä arvolla haetaan vaikeampia kysymyksiä
    kierros: 0,
    //Tällä arvolla pidetään kirjaa pelaajan edistymisestä
    score: 1,

    //Pelaajan oljenkorsien määrä
    olki1: 1,
    olki2: 1,
    olki3: 1,

    //Init -funktio käynnistää pelin
    async init(name) {
        //Tarkistetaan onko peli käynnissä, ja käynnistetään taustamusiikki
        if (!this.gameStarted) {
            this.gameStarted = true;
            bg_music.currentTime = 0;
            bg_music.play();
            playSFX(sound_start);
        }

        //Haetaan kysymys
        this.kysymys = await kysymyshaku(this.kierros);
        //Tallennetaan pelaajan nimi
        this.player_name = name;
        //Printataan pelaajan nimi
        this.printUsername();
        //Printataan Exit-nappi, mutta vain jos kierros on 0
        if (this.kierros < 1) {
            this.exit();
        }
        //Printataan kysymys
        this.kysymysfunktio();
        //Printataan kysymysnumero
        this.printScore();

    },
    //Pelaajan nimen printtaus
    printUsername() {
        const username_div = document.createElement("div");
        const header_area = document.querySelector("header");
        username_div.id = "username"
        header_area.appendChild(username_div)
        username_div.innerHTML = "Username:<br>"  + this.player_name;
    },
    //Kysymysnumeron printtaus
    printScore(){
        const kysymysnro_div = document.createElement("div");
        const header_area = document.querySelector("header");
        kysymysnro_div.id = "kysymysnro";
        header_area.appendChild(kysymysnro_div);
        if (this.score < 6) {
            kysymysnro_div.innerHTML = `Question: <b style="color:lime">${this.score}</b>`;
        }
        else if (this.score < 11) {
            kysymysnro_div.innerHTML = `Question: <b style="color:yellow">${this.score}</b>`;
        }
        else if (this.score < 16) {
            kysymysnro_div.innerHTML = `Question: <b style="color:red">${this.score}</b>`;
        }

    },
    //Exit -napin printtaus
    exit(){
        const exit_button = document.createElement("button");
        exit_button.textContent = 'EXIT';
        exit_button.id = "exit";
        exit_button.addEventListener("click", () => {refresh();});
        document.getElementById("exit").appendChild(exit_button);
    },

    //Lopputuloksen lasku
    money(kierros) {
        if (kierros === 1) {
            return 100
        }
        else if (kierros === 2 ) {
            return 200
        }
        else if (kierros === 3 ) {
            return 300
        }
        else if (kierros === 4 ) {
            return 500
        }
        else if (kierros === 5 ) {
            return 1000
        }
        else if (kierros === 6 ) {
            return 2000
        }
        else if (kierros === 7 ) {
            return 4000
        }
        else if (kierros === 8 ) {
            return 8000
        }
        else if (kierros === 9 ) {
            return 16000
        }
        else if (kierros === 10 ) {
            return 32000
        }
        else if (kierros === 11 ) {
            return 64000
        }
        else if (kierros === 12 ) {
            return 125000
        }
        else if (kierros === 13 ) {
            return 250000
        }
        else if (kierros === 14 ) {
            return 500000
        }
        else if (kierros === 15 ) {
            return 1000000
        }
        else {
            return 0
        }
    },

    //Vastaanottaa kysymyslistan ja printtaa sen oikeassa formaatissa
    kysymysfunktio() {
        //Tarkastetaan kysymyksen muoto ja printataan se
        if (this.kysymys["kysymysteksti"][0] === "What is the distance between " || this.kysymys["kysymysteksti"][0] === "How many kilotons of CO2 emmission are produced on a flight between ") {
            kysymysalue.innerHTML = '';
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][0];
            kysymysalue.innerHTML += this.kysymys["kysymys"][0][0] +" and "+this.kysymys["kysymys"][1][0];
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][1]
        }
        else {
            kysymysalue.innerHTML = '';
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][0];
            kysymysalue.innerHTML += this.kysymys["kysymys"][0];
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][1]
        }

    //Tyhjennetään vastausalue
    vastausalue.innerHTML = "";

    //Luodaan jokaiselle vastaukselle painike
    for (let i = 1; i < 5; i++) {
        const button = document.createElement("button");
        button.textContent = this.kysymys[`vastaus${i}`][1];
        button.value = this.kysymys[`vastaus${i}`][0];
        button.id = "vastausnappi";
        console.log(this.kysymys[`vastaus${i}`][2]);

        //Event listener painikkeille vastauksen valitsemiseen
        button.addEventListener("click", () => {
            this.handleAnswer(this.kysymys[`vastaus${i}`][2]);
        });

        //Printataan painike
        vastausalue.appendChild(button);
    }

    //Ajetaan oljenkorsi-funktio
    this.oljenkorsifunktio()

    },

    //Määritetään oljenkorsi-funktio
    oljenkorsifunktio() {
        //Tarkistetaan onko oljenkorsia jäljellä
        if (this.olki1 === 1 || this.olki2 === 1 || this.olki3 === 1) {
            //Jos oljenkorsia on jäljellä...
            //Luodaan alue oljenkorsille
            const lifelineArea = document.createElement("div")
            lifelineArea.id = "oljenkorsialue";
            const linebreak = document.createElement("br");
            vastausalue.appendChild(linebreak);
            vastausalue.appendChild(lifelineArea)

            //Luodaan painike Oljenkorsi-menulle
            const lifelineButton = document.createElement("button");
            lifelineButton.textContent = "Lifelines";
            lifelineButton.id = "oljenkorsinappi";

            //Painike oljenkorsien esittämiseen
            lifelineButton.addEventListener("click", () => {
                //Poistetaan painike ja näytetään jäljellä olevat oljenkorret
                lifelineArea.removeChild(lifelineButton);

                //Kysy yleisöltä -oljenkorsi
                if (this.olki1 === 1) {
                    //Luodaan painike
                    const askAudienceButton = document.createElement("button");
                    askAudienceButton.textContent = "Ask the Audience"
                    askAudienceButton.id = "oljenkorsinappi"
                    askAudienceButton.value = "olki1"

                    //Jos painiketta painaa
                    askAudienceButton.addEventListener("click", () => {
                        //Tämä oljenkorsi käytetty
                        this.olki1 = 0;

                        //ASK AUDIENCE -KOODI
                        //Arvotaan joka vastaukselle random yleisöäänet
                        let yleiso = {
                            A: Math.floor(Math.random() * 60) + 1,
                            B: Math.floor(Math.random() * 60) + 1,
                            C: Math.floor(Math.random() * 60) + 1,
                            D: Math.floor(Math.random() * 60) + 1
                        }

                        //Tarkistetaan oikea, ja annetaan sille mahdollisuus saada enemmän ääniä
                        for (let i = 1; i < 5; i++) {
                            if (this.kysymys[`vastaus${i}`][2] === 1) {
                                if (this.kysymys[`vastaus${i}`][0] === "A") {
                                    yleiso.A = Math.floor(Math.random() * 90) + 1;
                                }
                                else if (this.kysymys[`vastaus${i}`][0] === "B") {
                                    yleiso.B = Math.floor(Math.random() * 90) + 1;
                                }
                                else if (this.kysymys[`vastaus${i}`][0] === "C") {
                                    yleiso.C = Math.floor(Math.random() * 90) + 1;
                                }
                                else if (this.kysymys[`vastaus${i}`][0] === "D") {
                                    yleiso.D = Math.floor(Math.random() * 90) + 1;
                                }
                            }
                        }

                        //Tarkistetaan onko Vihje-elementti jo olemassa
                        //Jos on, muokataan sitä
                        if (document.getElementById("vihjealue") != null) {
                          document.getElementById("vihjealue").innerHTML = `The audience has voted:<br><ul><li>A: ${yleiso.A} votes</li><li>B: ${yleiso.B} votes</li><li>C: ${yleiso.C} votes</li><li>A: ${yleiso.D} votes</li></ul>`
                        }
                        //Jos ei, luodaan se
                        else {
                            //Printataan oljenkorren lopputulos vihjealueelle
                            const hintArea = document.createElement("div")
                            hintArea.id = "vihjealue"
                            hintArea.innerHTML = `The audience has voted:<br><ul><li>A: ${yleiso.A} votes</li><li>B: ${yleiso.B} votes</li><li>C: ${yleiso.C} votes</li><li>D: ${yleiso.D} votes</li></ul>`
                            kysymysalue.appendChild(hintArea)
                        }

                        //Poistetaan yksittäiset oljenkorsi-painikkeet
                        lifelineArea.innerHTML = "";

                        //Tarkistetaan onko oljenkorsia jäljellä, ja printataan Oljenkorsi-menu
                        if (this.olki1 === 1 || this.olki2 === 1 || this.olki3 === 1) {
                            lifelineArea.appendChild(lifelineButton)
                        }


                    });
                    //Lisätään "Kysy yleisöltä" -painike sivulle
                    lifelineArea.appendChild(askAudienceButton)
                }

                //Fifty-fifty -oljenkorsi
                if (this.olki2 === 1) {
                    const fiftyFiftyButton = document.createElement("button");

                    fiftyFiftyButton.textContent = "50/50"
                    fiftyFiftyButton.id = "oljenkorsinappi"
                    fiftyFiftyButton.value = "olki2"

                    fiftyFiftyButton.addEventListener("click", () => {
                        //Oljenkorsi käytetty
                        this.olki2 = 0;

                        lifelineArea.innerHTML = "";

                        //FIFTY FIFTY KOODI
                        //Luodaan lista johon syötetään väärät vastaukset
                        let piilotettavat = []

                        //Käydään läpi kaikki vastaukset
                        for (let i = 1; i < 5; i++) {
                            //Jos vastaus on väärin
                            if (this.kysymys[`vastaus${i}`][2] === 0) {
                                //Lisätään se väärien vastausten listaan
                                let selected = document.querySelector(`button[value=${this.kysymys[`vastaus${i}`][0]}]`)
                                piilotettavat.push(selected)
                            }
                        }
                        //Valitaan vääristä vastauksista 2 satunnaista ja piilotetaan ne antamalla niille luokka-arvo "hidden"
                        piilotettavat.slice(0, 2).forEach(i => i.classList.add('hidden'));

                        //Tarkistetaan onko elementti jo olemassa
                        //Jos on, muokataan sitä
                        if (document.getElementById("vihjealue") != null) {
                            //Poistetaan aiemman oljenkorren tiedot
                          document.getElementById("vihjealue").textContent = ""
                        }
                        //Jos ei, luodaan se
                        else {
                            const hintArea = document.createElement("div")
                            hintArea.id = "vihjealue"
                            //Poistetaan aiemman oljenkorren tiedot
                            hintArea.textContent = ""
                            kysymysalue.appendChild(hintArea)
                        }

                        //Tarkastetaan taas onko oljenkorsia jäljellä
                        if (this.olki1 === 1 || this.olki2 === 1 || this.olki3 === 1) {
                            lifelineArea.appendChild(lifelineButton)
                        }
                    });

                    //Printataan "Fifty-fifty" -oljenkorsi painike sivulle
                    lifelineArea.appendChild(fiftyFiftyButton)
                }

                //Kysy kaverilta -oljenkorsi
                if (this.olki3 === 1) {
                    const callFriendButton = document.createElement("button");

                    callFriendButton.textContent = "Call a Friend"
                    callFriendButton.id = "oljenkorsinappi"
                    callFriendButton.value = "olki3"

                    callFriendButton.addEventListener("click", () => {
                        //Oljenkorsi käytetty
                        this.olki3 = 0;

                        //CALL FRIEND KOODI
                        //Muuttuja kaverin vastaukselle
                        let kaveri = "";
                        //Arvotaan meneekö kaverin vastaus väärin
                        let errormargin = Math.floor(Math.random() * 100) + 1

                        //Kaverilla on 60% mahdollisuus vastata oikein
                        if (errormargin <= 60) {
                            for (let i = 1; i < 5; i++) {
                                if (this.kysymys[`vastaus${i}`][2] === 1) {
                                    kaveri = this.kysymys[`vastaus${i}`][1]
                                }
                            }
                        }
                        //Ja 40% mahdollisuus vastata väärin
                        else {
                            for (let i = 1; i < 5; i++) {
                                if (this.kysymys[`vastaus${i}`][2] === 0) {
                                    kaveri = this.kysymys[`vastaus${i}`][1]
                                }
                            }
                        }

                        //Tarkistetaan onko elementti jo olemassa
                        //Jos on, muokataan sitä
                        if (document.getElementById("vihjealue") != null) {
                          document.getElementById("vihjealue").textContent = `I think the answer is ${kaveri}`
                        }
                        //Jos ei, luodaan se
                        else {
                            const hintArea = document.createElement("div")
                            hintArea.id = "vihjealue"
                            hintArea.textContent = `I think the answer is ${kaveri}`
                            kysymysalue.appendChild(hintArea)
                        }

                        lifelineArea.innerHTML = "";

                        if (this.olki1 === 1 || this.olki2 === 1 || this.olki3 === 1) {
                            lifelineArea.appendChild(lifelineButton)
                        }
                    });

                    //Printataan "Soita kaverille" -oljenkorsi painike sivulle
                    lifelineArea.appendChild(callFriendButton)
                }
            });

            //Printataan oljenkorsinappi
            lifelineArea.appendChild(lifelineButton);


        }
    },

    //Vastauksen tarkistus
    handleAnswer(selectedIndex) {
        //Jos valitun vastauksen arvo oli 1, se on oikein
        if (selectedIndex === 1) {
            playSFX(sound_correct);
            //Lisätään score ja kierros
            this.score++;
            this.kierros++;

            //Uusi kierros, jos kierrokset ovat täynnä, lopetetaan peli
            if (this.kierros < 15) {
                this.questionright()
            } else {
                this.winner();
            }
        }
        //Jos valitun vastauksen arvo oli 0, lopetetaan peli
        else {
            playSFX(sound_wrong);
            this.gameover();
        }
    },

    //Kun kysymys menee oikein, printataan onnittelusivu
    questionright() {
        const right_image = document.createElement('img');
        right_image.src= 'gif/private_plane_right_gif.gif';
        right_image.id="right_image";

        kysymysalue.innerHTML = "";
        kysymysalue.innerHTML += `<p class="reaction_text">Correct answer!</p>`
        kysymysalue.appendChild(right_image);
        vastausalue.innerHTML = "";
        vastausalue.innerHTML += `<br><button class='continue_button' onclick='game.init("${this.player_name}")'>Next</button>`
    },

    //Printataan lopputulos
    gameover() {
        bg_music.pause();
        bg_music.currentTime = 0;
         const game_over_image = document.createElement('img');
        game_over_image.src= 'gif/private_plane_game_over_gif.gif';
        game_over_image.id="game_over_image";

        let winnings = this.money(this.kierros)
        kysymysalue.innerHTML = "";
        kysymysalue.innerHTML += `<p class="reaction_text">GAME OVER! ${this.player_name}'s earnings for this game: ${winnings}€</p>`
        kysymysalue.appendChild(game_over_image);
        vastausalue.innerHTML = "";
        vastausalue.innerHTML += "<br><button class='continue_button' onclick='refresh()'>Try again?</button> "

    },

    winner() {
        bg_music.pause();
        bg_music.currentTime = 0;
        const right_image = document.createElement('img');
        right_image.src= 'gif/private_plane_right_gif.gif';
        right_image.id="right_image";

        let winnings = this.money(this.kierros)
        kysymysalue.innerHTML = "";
        kysymysalue.innerHTML += `<p class="reaction_text">YOU WIN! ${this.player_name}'s earnings for this game: ${winnings}€</p>`
        kysymysalue.appendChild(right_image);
        vastausalue.innerHTML = "";
        vastausalue.innerHTML += "<br><button class='continue_button' onclick='refresh()'>Try again?</button> "
    }
};

//API -haku
async function kysymyshaku(kierros) {
    const response = await fetch(`http://127.0.0.1:5000/${kierros}`);
    return response.json();
}

//Printataan nimikenttä ja aloitusnappi
vastausalue.innerHTML = "<form id='start_game'><input id='namebox' name='namebox' placeholder='Enter name...' type='text'><input type='submit' value='Start game'></form>";
const start_game = document.querySelector('#start_game');

//Lisätään aloitusnappiin async event listener
start_game.addEventListener('submit', async function(evt){
    evt.preventDefault();
    let player_name = document.querySelector('input[name=namebox]').value;
    if (player_name.length > 24) {
        player_name = "Liian pitkä nimi"
    }
    game.init(player_name);
});

//Kun haluaa aloittaa pelin uudelleen
function refresh(){
        window.location.reload("Refresh")
}
