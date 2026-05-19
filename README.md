# OPIS ARCHITEKTURY I DECYZJI PROJEKTOWYCH

Zgodnie z wymaganiami zadania projektowego, poniżej znajduje się uzasadnienie przyjętych rozwiązań konfiguracyjnych dla klastra Kubernetes (Minikube).

## 1. Przestrzeń nazw (Namespace)
Zdefiniowano dedykowany namespace `moviecom` dla wszystkich zasobów projektu. Pozwala to na logiczną separację od innych aplikacji działających w klastrze oraz bezpieczniejsze wprowadzanie np. reguł sieciowych czy limitów Quota.

## 2. Obiekty wdrożeniowe (Deployments / StatefulSet)
* **Baza Danych (moviecom-db)**: Wykorzystano obiekt `StatefulSet` z jedną repliką. Obiekt ten jest wymagany dla aplikacji stanowych (jakimi są bazy danych), ponieważ zapewnia unikalną i stabilną tożsamość sieciową dla replik.
* **API oraz Frontend**: Zastosowano obiekt `Deployment`, ponieważ obie mikrousługi są bezstanowe. Obiekt ten optymalnie zarządza ReplicaSet, umożliwiając sprawną realizację aktualizacji w oparciu o domyślną strategię `RollingUpdate` (brak przestojów aplikacji). Dla obu mikrousług przyjęto 3 repliki w celu zapewnienia odpowiedniej dostępności i odporności na awarie.

## 3. Serwisy (Services)
Zgodnie z dobrymi praktykami bezpieczeństwa, wszystkie usługi powiązano z modelem `ClusterIP`. Bezpośrednie wystawianie bazy danych lub wewnętrznego API na zewnątrz klastra (np. używając NodePort) stwarza niepotrzebne ryzyko. Dostęp z zewnątrz zapewnia wyłącznie Ingress.

## 4. Dostęp zewnętrzny (Ingress)
Do konfiguracji dostępu z zewnątrz użyto obiektu `Ingress` bazującego na wtyczce `ingress-nginx` dostępnej w Minikube. Pozwala to na zdefiniowanie przejrzystych zasad routingu dla całego systemu pod jednym adresem hosta (`moviecom.local`), odpowiednio kierując ruch na Frontend (`/`) lub bezpośrednio do warstwy backendowej (`/api`).

## 5. Utrwalanie danych (PV/PVC/StorageClass)
Przechowywanie permanentne danych w bazie MongoDB zrealizowano przy użyciu statycznego przydziału wolumenów (Static Provisioning). Zamiast polegać na domyślnym i dynamicznym dostawcy wolumenów środowiska Minikube, zdecydowano się na jawne i kontrolowane zdefiniowanie obiektu `PersistentVolume` (`local-mongo-pv`) o pojemności `2Gi`. Wolumen ten korzysta z typu `local`, wskazując na fizyczny katalog `/mnt/data/mongo` na węźle klastra, co powiązano z regułą powinowactwa węzłów (`nodeAffinity`) skierowaną na instancję `minikube`.

Żądanie zasobów realizowane jest przez obiekt `PersistentVolumeClaim` (`mongo-pvc`), w którym jawnie zadeklarowano klasę przechowywania `storageClassName: manual`. Mechanizm ten wymusza intencjonalne i stabilne powiązanie (Bound) żądania z wcześniej przygotowanym wolumenem lokalnym, gwarantując niezawodne zachowanie oraz pełną trwałość danych niezależnie od restartów czy cyklu życia Podów bazy danych.

## 6. Konfiguracja i Sekrety (ConfigMap / Secrets)
Parametry konfiguracyjne wstrzykiwane są za pomocą obiektu `ConfigMap`. Zdefiniowano w nim m.in. zmienną środowiskową `SPRING_DATA_MONGODB_URI`, która wykorzystuje wewnętrzny mechanizm DNS platformy Kubernetes (FQDN: `moviecom-db-0.moviecom-db-svc.moviecom.svc.cluster.local`), co całkowicie eliminuje problem twardego kodowania zmiennych adresów IP.

W celu obsługi ruchu HTTPS przez Ingress utworzono manifest 05a-tls-secret.yaml zawierający certyfikat self-signed dla domeny moviecom.local. Należy zaznaczyć, że w środowisku deweloperskim obiekt ten został dodany do repozytorium w celach demonstracyjnych. W środowisku produkcyjnym zarządzanie certyfikatami powinno być realizowane automatycznie (np. z użyciem narzędzia cert-manager i Let's Encrypt) lub przez zewnętrzne systemy zarządzania sekretami, aby uniknąć przetrzymywania kluczy prywatnych w systemie kontroli wersji.

## 7. Ograniczenie zasobów (CPU/RAM)
Dla wszystkich kontenerów wykorzystano mechanizm żądań (`requests`) i limitów (`limits`) dla procesora oraz pamięci operacyjnej. Limity górne zostały przeniesione bezpośrednio z historycznej definicji w środowisku Docker Compose, natomiast zadeklarowane prośby (`requests`) pomagają planiście (schedulerowi) Kubernetes odpowiednio i bezpiecznie zarządzać przydziałem Podów do dostępnych węzłów w oparciu o ich faktyczne obciążenie.

## 8. Zdefiniowanie polityki sieciowej (Network Policies)
Kierując się zasadą ograniczonego zaufania (Zero Trust) i minimalnego dostępu, skonfigurowano reguły ograniczające ruch wewnątrz klastra (NetworkPolicy typu Ingress). Zablokowano swobodną komunikację horyzontalną – Frontend może wysyłać zapytania wyłącznie do warstwy API na port 9000, natomiast API jest wyłącznym bytem mającym uprawnienia sieciowe do komunikacji z portem 27017 bazy danych MongoDB.

## 9. Mechanizmy sterujące planowaniem rozmieszczenia obiektów (Affinity)
Skonfigurowano politykę `podAntiAffinity` dla obiektów typu Deployment (Frontend i API). Użyto "twardej" reguły (`requiredDuringSchedulingIgnoredDuringExecution`) wymuszającej na planiście umieszczanie replik tego samego mikroserwisu na fizycznie różnych węzłach klastra (w oparciu o klucz topologii `kubernetes.io/hostname`). Znacznie ogranicza to szansę na niedostępność całego serwisu w przypadku awarii pojedynczego węzła.