if (!window.Worker) {
    alert("Il tuo browser non supporta LogSpin, prova con un altro browser!");
    console.log("Browser non supporta Web Workers");
    location.reload();
}
if ("Notification" in window) {
    // Richiedi il permesso dell'utente per inviare notifiche.
    Notification.requestPermission().then(function (result) {
      if (!(result === "granted")) {
        // Crea una notifica.
        alert("Permetti l'invio di notifiche per il corretto funzionamento di LogSpin")
      }
    });
  }
class utente {
    constructor(username, pin) {
        this.username = username;
        this.pin = pin;
    };
}

class sito {

     constructor(url, email, psw, timer_onscreen, timer_inmill, r, g, b){
        this.url = url;
        this.email = email;
        this.psw = psw;
        this.timer_onscreen = timer_onscreen;
        this.timer_inmill = timer_inmill;
        this.r = r;
        this.g = g;
        this.b = b;
        console.log("costruttore: "+this.url+" "+this.timer_inmill);
        
    };

    reminder(){
        alert("Sito "+this.url+" aggiunto!\nOgni "+this.timer_onscreen+" comparirà un reminder di login!")
        /* -- creo worker che lavorerà in background ed ogni intervallo di 
        tempo scelto dall'utente ricorderà di eseguire l'accesso e farà il redirect al sito in questione --  */
        var wrk = new Worker(
            `data:text/javascript,
            onmessage = function(e) {
                let utente = e.data;
                
                if(utente.timer_inmill!=''){
                setInterval(function() {
                    postMessage(utente);
                }, utente.timer_inmill);
            }
            }
           
            `);
            
            wrk.postMessage(this);
            wrk.onmessage = function(e) {
                let utente = e.data;
                console.log("timer: "+ utente.timer_inmill);
                if(utente.timer_inmill != ''){
                console.log("timer nell'if: "+ utente.timer_inmill);

                 // Crea una notifica.
                var notification = new Notification("Ricordati di effettuare l'accesso a "+utente.url+"!", {
                    body: "Email: "+utente.email+"\nSe non ti ricordi la password vai all'hub dei siti"
                });
                // Funzione di gestione del clic sulla notifica.
                notification.onclick = function (event) {
                // Fai qualcosa quando l'utente clicca sulla notifica.
                 window.open("https://"+utente.url,"_blank");
                };
               
                } 
            }
            
        
        }
        remove_worker(){
            wrk.terminate();
        }
}

/*variabili nel local storage*/
let sitiSalvati = [];
let utenteSalvato;
/* -- */


var siti = []; //array con siti aggiunti
let ut1 = new utente("",""); //utente aggiunto

utenteSalvato = JSON.parse(localStorage.getItem("ut1"));

if(utenteSalvato != null){
    /* controllo esistenza utente e controllo pin di accesso */
   ut1 = utenteSalvato;
   let pin;
   console.log("utente gia esitente nel local storage");
   let bound = 0;
  do{
        console.log("controllo pin");
        pin = prompt("Inserisci pin","00000");
        if(pin != ut1.pin) alert("Pin errato!");
        bound++;
        if(bound==10) alert("Hai sbagliato il pin 10 volte, se sbaglierai altre 5 volte l'applicazione verrà resettata!");
        if(bound==15) clear_localStorage();
  }while(pin != ut1.pin);
} else {
    /* Setting del pin per primo accesso */
    console.log("Creazione nuovo utente con pin");
    let nome = prompt("Benvenuto! Inserisci il nome utente: ", "utente");
    let pin;
    do{
        pin = prompt("Ora crea un pin di 5 cifre", "00000");
    }while(pin.length!=5);
    ut1 = new utente(nome, pin);
    localStorage.setItem("ut1", JSON.stringify(ut1));
}
sitiSalvati = JSON.parse(localStorage.getItem("siti"));
if(sitiSalvati != null){
    siti = sitiSalvati;
}

localStorage.setItem("siti", JSON.stringify(siti));



