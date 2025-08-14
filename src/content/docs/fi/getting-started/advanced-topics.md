---
title: "UKK kokeneille käyttäjille"
draft: false
sidebar:
  order: 10
---

Oletko jo perehtynyt [APIOps Cycles -perusteisiin](../getting-started/)?

:::note
Tällä sivulla vastataan yleisimpiin kysymyksiin, joita saamme kumppaneiltamme ja asiakkailtamme, jotka ovat kiinnostuneita API-toimituksen skaalaamisesta, hallinnan parantamisesta tai menetelmän räätälöimisestä monimutkaisiin ympäristöihin.
:::

---

## 1. Miksi API:en käytöstä poistaminen ei ole APIOps Cycles -sovelluksen elinkaaren vaihe?
Seuraavassa on erittely siitä, miten API:en käytöstä poistaminen sopii luonnollisesti olemassa oleviin vaiheisiin tuotannonhallinnan periaatteiden ja käytännön kokemusten perusteella:

**1. API-tuotestrategiavaihe**

Tässä vaiheessa tehdään päätökset API:en käytön jatkamisesta, muuttamisesta tai käytöstä poistamisesta.

- Asiakaskokemuskanava voi osoittaa, että käyttäjäkokemus on vanhentunut tai hoidetaan muualla. Se on erittäin hyödyllinen tulevien vaatimusten tarkistamisessa yrityksissä, jotka käyttävät käyttäjäkokemuksia.
- API-arvolupauskanava voi osoittaa ainutlaatuisen arvon vähenemistä. Tätä kanavaa käytetään usein loppukäyttäjien ja kehittäjien tarpeiden kartoittamiseen uusille ja olemassa oleville API:ille. Sen pitäisi osoittaa, onko API:ta enää tarvita tai vaatiiko se laajaa uudistamista.
- API-liiketoimintamallikangas voi paljastaa negatiivisen sijoitetun pääoman tuoton tai kestämättömät kustannusrakenteet. API-tuotestrategiasemman viimeisen kankaan tulisi osoittaa, ovatko hyödyt ja kustannukset tasapainossa ja onko API:lle saatavilla kuluttajia.

→ Poistaminen käytöstä on tuotepäätös, ei pelkästään tekninen tapahtuma.

**2. Seuranta- ja parantamisseminaari**
Tässä vaiheessa tulisi esiin poistamista käytöstä puoltavat todisteet, jotka syötetään API-tuotestrategiaan.
- Käyttötilastot (liikenteen lasku, ei kutsuja tärkeiltä segmenteiltä)
- Kuluttajapalaute (kyselytulokset, NPS, GitHub-ongelmat)
- Operatiiviset indikaattorit (kustannus-hyötysuhde, tietoturva-aukot)

Parannusmahdollisuuksien puute voi viitata siihen, että API ei enää oikeuta investointeja tai jatkamista.

→ Tämä vaihe tarjoaa määrälliset ja laadulliset perusteet käytöstä poistamiselle.

**3. Julkaisujen hallinta**
Tässä vaiheessa versioiden poistamisen ja API:n käytöstä poistamisen ohjeet on jo laadittu.
- Versioiden elinkaaren hallinta
- Taaksepäin yhteensopivuuden suunnitelmat
- Poistamista koskevat viestipohjat
- Uudelleenohjaukset ja varasuunnitelmat

→ Tässä vaiheessa toteutetaan API:n käytöstä poistamisen operatiiviset näkökohdat.

---

## 2. Miten voin integroida APIOps Cycles -palvelun Agile- tai SAFe-prosessiimme?
Käsittele asemia **työpajoina tai backlogin tarkennuksen vaiheina** ketterän kehityksen rytmissä.
- Käytä kankaita varhaisissa sprinteissä löytämiseen.
- Palaa säännöllisesti asemille, kuten *Audit* ja *Metrics & Analytics*, osana tarkastus-/sopeutumissyklinä.
- SAFe-menetelmässä asemat sopivat hyvin Enabler Epics -menetelmään ja portfolion tason hallintaan.
---
## 3. Mikä on paras tapa suorittaa API-auditointi ja kuinka usein se tulisi tehdä?
APIOps Cycles -menetelmässä API-auditointiasema vastaa asioita, jotka tyypillisesti tarkistetaan API-suunnittelun tarkistuksen aikana tai missä tahansa tarkistuspisteessä, joka sinulla jo on varmistaaksesi, että API on valmis julkaistavaksi sisäisille tai ulkoisille käyttäjille. Käytä siihen [API-auditoinnin tarkistuslistaa](../resources/api-audit-checklist/), joka on jaettu kolmeen vaiheeseen tarkastettavan tai auditoitavan API:n tilan mukaan.
 
