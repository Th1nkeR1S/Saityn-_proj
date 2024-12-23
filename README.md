1.Projekto Aprašymas
Taikomosios srities objektai:
Filmas -> Teorija -> Komentarai

Sistemos paskirtis:
Sistemos tikslas – sukurti forumą, skirtą filmų gerbėjams susirinkti ir aptarti savo teorijas apie filmus. Tai vieta, kur vartotojai gali kurti temas, bendrauti tarpusavyje, komentuoti ir įvertinti kitų teorijas. Sistema taip pat skatina komunikacija tarp bendraminčių ir padeda atrasti naujas filmų rekomendacijas.

Temų kūrimas:
• Vartotojai gali kurti naujas diskusijų temas apie filmus ar teorijas.
• Temas gali redaguoti kūrėjas, trinti netinkamas žinutes.

Komentarų ir atsakymų sistema:
• Kiekvienoje temoje vartotojai gali atsakyti į kitų komentarus ir dalintis savo mintimis apie teorijas. Balsavimo ir reitingavimo sistema:
• Vartotojai gali balsuoti už arba prieš teorijas ir komentarus, kad išryškėtų labiausiai palaikomos ar įdomiausios teorijos.

Technologijų aprašymas:
• JWT bus naudojamas vartotojo autentifikacijai po prisijungimo. Tai leidžia saugiai ir efektyviai tvarkyti prisijungimo sesijas.
• React bus naudojamas dinamiškam ir interaktyviam vartotojo sąsajos kūrimui. React leidžia kurti komponentų struktūras, kurios efektyviai reaguoja į vartotojo veiksmus.
• Back-end kūrybai bus naudojama .NET (C#)
• Duomenų bazė bus kuriama su MariaDB(MySql)

2.Projekto architektūra
o
Digital Ocean diegia API . Website naudoja įdiegta API.
3.Naudotojo sąsaja

Svetainės vartotojo prisijungimo langas ir registracija.

Panelių Grupiavimo langas.

Topic, Post ir Comment svetainėje.

Atidarytos Topic ir Comment edit funkcijos

4.API specifikacija

Authentication API pavyzdžiai

Topic funkcijų API pavyzdžiai

Post funkcijų API pavyzdžiai

Comment funkcijų API pavyzdžiai

GET /api/test Gaukite testinius duomenis iš duomenų bazės. [ { "id": 1, "title": "Žalgirio rungtynės", "description": "Žalgiris laimėjo", "createdAt": "2024-12-23T12:00:00Z", "userId": "user1" } ]

GET /api/Topics Gaukite visų Topics sąrašą. [ { "id": 1, "title": "Žalgirio rungtynės", "description": "žalgiris laimėjo", "createdAt": "2024-12-23T12:00:00Z", "userId": "user1" } ] POST /api/topics Sukurkite naują topic. Užklausos kūnas:

{ "title": "Žalgirio rungtynės", "description": "Žalgirio rungtynės" } Atsakymas:

{ "id": 1, "title": "Žalgirio rungtynės", "description": "Žalgirio rungtynės", "createdAt": "2024-12-23T12:00:00Z", "userId": "user1" } GET /api/topics/{topicId} Gaukite konkretų topic pagal ID.

Atsakymas:

{ "id": 1, "title": "Žalgirio rungtynės", "description": "Žalgirio rungtynės", "createdAt": "2024-12-23T12:00:00Z", "userId": "user1" } PUT /api/topics/{topicId} Atnaujinkite topic pagal ID.

Užklausos kūnas:

{ "title": "Žalgirio rungtynės", "description": "Žalgirio rungtynės" } Atsakymas:

{ "id": 1, "title": "Žalgirio rungtynės", "description": "Žalgirio rungtynės", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } DELETE /api/topics/{topicId} Pašalinkite topic pagal ID.

GET /api/topics/{topicId}/posts Gaukite visus konkretaus topic pranešimus.

Atsakymas:

[ { "id": 1, "title": "Pranešimo pavadinimas", "body": "Pranešimo turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } ] POST /api/topics/{topicId}/posts Sukurkite naują pranešimą topic.

Užklausos kūnas:

{ "title": "Naujo pranešimo pavadinimas", "body": "Naujo pranešimo turinys" } Atsakymas:

{ "id": 1, "title": "Naujo pranešimo pavadinimas", "body": "Naujo pranešimo turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } GET /api/topics/{topicId}/posts/{postId} Gaukite konkretų pranešimą topic.

Atsakymas:

{ "id": 1, "title": "Pranešimo pavadinimas", "body": "Pranešimo turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } PUT /api/topics/{topicId}/posts/{postId} Atnaujinkite konkretų pranešimą topic.

Užklausos kūnas:

{ "title": "Atnaujintas pranešimo pavadinimas", "body": "Atnaujintas pranešimo turinys" } Atsakymas:

{ "id": 1, "title": "Atnaujintas pranešimo pavadinimas", "body": "Atnaujintas pranešimo turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } DELETE /api/topics/{topicId}/posts/{postId} Pašalinkite konkretų pranešimą topic.

GET /api/topics/{topicId}/posts/{postId}/comments Gaukite visus konkretaus pranešimo komentarus.

Atsakymas:

[ { "id": 1, "content": "Komentaro turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } ] POST /api/topics/{topicId}/posts/{postId}/comments Sukurkite naują komentarą pranešime.

Užklausos kūnas:

{ "content": "Naujo komentaro turinys" } Atsakymas:

{ "id": 1, "content": "Naujo komentaro turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } GET /api/topics/{topicId}/posts/{postId}/comments/{commentId} Gaukite konkretų komentarą pranešime.

Atsakymas:

{ "id": 1, "content": "Komentaro turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } PUT /api/topics/{topicId}/posts/{postId}/comments/{commentId} Atnaujinkite konkretų komentarą pranešime.

Užklausos kūnas:

{ "content": "Atnaujintas komentaro turinys" } Atsakymas:

{ "id": 1, "content": "Atnaujintas komentaro turinys", "createdAt": "2023-12-01T12:00:00Z", "userId": "user1" } DELETE /api/topics/{topicId}/posts/{postId}/comments/{commentId} Pašalinkite konkretų komentarą pranešime.
