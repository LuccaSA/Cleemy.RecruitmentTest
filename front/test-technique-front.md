# Cleemy : test technique front

Le test consiste à réaliser une Single Page Application avec Angular pour saisir les dépenses effectuées lors d'un voyage professionnel (le but étant de se les faire rembourser par son employeur).


L'application consistera en une page permettant d'afficher :
- La liste des dépenses fournie par une API REST (par exemple nature de la dépense, date et montant)
- Un formulaire pour créer ou modifier une dépense (via un drawer par exemple)

Quelques extensions possibles pour vous démarquer :
- Internationalisation
- Tri de la liste des dépenses par colonne
- Gestion de la pagination
- Utilisation d'un service de conversion de devise (par exemple via https://currencylayer.com)

## Critères d'évaluation
Vous serez évalué(e) sur la maintenabilité de votre code (lisibilité, extensibilité, non-répétitivité, homogénéité) et sur l'UX (et non l'UI).

## Rendu
Envoyez-nous vos prouesses versionnées (repo public ou privé github, gitlab...).

Si le projet est concluant, on vous rappelle pour discuter de vos choix techniques et évoquer votre avenir chez Lucca.

## API des dépenses
Vous devrez travailler avec l'API des dépenses disponibles à l'adresse suivante :

https://mobile.ilucca-dev.net/api/expenseItems


### Authentification
Chaque appel à l'API doit être authentifié. Pour cela, il suffit de spécifier le header Authorization avec pour valeur Bearer {token} (où {token} vous aura été transmis par email). Vous n'avez ainsi pas besoin d'implémenter une page d'authentification.

### ExpenseItem
La ressource ExpenseItem correspond à une dépense.

Exemple de dépense :

```json
{
    "id": "727212a0-4d73-4615-bd23-d7df6f562491",
    "purchasedOn": "2018-12-04",
    "nature": "Restaurant",
    "originalAmount": {
        "amount": 17.0,
        "currency": "GBP"
    },
    "convertedAmount": {
        "amount": 19.09,
        "currency": "EUR"
    },
    "comment": "Mission de 5 jours à Londres",
    "createdAt": "2018-12-05T14:00:34.435154Z",
    "lastModifiedAt": "2018-12-05T14:00:34.435154Z"
}
```

Zoom sur les propriétés :
- `id` (`Guid`) : identifiant unique de la dépense
- `purchasedOn` (`Date`) : date de la dépense
- `nature` (`String`) : type de la dépense (comme "Restaurant", "Hôtel", "Parking", etc). Le champ est limité à 120 caractères
- `originalAmount` (`Amount`) : montant et devise de la dépense d'origine. Par exemple, si vous faites une dépense en Angleterre, il s'agit du montant en livre sterling (GBP). La devise est limitée aux valeurs suivantes : CHF, EUR, GBP et USD
- `convertedAmount` (`Amount`) : montant converti dans votre devise (pour des raisons de simplicité, le montant converti est toujours EUR)
- `comment` (`String`) : le commentaire de la dépense, limité à 600 caractères
- `createdAt` (`Datetime`) : date et heure (GMT) de la création de la dépense. La valeur est readonly
- `lastModifiedAt` (`Datetime`) : date et heure (GMT) de la dernière modification de la dépense. La valeur est readonly

### Lecture
`GET /api/expenseItems` permet de récupérer une collection de dépenses (triées par date de création croissant).

`GET /api/expenseItems/{id}` permet de récupérer une seule dépense.

#### Filtres
Vous pouvez filtrer les dépenses sur les 3 champs date (`purchasedOn`, `createdAt` et `lastModifiedAt`) avec la syntaxe `since,{date}`.

Par exemple, pour récupérer toutes les dépenses créées depuis le 05/12/2018 à 13:58:00 GMT, il faut faire l'appel suivant :
`GET /api/expenseItems?createdAt=since,2018-12-05T13:58:00Z`

#### Pagination
La pagination s'effectue avec deux paramètres :
- `offset=x` : pour sauter `x` éléments
- `limit=y` : pour limiter le nombre de résultat à `y`. La valeur par défaut est de 10 et la valeur maximale est de 50

Par exemple, pour sauter les 20 premières dépenses, et limiter le nombre de résultats à 10, il faut faire l'appel suivant :
`GET /api/expenseItems?offset=20&limit=10`.

Le JSON de retour contient la propriété `count` qui indique le nombre total de dépenses correspondant au filtre, peu importe la pagination.

### Création d'une dépense
`POST` sur `/api/expenseItems` pour créer une dépense.

Exemple de body :

```json
{
    "id": "09914f21-f75b-4101-bab9-34eba62f5169",
    "purchasedOn": "2018-12-06",
    "nature": "Hotel",
    "comment": "Mission de 5 jours à Londres",
    "originalAmount": {
        "amount": 17.0,
        "currency": "GBP"
    },
    "convertedAmount": {
        "amount": 960.03,
        "currency": "EUR"
    },
}
```

Si `id` n'est pas spécifié, le serveur lui attribuera une valeur automatiquement.

### Modification d'une dépense
`PUT /api/expenseItems/{id}` pour modifier la dépense.

Le body de la dépense peut être partiel. Par exemple:
`PUT /api/expenseItems/09914f21-f75b-4101-bab9-34eba62f5169`
Avec `{"comment": "Hello World"}` pour modifier le commentaire de la dépense.

### Suppression d'une dépense
`DELETE /api/expenseItems/{id}` pour supprimer la dépense.