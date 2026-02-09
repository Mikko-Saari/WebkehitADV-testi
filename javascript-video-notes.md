## Beginning the Beginner's Series [1 of 51]

Ensimmäisessä videossa kerrottiin, mitä tullaan opettamaan ja miten siitä on hyötyä. Lisäksi näytettiin, ketkä ovat olleet tekemässä tätä sarjaa.  
Mielenkiintoista videossa oli kaikki eri ihmiset, jotka ovat olleet toteuttamassa sitä.

---

## What is JavaScript [2 of 51]

Videon pointti on selittää, mikä JavaScript on. Opin, että JS on tehty sitä varten, että voidaan olla vuorovaikutuksessa nettisivujen elementtien kanssa.  
JavaScriptissä ei tarvitse erikseen määritellä muuttujan tyyppiä.

---

## Running JavaScript: Browser or Server [3 of 51]

Videon pointti on selittää eroavaisuuksia serverille ja clientille kirjoitettavan JavaScriptin välillä.  
Jos haluaa kokeilla koodiaan serverillä, tarvitsee Node.js:n.

---

## Building Your Toolbox [4 of 51]

Videon pointti on kertoa, mitä tarvitaan, jotta voi alkaa kirjoittamaan JavaScriptiä.  
Node.js näyttää olevan tarpeellinen, vaikka koodaisi vain nettisivuja eikä pelkästään servereitä.

---

## Creating Your First Application [6 of 51]

Videossa kerrotaan, miten tehdään ensimmäinen JavaScript-projekti nollasta.  
Console.log toimii samalla tavalla kuin C#:ssa `Console.WriteLine`, ja teksti täytyy kirjoittaa `" "`-merkkien väliin.

---

## Comments [7 of 51]

Videon pointti on opettaa, miten JavaScriptissä kommentoidaan koodia.  
Mielenkiintoista oli, että `//` kommentoi yhden rivin ja `/* */` kommentoi useamman rivin kerralla.

---

## Demo: Comments [8 of 51]

Videolla käydään konkreettisesti läpi edellisen videon teoriaa.  
Mielenkiintoista oli `// TODO` -kommentti, jolla voi muistuttaa itseään keskeneräisistä asioista.

---

## Declaring Variables [9 of 51]

Videolla opetetaan, miten muuttujia käytetään JavaScriptissä.  
Muuttujatyyppejä on kolme, ja `const` sekä `let` ovat samankaltaisia, mutta `const`-muuttujan arvoa ei voi muuttaa myöhemmin.

---

## Demo: Declaring Variables [10 of 51]

Videolla käydään läpi edellisessä videossa opetettuja asioita käytännössä.  
Mielenkiintoista on se, että `var`-muuttujaa kannattaa välttää, koska se voi aiheuttaa helposti virheitä.

---

## Working with strings [11 of 51]


Videolla selitetään miten JS käytetään stringejä. Videolla myös mitä on string concatenation eli kahden tai useamman stringin yhdistämistä.

---

## Demo: Working with strings [12 of 51]

Demotaan vaan aikaisemman videon asiaa mutta rehellisesti aivan sama video kuin aikaisempi mutta dia showin sijasta on auki vscode


## Using template literals to format strings [13 of 51]
 
Käydään läpi mitä eroa on Concatenation operatorilla ja template literali. Suurin ero niillä on että concatetaion tarvii "" ja Template {}.

---

## Demo: Using template literals to format strings [14 of 51]

Videossa demotaan aikaisemmin käytyä teoriaa tässäkään ei hirveästi uutta oppinut sillä dian sijaan on taas auki vscode.


## Data types in JavaScript [15 of 51]

Videossa kerrotaan että JS on heikosti tyypitetty kieli jossa muuttujia ei tarvitse määritellä erikseen. Tämä tekee siitä yksinkertaisemman.

---

## Demo: Data types in JavaScript [16 of 51]

Demotaan miksi pitää olla tarkka mitä datatyyppejä käyttää ettei tule virheitä. Demossa näytetään ensin väärä tapa käyttää muuttujia ja sen jälkeen oikea.

---

## Math in JavaScript [17 of 51]

Jos on monimutkaisempia kuin + - ja / laskuja niin kannattaa käyttää Math objektia

---

## Demo: Math in JavaScript [18 of 51]

Näytetään miten tehdään perus laskuja + - ++ -- / ja näytetään math object käytännössä ja käytetään neliöjuurta siellä. Ensimmäinen kuukausi alkaa 0 ei 1.

---

## Converting strings to numbers [19 of 51]


Jos haluaa JS muuttaa stringin numeroksi niin pitää käyttää parseint() tai parseFloat() näissä kahdessa on erona se että parseFloat toimii desimaalijen kanssa.

---

## Demo: Converting strings to numbers [20 of 51]

Demotaan miten muutetaan stringejä integereiksi käyttämällä parseInt()

---

## Handling errors with try/catch/finally [21 of 51]

Javasrcipt voi antaa poikkeus viestin ilman että sitä on itse koodannut. Poikkeuksen koodatessa on tärkeää kertoa koodille miten sen tulee jatkaa.

---

## Demo: Handling errors with try/catch/finally [22 of 51]

Demotaan aikaisempaa teoriaa mutta syvällisemmin. Lisäksi opin että "finally" tagin sisällä oleva koodi menee aina läpi.

---

## Dates [23 of 51]

Keskimmäinen asia päivämäärien kanssa on Date objekti joka sisältää päivämäärän sekä ajan. Sekä että kuukaudet alkaa 0 ei 1 esim tammikuu olisi 0 kuukausi ei 1.

