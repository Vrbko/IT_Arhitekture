### ** Storitev - Naročanje avto delov** *(Glavna storitev sistema)*  
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