function scrivi_sito(s){

    let sezione = document.getElementById("hub-sites");
    let newSite = document.createElement('span');
    newSite.setAttribute('class','col-lg-4');
    
   /* -- div -- */
    let divNewSite = document.createElement('div');
        divNewSite.setAttribute('class', 'row');
        divNewSite.setAttribute('style', 'padding: 5px; background-color: rgb('+s.r+', '+s.g+', '+s.b+'); border-radius: 5px;');
        newSite.appendChild(divNewSite);
    /*-- title new sitw url --*/
    let titleNewSite = document.createElement('button');
        titleNewSite.setAttribute('class', 'btn btn-hub');
        titleNewSite.setAttribute('onclick', 'window.open("https://'+s.url+'","_blank");');
        titleNewSite.innerHTML=""+s.url;
    
        divNewSite.appendChild(titleNewSite);
    /* -- label email --  */
    let emailNewSite = document.createElement('label');
        emailNewSite.setAttribute('class', 'col-lg-12');
        emailNewSite.innerHTML="<b>Email</b>: "+s.email;
        divNewSite.appendChild(emailNewSite);
    /* -- label password -- */
    let viewPsw = document.createElement('button');
        viewPsw.setAttribute('class', 'col-lg-2 btn-box btn');
        viewPsw.innerHTML = "<img src='img/occhio-chiuso.png' width='24px' height='24px' >";
        divNewSite.appendChild(viewPsw);
        
    let pswNewSite = document.createElement('label');
        pswNewSite.setAttribute('class', 'col-lg-10');
        let psw_osc=""; //password oscurata
        for(let a of s.psw){
            psw_osc+="•";
        }
        pswNewSite.innerHTML="<b>Password</b>: "+psw_osc;
        divNewSite.appendChild(pswNewSite);
        divNewSite.appendChild(viewPsw);
    /* -- label timer -- */
    let timerNewSite = document.createElement('label');
        timerNewSite.setAttribute('class', 'col-lg-10');
        timerNewSite.innerHTML="<b>Intervallo</b>: "+s.timer_onscreen;
        divNewSite.appendChild(timerNewSite);
    /* -- delete button -- */    
    let deleteMode = document.createElement('button');
        deleteMode.setAttribute('class', 'col-lg-2 btn-box btn');
        deleteMode.innerHTML = "<img src='img/cestino.png' width='24px' height='24px'>";
        divNewSite.appendChild(deleteMode);
        sezione.appendChild(newSite);
    
    

    let flag = 0;
    viewPsw.addEventListener('click', function(){
        if(flag==0){
            
            if(prompt("Inserisci pin per visualizzare la password","0000") == ut1.pin){
            pswNewSite.innerHTML = "<b>Password</b>: "+s.psw;
            flag=1;
            viewPsw.innerHTML = "<img src='img/occhio-aperto.png' width='24px' height='24px' >";
            } else {
                alert("Pin errato");
                return;
            }      
        } else {
            viewPsw.innerHTML = "<img src='img/occhio-chiuso.png' width='24px' height='24px' >";
            pswNewSite.innerHTML = "<b>Password</b>: "+psw_osc;
            flag=0;
        }
    
    })
    /* -- funzione che elmina un sito dall'hub --*/
    deleteMode.addEventListener('click', function () {
        console.log('delete mode');
        if(!confirm("Sei sicuro di voler cancellare "+s.url+"?")){
            return;
        } 
        let pin_prov;
        let bound = 0;
        do{
        pin_prov = prompt("Inserisci il pin prima di eliminare un sito", "0000");
        if(pin_prov != ut1.pin) alert("Pin errato");
        bound++;
        if(bound == 10) { alert("Hai inserito 10 volte il pin errato, reimpostalo se lo hai dimenticato!"); return;}
        }while(pin_prov!=ut1.pin);
        let index;
        for(let i = 0; i<siti.length; i++){
            if(siti[i]==s){
                index = i;
            }
        }
        siti.splice(index, 1);
        alert("Il sito è stato rimosso, la webapp verrà riavviata.\nDovrai reinserire il pin!");
        localStorage.setItem("siti", JSON.stringify(siti));
        location.reload();
          
      
    });
    
}



function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
  }



function aggiungi_sito(){
    /* controllo input */
    if(document.getElementById("url").value == '' || document.getElementById("email").value == '' || document.getElementById("psw").value == '' ) {
        alert("Uno dei campi e' vuoto!\nRiempilo prima di continuare.");
        console.log("errore campi");
        return;
    } 

    

    let url = document.getElementById("url").value;
    let email = document.getElementById("email").value;
    let psw = document.getElementById("psw").value;

    /* controllo formato input*/
    
    if(!url.includes(".it") && !url.includes(".com") && !url.includes(".org") && !url.includes(".eu") && !url.includes(".edu") && !url.includes(".gov")){
        alert("Url non corretta! Rincontrolla.");
        return;
    }
    if(!email.includes("@")){
        alert('Email non corretta');
        return;
    }
    if(!email.includes(".")){
        alert('Email non corretta');
        return;
    }

    //if(!email)
    /* -- */
    let timer_inmill = document.getElementById("timer").value;
    let timer_onscreen = "";
        switch(timer_inmill) {
        case '': 
            timer_onscreen = "Mai";
            break;
        case '30000':
            timer_onscreen="30sec";
            break;
        case '1800000': 
            timer_onscreen = "30min";
            break;
        case '3600000': 
            timer_onscreen = "1h";
            break;
        case '10800000': 
            timer_onscreen = "3h";
            break;
        case '21600000': 
            timer_onscreen = "6h";
            break;
        case '43200000': 
            timer_onscreen = "12h";
            break;
        case '86400000': 
            timer_onscreen = "24h";
            break;
    }
     

    /* -- generazione colore casuale per box sito -- */
    let r=getRandomInt(1,255);
    let g=getRandomInt(1,255);
    let b=getRandomInt(1,255);

    s1 = new sito(url, email, psw, timer_onscreen, timer_inmill, r, g, b);
    scrivi_sito(s1);
    
    siti.push(s1);
    console.log("inserisco sito "+s1.url);
    console.log("array siti aggiornato e salvato nel local storage");
    localStorage.setItem("siti", JSON.stringify(siti));
    document.getElementById("url").value = '';
    document.getElementById("email").value = '';
    document.getElementById("psw").value = '';
    document.getElementById("timer").value = '';
    siti[siti.length-1].reminder();
}

function cancella_siti(){

    //svuoto l'array dei siti
    console.log("cancello tutti i siti");
    siti = [];
    localStorage.setItem("siti", JSON.stringify(siti));
}

function clear_localStorage(){

    /* cancello il local storage, tutti i dati */
    console.log("cancellazione dell'intero local storage");
    localStorage.clear();
    siti = [];
    localStorage.setItem("siti", JSON.stringify(siti));
    location.reload();

}

function stampa_siti(){
    let sito_app;
    for(let a of siti){
        scrivi_sito(a);
        console.log(a.url+" "+a.timer_inmill);
        sito_app = new sito(a.url, a.email, a.psw, a.timer_onscreen, a.timer_inmill, a.r, a.g, a.b);
        sito_app.reminder();
    }
    
}

function attiva_timer(){
    let sito_app = new sito("", "", "", "", "", 0, 0, 0);
    for(let a of siti){
        sito_app = a;
        sito_app.reminder();
    }
}


function aggiungi_sito_da_head(url_h){
    location.href = "#form-agg-sito";
    let url_field = document.getElementById("url");
    url.value = url_h;
}