---

## Demo: Dates [24 of 51]

Jos haluaa jonkin tietyn päivämäärän voi tehdä siitä muuttujan käyttämällä const x = new Date(2001, 2, 22) 

---

## Boolean logic with if statements [25 of 51]

== vertaa muuttujia ottamatta huomioon data tyyppiä kun taas === tarkistaa data tyypinkin. "best practice" on käyttää aina ===

---

## Demo: Boolean logic with if statements [26 of 51]

Yksittäisiä rivejä kirjoittaessa voi mahdollisesti poistaa { ehtolausekkeista mutta se ei ole kannattavaa sillä se voi johtaa turhiin bugeihin.

---

## Boolean logic with switch and other syntax [27 of 51]

Jos "jos" lausekkeen sisälle jossa on esim muuttuja (x) lisätään (!x) niin se kääntää lopputuloksen. JS stringit on case sensitive. Muuttujia vertaillessa niitä voidaan yhdistää & ja | 

---

## Demo: Boolean logic with switch and other syntax [28 of 51]

Vidoessa demottiin vaan kaikki mitä aikaismmissa videoissa on käyty läpi eli casesensitive, ! kääntää logiikan === tarkistaa datatyypin eikä pelkkää arvoa.

---

## Creating arrays [29 of 51]

Arrayn voi tehdä kahdella tavalla joko manuaalisesti tai käyttämällä array objektia, mutta objektia käyttäessä tulee määrittää arrayLength.

---

## Demo: Creating arrays [30 of 51]

En oppinut mitään uutta sillä demossa käytiin kirjaimellisesti samat asiat kuin aikaisemmassa teoria videossa.

---

## Populating arrays [31 of 51]

Jos haluaa viitata johonkin arrayssa olevaan dataan pitää käyttää sille annettua indexiä. Arrayn numerot alkavat 0 eikä 1.

---

## Demo: Populating arrays [32 of 51]

Arrayhyn voi syöttää dataa laittamalla let arr1 = ["A", true, 2] jossa A on string true on true ja 2 on numero.

---

## Array methods [33 of 51]

Push ja Pop vaikuttaa arrayn loppuun. Push lisää yhden arvon loppuun ja pop poistaa yhden.

---

## Demo: Array methods [34 of 51]

shift lisää uuden arvon arrayn alkuun ja poistaa ensimmäisen arvon arraysta.

---

## Loops [35 of 51]

For loop on tehty sellaisia funktioita varten jotka halutaan suorittaa tietyn monta kertaa. for ja for each on erilaisia JS.

---

## Demo: Loops [36 of 51]

For loopissa ei tarvitse määritellä indexiä erikseen kun taas while loopissa tarvii.

---

## Functions [37 of 51]

Funktioiden avulla säästetään tilaa ja se parantaa koodin ylläpitämistä. Funktion ansiosta samaa koodia ei tarvitse kirjoittaa moneen kertaan.

---

## Demo: Functions [38 of 51]

funktio jonka sisällä on console.log("Hello world") ei tulosta vielä viestiä vaan funktiota pitää kutsua erikseen jotta saa sen tulostettua.

---

## Arrow and anonymous functions [39 of 51]

Arrow funktionin sisällä olevaa tietoa ei voi muokata.

---

## Demo: Arrow and anonymous functions [40 of 51]

Arrow funktionin loppuun ei tarvitse laittaa "return x" koska se tekee sen automaattisesti mikä on hyvä sekä huono asia.

---

## JavaScript Object Notation (JSON) [41 of 51]

JSON muodossa tiedot ovat nimi-arvo järjestyksessä esim "title":"Becoming,

---

## Demo: JavaScript Object Notation (JSON) [42 of 51]

JSONIN tarkoitus on muuttaa objektit ja listat teksti muotoon koska monet apit vaativat että pyynnöt ovat teksti muodossa.

---

## Objects in JavaScript [43 of 51]


Methodit ovat objektejen funktioita.

---

## Demo: Objects in JavaScript [44 of 51]

Objekteja voi rakentaa joko käyttämällä object literaaleja tai constructioneiden avulla.

---

## Promises for long running operations [45 of 51] 

Opin että applicaatiot monesti tai yleensä voivat käyttää single threadia vaikka käyttäjän koneessa niitä olisi 16 mikä hidastaa sovellusta huomattavasti.

---

## Demo: Promises for long running operations [46 of 51]

console.log(result) antaa sen mitä on "return Promise.resolve" vastaus kaikki muu meni yli hilseen.

---

## Async/await for managing promises [47 of 51]

Async/await on parempi kuin promise koska se on tehokkaampi ja vie vähemmän tilaa. Näyttää myös paljon helpommalta lukea.

---

## Demo: async/await for managing promises [48 of 51]

Async/await on rakennettu promisen päälle. Async on puhtaampi ja parempi versio promisesta ja mielestäni helpommin ymmärrettävissä.

---


## Package management [49 of 51]


Paketit ovat uudelleen käytettäviä koodin pätkiä ja niitä löytää valmiina NPM:stä. Pakettijen ansiosta säästää aikaa esim const x = require ("express"); säästää kymmeniltä koodi rivijen kirjoittamiselta.

---

## Demo: Package management [50 of 51]


Videossa vaan demotaan ensin miten esim prettyer package joka formattaa koodista helpommin luettavaa. Käydään myös muita packageita läpi mutta aikalailla sama kaava toistuu.

---


## Next steps [51 of 51]

Videolla kerrotaan että nyt kannatttaisi alkaa koodaamaan. LOPPU

---
