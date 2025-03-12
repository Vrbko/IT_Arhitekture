### ** Storitev - Uporabniki**  
**Funkcionalnost:**  
- Upravljala uporabniške podatke, kot so prijave, registracije, profili, zgodovina naročil itd.  
- Vsebuje informacije o avtorizaciji in pravicah dostopa uporabnikov.  
- Lahko omogoča različne vloge uporabnikov (npr. administrator, stranka, prodajalec).  

**Integracija:**  
- Povezana s svojo **bazo podatkov**, kjer hrani uporabniške podatke.  
- Komunicira z **uporabniškim vmesnikom** prek **gRPC** ali **REST API**.  
- Daje informacije storitvi **naročanje avto delov**, ki preverja identiteto uporabnika pred zaključkom naročila.  
