# IT_Arhitekture - Naročanje avtomobilskih delov
<img src="slika.svg">

# **Dokumentacija**
**Zaloga_API**

http://localhost:3000/

**Uporabniki_gRPC**

http://localhost:8000/documentation_grpc

**Narocilo_Redis**

http://localhost:8000/documentation


# **Pregled sistema**

Sistem je zasnovan kot distribuirana arhitektura, kjer več mikroservisov sodeluje za omogočanje funkcionalnosti naročanja in upravljanja avtomobilskih delov. Komunikacija med storitvami poteka prek **REST API** in **gRPC**, pri čemer se v določenih primerih uporablja **sporočilni posrednik**.

---

## **Podrobni opisi storitev**

### **1. Storitev - Zalaga avto delov**  
**Funkcionalnost:**  
- Služi kot glavni vir podatkov o razpoložljivosti avtomobilskih delov.  
- Vsebuje zalogo, informacije o delih (npr. ime, koda, proizvajalec) in količine na zalogi.  
- Omogoča preverjanje zaloge pred potrditvijo naročila.  

**Integracija:**  
- Ima lastno **bazo podatkov** za shranjevanje informacij o delih.  
- Komunicira s storitvijo naročanja avto delov prek **REST API**.  
- Pošilja podatke o razpoložljivosti delov na zahtevo.  

---

### **2. Storitev - Naročanje avto delov** *(Glavna storitev sistema)*  
**Funkcionalnost:**  
- Ključna storitev, ki omogoča uporabnikom oddajo in upravljanje naročil avtomobilskih delov.  
- Obdeluje naročila, preverja zalogo in potrjuje nakup.  
- Upravlja podatke o naročilih in povezuje različne storitve.  

**Integracija:**  
- Ima lastno **bazo podatkov**, kjer shranjuje podatke o naročilih, vključno z informacijami o uporabniku in stanju naročila.  
- Komunicira z:  
  - **Storitev zaloga avto delov** za preverjanje razpoložljivosti.  
  - **Uporabniški vmesnik** prek **sporočilnega posrednika** ali **REST API** za sprejemanje naročil.  
  - **Storitev uporabniki** za preverjanje identitete in podatkov o uporabnikih.  

**Dodatne funkcionalnosti:**  
- Spremljanje in posodabljanje statusa naročil.  
- Uporaba **sporočilnega posrednika**, kar omogoča boljšo skalabilnost pri obdelavi naročil.  
- Možna integracija s plačilnimi storitvami v prihodnosti.  

---

### **3. Storitev - Uporabniki**  
**Funkcionalnost:**  
- Upravljala uporabniške podatke, kot so prijave, registracije, profili, zgodovina naročil itd.  
- Vsebuje informacije o avtorizaciji in pravicah dostopa uporabnikov.  
- Lahko omogoča različne vloge uporabnikov (npr. administrator, stranka, prodajalec).  

**Integracija:**  
- Povezana s svojo **bazo podatkov**, kjer hrani uporabniške podatke.  
- Komunicira z **uporabniškim vmesnikom** prek **gRPC** ali **REST API**.  
- Daje informacije storitvi **naročanje avto delov**, ki preverja identiteto uporabnika pred zaključkom naročila.  

---

### **4. Uporabniški vmesnik - Spletni brskalnik**  
**Funkcionalnost:**  
- Glavni dostopni vmesnik za uporabnike sistema.  
- Omogoča interakcijo s celotnim ekosistemom storitev.  
- Omogoča pregled zaloge, oddajo naročil, upravljanje uporabniških podatkov in spremljanje statusa naročil.  

**Integracija:**  
- Komunicira s storitvami prek **REST API** ali **gRPC**.  
- Pošilja naročila v **storitev naročanja avto delov**.  
- Pridobiva uporabniške podatke iz **storitev uporabniki**.  
- Lahko prikazuje zalogo iz **storitev zaloga avto delov**.  

---

## **Zaključek**  
Celoten sistem je zasnovan modularno in uporablja mikroservisno arhitekturo za učinkovito upravljanje avtomobilskih delov. **Glavna storitev naročanja avto delov** je srce sistema, ki povezuje uporabnike, zalogo in naročila, pri čemer uporablja več komunikacijskih metod (**REST API, gRPC, sporočilni posrednik**) za zagotavljanje zanesljivosti in skalabilnosti.