On myös toinenlaista ”auditointia”, *API-ominaisuuksien auditointi*, joka koskee API-hallintoa tai API-ohjelmaa ja jonka voit myös suorittaa. API-auditointilistaa voidaan käyttää ja automatisoida organisaatiosi API-rajapintojen yleisen kunnon määrittämiseen. Se korreloi koko API-ohjelman yleisen ajattelutavan, kulttuurin ja tilan kanssa. Mutta jos haluat syventää tietojasi, kannattaa tarkastella tarkemmin toimintamallilinjan esikaupunkien tilaa ja muita linjoja, yksi painopistealue tai linja kerrallaan. Kumppanimme ovat yleensä kokeneita auttamaan sinua arvioimaan ja laatimaan parannussuunnitelmia API-ohjelmiesi laajentamiseksi. 
**Kyvykkyysauditoinnin tiheys:** Suurille ohjelmille neljännesvuosittain, pienemmille tiimeille vuosittain.
- Käsittele sitä yhteistyönä, ei vaatimustenmukaisuuden tarkastuksena.
- Liitä havainnot backlogin parannuskohteisiin.
---
## 4. Miten sovellan menetelmää säännellyille toimialoille (rahoitus, terveydenhuolto jne.)?
- Lisää sääntelytarkistuspisteitä asiaankuuluviin asemiin (esim. API-alustan arkkitehtuuriasema, joka käyttää *liiketoimintavaikutus*-, *sijainti*- ja *kapasiteettikankaita*).
- Ota vaatimustenmukaisuuden sidosryhmät mukaan varhaisessa vaiheessa.
- Säilytä päätösten todisteet kanvas-vientiissä (JSON/SVG) auditointia varten. Tämä on helppo tehdä Canvas Creator -työkalulla, jolla voit täyttää, viedä ja tuoda kanvaksia, jolloin voit tallentaa ihmisten ja/tai tekoälyn täyttämät kanvaksit versiohallintaan.
---
## 5. Mitkä ovat keskeiset roolit, jotka tulisi ottaa huomioon kussakin vaiheessa API-toimituksen laajentamisessa?
- *API-tuotestrategia, johon liittyy esimerkiksi asiakaskokemus / arvolupaus*: tuotepäälliköt, UX, kumppanipäälliköt, arkkitehdit, johtavat kehittäjät
- *API-suunnittelu, johon liittyy esimerkiksi toimialueen / vuorovaikutuksen suunnittelu*: tuotepäälliköt, arkkitehdit, johtavat kehittäjät
- *API-alustan arkkitehtuuri, johon liittyy liiketoimintavaikutukset / kapasiteetti*: tuotepäälliköt, arkkitehdit, alustan insinöörit, tietoturva, hallinnon johtajat
- *Metriikka ja analytiikka*: data-/analytiikkatiimit, alustan insinöörit, tuotepäälliköt, API-tuki
---
## 6. Voidaanko APIOps Cycles -sovellusta käyttää vain sisäisiin API-rajapintoihin vai myös kumppani-/julkisiin API-rajapintoihin?

Molempiin. Kaikki vaiheet, linjat, resurssit ja kriteerit koskevat molempia.
 
Erot tulevat esiin asemien sisäisessä työssä, eli kun täytetään asiakaskokemuksen kanvas, kuka on asiakas, ja kun täytetään API-liiketoimintamallin kanvas, kuka on API-kuluttaja.
Vinkki: Vaikka suunnittelet sisäisiä API:ita, asiakaskokemuksen asiakkaat ovat todennäköisesti organisaatiosi ”todelliset asiakkaat”, eli ulkoisia asiakkaita. Historia on myös osoittanut, että useimmat sisäiset API:t eivät pysy sisäisinä ikuisesti.

