# Sprawozdanie z projektu:

Niniejsze sprawozdanie dokumentuje proces konteneryzacji, budowy obrazów wieloarchitekturowych, skanowania bezpieczeństwa oraz orkiestracji mikroserwisów za pomocą Docker Compose dla aplikacji MovieCom.

## 2. Opracowanie plików Dockerfile zgodnie z dobrymi praktykami

Dla każdego z mikroserwisów przygotowano dedykowany plik `Dockerfile`, opierając się na oficjalnych zaleceniach środowiska Docker w celu optymalizacji procesu budowania i zwiększenia bezpieczeństwa.

### MovieCom-API (Backend)
Plik [`MovieCom-API/Dockerfile`](./MovieCom-API/Dockerfile) oparty jest na wzorcu budowania wieloetapowego (Multi-stage build):
* **Etap Builder:** Wykorzystuje obraz `gradle:8-jdk21` w celu zbudowania aplikacji. Rozdziela to ważące środowisko z narzędziami deweloperskimi od środowiska uruchomieniowego.
* **Etap Runner:** Używa lekkiego obrazu `eclipse-temurin:21-jre-alpine`, co znacząco zmniejsza końcowy rozmiar obrazu oraz powierzchnię potencjalnego ataku.
* **Bezpieczeństwo (Non-root user):** Aplikacja nie jest uruchamiana jako domyślny użytkownik `root`. Utworzono dedykowaną grupę `appgroup` oraz użytkownika `appuser`, znacznie ograniczając uprawnienia procesu Java.

### MovieCom-Client (Frontend)
Podobnie jak backend, plik [`MovieCom-Client/Dockerfile`](./MovieCom-Client/Dockerfile) wykorzystuje wieloetapowe budowanie:
* **Etap Builder:** Wykorzystuje obraz `node:20-alpine` do instalacji zależności za pomocą `npm ci` (czysta instalacja na podstawie lockfile) i zbudowania statycznych plików aplikacji (`npm run build`).
* **Etap Runner:** Jako serwer WWW wykorzystano wysoce zoptymalizowany obraz `nginx:alpine`.
* **Optymalizacja i Bezpieczeństwo:** Zaktualizowano pakiety Alpine (`apk update && apk upgrade`). Usunięto również domyślne pliki HTML Nginxa przed wdrożeniem skompilowanych plików z etapu budowy. Dodano także zabezpieczający konfigurację plik `nginx.conf`.

### MovieCom-Database (Baza danych)
Plik [`MovieCom-Database/Dockerfile`](./MovieCom-Database/Dockerfile) również wprowadza kluczowe dobre praktyki:
* **Unikanie tagu `latest`:** Użyto specyficznego tagu wersji obrazu bazowego `mongo:7.0`, co gwarantuje stabilność i powtarzalność środowiska produkcyjnego.
* **Bezpieczne zarządzanie uprawnieniami:** Zastosowano flagę `--chmod=755` bezpośrednio podczas kopiowania skryptu inicjalizującego bazę `import.sh` (zamiast uruchamiania nowej warstwy komendą `RUN chmod`), co optymalizuje rozmiar obrazu i natychmiastowo nadaje odpowiednie prawa do uruchomienia.

---

## 3. Budowanie obrazów wieloarchitekturowych i SBOM

W celu zapewnienia kompatybilności z różnymi środowiskami operacyjnymi, obrazy zostały zbudowane ze wsparciem dla dwóch architektur: `linux/amd64` oraz `linux/arm64`. 

Proces ten zrealizowano za pomocą silnika kompilacji `docker buildx`. Dodatkowo, za pomocą odpowiednich flag wygenerowano manifesty SBOM dostarczające metadane o wszystkich zawartych pakietach w środowisku.

Przykładowe komendy użyte do zbudowania i wysłania obrazów na platformę DockerHub:

```bash
# Utworzenie i ustawienie nowego środowiska buildera z obsługą wielu architektur
docker buildx create --use --name multi-arch-builder

# Budowa wieloarchitekturowego obrazu bazy danych
docker buildx build --platform linux/amd64,linux/arm64 --sbom=true -t bartkek/moviecom-db:latest --push ./MovieCom-Database

# Budowa wieloarchitekturowego obrazu API
docker buildx build --platform linux/amd64,linux/arm64 --sbom=true -t bartkek/moviecom-api:latest --push ./MovieCom-API

# Budowa wieloarchitekturowego obrazu Frontend
docker buildx build --platform linux/amd64,linux/arm64 --sbom=true -t bartkek/moviecom-client:latest --push ./MovieCom-Client
```

## 4. Analiza podatności na zagrożenia (Trivy)

Wykorzystano skaner open-source **Trivy** w celu weryfikacji bezpieczeństwa wygenerowanych kontenerów pod kątem występowania podatności krytycznych (`CRITICAL`) i wysokiego ryzyka (`HIGH`). Skanowanie zostało wykonane po zbudowaniu obrazów przed ich uruchomieniem operacyjnym.

