let uluru, map, marker
let ws
let players = {}
let nick = 'Player1'
let msg;
let guid = parseInt(Date.now() + Math.random() * 1000) // unikatowy identyfikator


function CloseAndPlay(){
    let start = document.querySelector(".Start")
    start.style.display = "none"

    document.querySelector(".StartAvatar").style.display = "flex"
    
}

function hideInitStartForm(){ // funkcja obsługi przycisku input submit 
    
    let startForm = document.querySelector(".StartAvatar") // odwolanie do diva class Start
    startForm.style.display = "none" // zmien display na niewidoczny

    var Go = true // przypisz zmiennej Go wartość true
    initMap(Go) // zainicjuj mapę z wartością Go
}

function initMap(Go) { // funkcja inicjalizująca mape 
    
    if(Go == true){ // jesli Go na wartośc true wyswietl mapę
        uluru = { lat: -25.363, lng: 131.044 }; // pozycja 
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: uluru,
            keyboardShortcuts: false
        });

        marker = new google.maps.Marker({ 
            position: uluru,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: avatarIcon()
        });
        getLocalization() // wywołanie funkcji getLocalization
        startWebSocket() // logowanie do websocket
        watchKeys()
        document.querySelector(".location").style.display = "flex" 
    }
}

function watchKeys() {
    window.addEventListener('keydown', moveMarker) // odczytaj ruch klawiatury przez marker
}

function moveMarker(ev) { //porusz marker
    let coords = { // wyspolrzedne markera
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    }

    switch (ev.code) {
        case 'ArrowUp': // ruch w górę
            coords.lat += 0.02
            break;
        case 'ArrowDown': // w dół
            coords.lat -= 0.02
            break;
        case 'ArrowLeft': // w lewo
            coords.lng -= 0.02
            break;
        case 'ArrowRight': // w prawo
            coords.lng += 0.02
            break;
        default:
            break;
    }
    placeMyMarker(coords, 'move')
}

function placeMyMarker(_coords, _action)
{
    marker.setPosition(_coords) // pozycja markera
    map.setCenter(_coords) // pozycja markera

    let me = {
        id: guid,
        action: _action,
        coords: _coords,
        playericon: avatarIcon()
    }

}
function startWebSocket() {
    let url = 'ws://77.55.222.58:443'
    ws = new WebSocket(url)
    ws.addEventListener('open', onWSOpen)
    ws.addEventListener('message', onWSMessage)
}

function onWSOpen(data) {
    console.log(data)
}

function sendMessage(){ // funkcja wysyłająca wiadomosci
    let text = document.getElementById('text')
    let nickname = document.getElementById('nick').value.bold()
    textToSend=nickname + ": "+ text.value;
    msg = { typ: 'msg', tekst: textToSend }
    ws.send(JSON.stringify(msg))
    text.value=""
}

function search() { // funkcja pozwalająca wysłąć wiadomośc po wcisnięciu klawisza enter
    if(event.key == 'Enter') {
        sendMessage();      
    }
}

function onWSMessage(e) {
    let log = document.getElementById('log');

    msg=(JSON.parse(e.data));
    if(msg.typ=='msg'){
        log.innerHTML+=(msg.tekst)+"<br/>";
    }

    else{
        let data = JSON.parse(e.data)

        if (!players['user' + data.id]) {
            players['user' + data.id] = new google.maps.Marker({
                position: { lat: data.lat, lng: data.lng },
                map: map,
                animation: google.maps.Animation.DROP
            })
        } else {
            players['user' + data.id].setPosition({
                lat: data.lat,
                lng: data.lng
            })
        }
    }
        
    

    
}


function getLocalization() { // wez lokalizację
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)

}

function geoOk(data) { // jesli lokalizacja zezwolona wykonaj ponizszy kod 
    document.querySelector(".location").style.display = "none" // display zmieniony na none
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    placeMyMarker(coords, 'new')
}

function geoFail(data) { // lozalizacja zablokowana odpalenie komunikatu
    document.querySelector(".location").style.display = "flex" // display = "flex"
    document.querySelector(".text_location_fail").style.display = "flex" // tekst informujacy o problemie
}



function avatarIcon(){ // odpowiednia sciezka do ikony avatara

let number // numer obrazka

    if(document.getElementById('0').checked == true){
        number = 0 // nr 0
        return `icon/${number}.png` // wskaż sciezkę do avatara 0
    }else if(document.getElementById('1').checked == true){
        number = 1 // nr 1
        return `icon/${number}.png` // wskaż sciezkę do avatara 1
    }else if(document.getElementById('2').checked == true){
        number = 2 // nr 2
        return `icon/${number}.png` // wskaż sciezkę do avatara 2
    }else if(document.getElementById('3').checked == true){
        number = 3 // nr 3
        return `icon/${number}.png` // wskaż sciezkę do avatara 3
    }else if(document.getElementById('4').checked == true){
        number = 4 // nr 4
        return `icon/${number}.png` // wskaż sciezkę do avatara 4
    }else if(document.getElementById('5').checked == true){
        number = 5 // nr 5
        return `icon/${number}.png` // wskaż sciezkę do avatara 5
    }
}