---

## 7. Kuinka mittaan API-ohjelman kypsyyttä APIOps Cycles -työkalulla?
Seuraa:
- Aseman kattavuus (mitkä asemat käydään säännöllisesti)
- Laatumittarit *Metrics & Analytics* -asemalta
- Hallinnon käyttöönotto yksittäisistä *API Audit* -tuloksista tai valmiusauditoinneista.
- Kuluttajien käyttöönotto (käytön kasvu, käyttöönoton aika)
---
## 8. Kuinka saan johdon tukea tämän menetelmän käyttöönotolle koko organisaatiossa?
- Käytä API-tuotestrategiasasemalla luotuja kankaita, kuten *Customer Journey Canvas* ja *API Business Model Canvas*, liiketoiminnan johtajille. Mittaa liiketoiminnan KPI-mittareita ja käyttöönottoa Monitoring & Improving -asemalla.
- Teknologiajohtajille voit käyttää API-alustan arkkitehtuuriasemalla luotua *Business Impact* -mallia ja API-auditointiaseman tuloksia eri API:ista strategisten tavoitteiden yhdenmukaisuuden osoittamiseksi.
- Jaa metro-kartta, joka kuvaa edistymistä ja kypsyyttä ajan mittaan.
- Korosta toimitusriskien vähenemistä ja markkinoille pääsyn nopeutumista.
---
## 9. Voinko ohittaa tietyt asemat pysyvästi?

Voit ohittaa ne toistaiseksi, mutta et pysyvästi.
Jotkin asemat (esim. *API-tuotestrategia, API-auditointi*, *Seuranta ja parantaminen)* voivat aluksi tuntua vähemmän tärkeiltä, mutta niiden ohittaminen lopullisesti voi aiheuttaa hallintotapaan liittyviä puutteita ja teknistä velkaa.
 
Kuten APIOps Cycles -kumppanimme voivat kertoa kokemuksestaan monien organisaatioiden kanssa, API-tuotestausasema voi olla jopa tärkein aloituskohde API-tuotestrategian lisäksi (jos suunnitteilla on paljon uusia tai parannettuja API-rajapintoja tai merkittäviä liiketoiminnallisia tai teknisiä muutoksia).

---

## 10. Miten APIOps Cycles -menetelmä auttaa meitä luomaan tai parantamaan omaa API-hallintomalliamme?

APIOps Cycles on hallintosi *käyttöjärjestelmä*. Se muuntaa korkean tason toimintaperiaatteet konkreettisiksi artefakteiksi, rituaaleiksi ja automatisoiduiksi tarkistuksiksi 

API-elinkaaren sisällä, jolloin hallinto on kevyttä, iteratiivista ja todella käytössä.
Voit käyttää ja linkittää menetelmän osia, jotka koskevat suoraan organisaatiotasi, ja lisätä lisävaatimuksia tai asiakirjoja omaan sisäiseen dokumentaatioosi. **APIOps Cycles -resurssit** sisältävät kankaita, ohjeita ja esimerkkejä työkalutyypeistä, joita voit mukauttaa hallintamalliisi. Kankaiden, **API-tarkastuslistan** ja 
**API-suunnitteluperiaatteiden** lisäksi suurin osa resursseista on ”luonnoksia”, jotka osoittavat, mitä voitaisiin tai pitäisi tarjota, eivätkä ne ole täydellisiä, normatiivisia ohjeita.

**Vaihtoehtoja ovat:**
- **Käytä sellaisenaan**: Linkitä hallintodokumentaatioosi suoraan asiaankuuluviin menetelmän osiin.
- **Mukauta**: Mukauta kankaat, tarkistuslistat tai ohjeet sisäisten standardiesi mukaisiksi.
- **Osallistu**: Ehdottaa uusia ohjeita tai resursseja sisällytettäväksi APIOps Cycles -menetelmään, jotta muutkin voivat hyötyä niistä.
Tuloksena saat hallintomallin, joka yhdistää **sisäiset käytäntösi** ja **yhteisön testaamat APIOps Cycles -käytännöt**, mikä helpottaa tiimien noudattamista ja johtajien valvontaa päivittäisessä työssä.