### Wyniki Skanowania: MovieCom-Client (Frontend)
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/aquasecurity/trivy:latest image --severity HIGH,CRITICAL bartkek/moviecom-client:latest >> ./CLIENT_RAPORT.txt  
```
- Wynik: Skaner zwrócił Total: 0 (HIGH: 0, CRITICAL: 0). Pełny [`raport clientl`](./MovieCom-Client/CLIENT_RAPORT.txt)
- Wniosek: Obraz statycznego serwera oparty na systemie Alpine, dzięki odpowiedniemu przygotowaniu i odcięciu narzędzi etapu builder, jest w pełni bezpieczny i wolny od poważnych podatności.

### Wyniki Skanowania: MovieCom-API (Backend)
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/aquasecurity/trivy:latest image --severity HIGH,CRITICAL bartkek/moviecom-api:latest >> ./API_RAPORT.txt  
```
- Wynik: Skaner wykrył łącznie 6 podatności HIGH (0 CRITICAL). Pięć z nich dotyczy bibliotek bazowego systemu Alpine (m.in. gnutls, libpng, zlib), a jedna pakietu Java (tools.jackson.core:jackson-core). Pełny [`raport api`](./MovieCom-API/API_RAPORT.txt)
- Uzasadnienie braku krytycznego wpływu na bezpieczeństwo projektu: Wykryte luki w systemie Alpine dotyczą natywnych bibliotek OS. Ponieważ nasz backend jest aplikacją napisaną w języku Java, wektory ataku na te konkretne biblioteki systemowe nie są bezpośrednio eksponowane w logice biznesowej naszego API.

### Wyniki Skanowania: MovieCom-DB (MongoDB)
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/aquasecurity/trivy:latest image --severity HIGH,CRITICAL bartkek/moviecom-db:latest >> ./DB_RAPORT.txt  
```
- Wynik: Wykryto podatności w plikach wykonywalnych języka Go (gobinary) osadzonych w oficjalnym obrazie MongoDB. Narzędzia CLI takie jak bsondump, mongodump czy mongoexport posiadają podatność HIGH w bibliotece stdlib. Z kolei plik pomocniczy usr/local/bin/gosu posiada 1 podatność CRITICAL i 5 HIGH. Pełny [`raport db`](./MovieCom-DB/DB_RAPORT.txt)
- Uzasadnienie braku wpływu na bezpieczeństwo projektu: Podatności dotyczą narzędzi CLI (np. mongodump, mongorestore) oraz programu gosu. Aplikacja backendowa nie wywołuje tych narzędzi w trakcie standardowego działania. gosu jest wykorzystywane wyłącznie przez skrypt wejściowy kontenera (entrypoint) ułamek sekundy podczas startu w celu bezpiecznego porzucenia uprawnień roota i uruchomienia silnika bazy. Po starcie program ten nie nasłuchuje ruchu sieciowego. Kontener bazy danych znajduje się ściśle w zamkniętej i dedykowanej sieci wirtualnej (backend_net). Baza nie eksponuje żadnych portów zewnętrznych mapowanych na hosta wystawionego na świat, co całkowicie odcina potencjalnym atakującym dostęp do wektorów ataku sieciowego (np. luki w crypto/tls dla gosu).

## 5. Konfiguracja docker-compose.yml oparta na dobrych praktykach

Infrastruktura mikroserwisów zarządzana jest spójnie poprzez plik [`docker-compose.yml`](./docker-compose.yml). Wprowadza on najistotniejsze zasady bezpieczeństwa, kontroli i niezawodności dla środowisk typu Docker Compose:

* **Izolacja topologii sieci :** Zdefiniowano dwie oddzielne sieci bazujące na driverze `bridge`: `frontend_net` oraz `backend_net`. Frontend funkcjonuje w swojej sieci, baza danych w innej, natomiast API działa jako bezpieczny most dostępowy..
* **Precyzyjna kontrola sekwencji:** Przygotowano reguły `healthcheck`, które weryfikują działanie środowiska. Baza pingowana jest poleceniem powłoki `mongosh`, API odpytywane `wget`-em po HTTP. Dzięki użyciu opcji `depends_on` w trybie `condition: service_healthy` usługi startują dopiero wtedy, gdy poprzedzające je zależności są w pełni stabilne, a nie jedynie w fazie ładowania.
* **Zabezpieczenie przed zużyciem pamięci:** Zaimplementowano politykę `deploy: resources: limits`, rezerwując dla API i Bazy po jednym gigabajcie RAMu i połówce rdzenia CPU. Zapobiega to całkowitej awarii systemu bazowego hosta w przypadku wycieków pamięci czy losowego obciążenia jednego podzespołu.
* **Trwałość danych ustrukturyzowanych:** Zastosowano mechanizm nazwanych wolumenów poprzez zasób `mongo_data` zamontowany sztywno do standardowego katalogu danych Mongo - `/data/db`. Rozwiązanie chroni dane przed bezpowrotnym usunięciem w chwili usunięcia kontenera z instancją bazy danych.
* **Elastyczność środowiskowa i parametryzacja:** Konfiguracja połączenia zdefiniowana została zmienną w środowisku uruchomieniowym z jednoczesnym wprowadzeniem lokalnego fallback-u (`${SPRING_DATA_MONGODB_URI:-mongodb://database:27017/moviecom}`). Zapobiega to hardkodowaniu wrażliwych ścieżek dostępowych wewnątrz obrazu kontenerowego.

---

## 6. Graficzna reprezentacja architektury (compose-viz)

Skomplikowana topologia mikroserwisów zadeklarowana w konfiguracji [`docker-compose.yml`](./docker-compose.yml) zmapowana została na przejrzystą, graficzną formę, ukazującą ścisłe powiązania pomiędzy kontenerami, wolumenami a używanymi portami.

Wykorzystano do tego otwarte oprogramowanie CLI `compose-viz`, inicjując renderowanie poleceniem:

```bash
sudo docker run --rm -it --user root -v $(pwd):/in wst24365888/compose-viz -m png docker-compose.yml
```

Wygenerowany schemat architektury znajduje się w głównym katalogu repozytorium jako plik: [`compose-viz.png`](./compose-viz.png).
