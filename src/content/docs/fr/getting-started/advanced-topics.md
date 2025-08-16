---
title: "FAQ pour les utilisateurs expérimentés"
draft: false
sidebar:
  order: 10
---
Vous connaissez déjà les [bases d'APIOps Cycles](../getting-started/) ?

:::note
Cette page répond aux questions les plus fréquentes que nous posent nos partenaires et clients intéressés par la mise à l'échelle de la livraison d'API, l'amélioration de la gouvernance ou l'adaptation de la méthode à des environnements complexes.
:::

---
## 1. Pourquoi la mise hors service des API n'est pas une étape du cycle de vie dans APIOps Cycles

Voici une description détaillée de la manière dont la mise hors service des API s'intègre naturellement dans les étapes existantes, sur la base des principes de gestion des produits et de l'expérience acquise sur le terrain :

**1. Étape de stratégie produit API**
C'est ici que doivent idéalement être prises les décisions concernant la poursuite, la réorientation ou la mise hors service d'une API.
- Le Customer Journey Canvas peut montrer qu'un parcours utilisateur est obsolète ou géré ailleurs. Il est très utile pour vérifier les besoins futurs avec les entreprises qui utilisent des parcours.
- L'API Value Proposition Canvas peut signaler une diminution de la valeur unique. Ce canevas est souvent utilisé pour cartographier les besoins des utilisateurs finaux et des développeurs par rapport aux API nouvelles et existantes. Il doit indiquer si une API n'est plus nécessaire ou nécessite une refonte complète.
- Le canevas du modèle commercial de l'API peut révéler un retour sur investissement négatif ou des structures de coûts non viables. Ce dernier canevas de la station Stratégie produit API doit indiquer si les avantages et les coûts sont équilibrés et s'il existe des consommateurs pour une API.

→ Le retrait est une décision produit, pas seulement un événement technique.

**2. Station Surveillance et amélioration**
C'est ici que les preuves justifiant le retrait doivent apparaître et alimenter la stratégie produit API.
- Indicateurs d'utilisation (baisse du trafic, absence d'appels provenant de segments clés)
- Commentaires des consommateurs (résultats d'enquêtes, NPS, problèmes GitHub)
- Indicateurs opérationnels (rapport coût/bénéfice, vulnérabilités de sécurité)

L'absence d'opportunités d'amélioration peut indiquer que l'API ne justifie plus l'investissement ou son maintien.

→ Cette étape fournit les justifications quantitatives et qualitatives du retrait.

**3. Station de gestion des versions**

C'est ici que s'exécutent les directives relatives à la fin de vie des versions et à la dépréciation des API.
- Politiques relatives au cycle de vie des versions
- Plans de rétrocompatibilité
- Modèles de communication relative à la fin de vie
- Redirections et planification de secours

→ C'est ici que vous mettez en œuvre les aspects opérationnels du retrait d'une API.

---

## 2. Comment puis-je intégrer APIOps Cycles à notre processus Agile ou SAFe ?
Considérez les stations comme des **ateliers ou des étapes de raffinement du backlog** dans votre cadence Agile.
- Utilisez des canevas dans les premiers sprints pour la découverte.
- Revisitez régulièrement les stations telles que *Audit* et *Metrics & Analytics* dans le cadre de votre cycle d'inspection/adaptation.
- Dans SAFe, les stations s'alignent bien avec les Enabler Epics et la gouvernance au niveau du portefeuille.
---
## 3. Quelle est la meilleure façon d'effectuer un audit API et à quelle fréquence dois-je le faire ?
Dans la méthode APIOps Cycles, la station API Audit correspond aux éléments généralement vérifiés lors d'une révision de conception API ou à tout point de contrôle que vous avez déjà mis en place pour vous assurer que l'API est prête à être publiée pour les consommateurs internes ou externes. Utilisez la [liste de contrôle d'audit API](../resources/api-audit-checklist/) à cet effet. Elle est divisée en trois phases en fonction de l'état de l'API examinée ou auditée.
 
Il existe un autre type d'« audit », l'*audit des capacités de l'API*, qui porte sur la gouvernance ou le programme de l'API et que vous pouvez également effectuer. La liste de contrôle de l'audit de l'API peut être utilisée et automatisée pour déterminer la santé globale des API de votre organisation. Cela correspond à l'état d'esprit général, à la culture et à l'état de l'ensemble de votre programme API. Mais pour aller plus loin, vous pouvez examiner de plus près l'état des stations suburbaines sur la ligne « Modèle opérationnel » et les autres lignes, en vous concentrant sur un domaine ou une ligne à la fois. Nos partenaires ont généralement une grande expérience dans l'évaluation et l'élaboration de plans d'amélioration pour faire évoluer vos programmes API. 
**Fréquence de l'audit des capacités :** trimestrielle pour les programmes de grande envergure, annuelle pour les petites équipes.
- Considérez-le comme un examen collaboratif et non comme un exercice de conformité.
- Reliez les conclusions aux points à améliorer dans votre backlog.
---
## 4. Comment adapter la méthode aux secteurs réglementés (finance, santé, etc.) ?
- Ajoutez des points de contrôle réglementaires dans les stations concernées (par exemple, la station Architecture de la plateforme API qui utilise les *Business Impact*, *Location* et *Capacity Canvases*).
- Impliquez dès le début les parties prenantes chargées de la conformité.
- Conservez les preuves des décisions dans vos exportations de canevas (JSON/SVG) à des fins d'audit. Cela est facile à faire à l'aide du Canvas Creator pour remplir, exporter et importer les canevas, ce qui vous permet de stocker les canevas remplis par des humains et/ou l'IA dans le contrôle de version.
---
## 5. Quels sont les rôles essentiels qui doivent être impliqués à chaque étape lors de la mise à l'échelle de la livraison d'API ?
- *Station Stratégie produit API impliquant par exemple le parcours client / la proposition de valeur* : chefs de produit, UX, responsables partenaires, architectes, développeurs principaux
- *Station Conception API avec par exemple la conception du domaine / des interactions* : chefs de produit, architectes, développeurs principaux
- *Architecture de la plateforme API impliquant l'impact commercial / la capacité* : chefs de produit, architecture, ingénieurs de plateforme, responsables de la sécurité, responsables de la gouvernance
- *Mesures et analyses* : équipes de données/d'analyse, ingénieurs de plate-forme, chefs de produit, assistance API
---
## 6. Les cycles APIOps peuvent-ils être utilisés uniquement pour les API internes ou également pour les API partenaires/publiques ?

Les deux. Toutes les étapes, lignes, ressources et critères s'appliquent aux deux.
 
Les différences apparaîtront « à l'intérieur » du travail lié à la station, c'est-à-dire lorsque vous remplirez le canevas du parcours client, qui est le client, et lorsque vous remplirez le canevas du modèle commercial API, qui sont les consommateurs API.

:::tip
Même lorsque vous planifiez des API internes, les clients du parcours client sont très probablement les « clients réels » de votre organisation, c'est-à-dire externes. L'histoire prouve également que la plupart des API internes ne restent pas internes pour toujours.
:::

---
## 7. Comment mesurer la maturité d'un programme API à l'aide d'APIOps Cycles ?
Suivez :
- La couverture des stations (quelles stations sont régulièrement visitées)
- Les indicateurs de qualité de la station *Metrics & Analytics*
- L'adoption de la gouvernance à partir des résultats individuels de l'*API Audit* ou des audits de capacités.
- L'adoption par les consommateurs (croissance de l'utilisation, temps d'intégration)
---
## 8. Comment obtenir l'adhésion des dirigeants pour utiliser cette méthode dans toute l'organisation ?
- Utilisez les canevas créés à la station Stratégie produit API, tels que *Customer Journey Canvas* et *API Business Model Canvas* pour les dirigeants d'entreprise. Mesurez les KPI commerciaux et l'adoption à la station Surveillance et amélioration.
- Pour les responsables techniques, utilisez le canevas « Impact commercial » de la station Architecture de la plateforme API et les résultats de la station Audit API pour toutes les API afin de montrer l'alignement avec les objectifs stratégiques.
- Partagez des visuels sous forme de métro indiquant les progrès et la maturité au fil du temps.
- Mettez l'accent sur la réduction des risques liés à la livraison et l'accélération de la mise sur le marché.

---

## 9. Puis-je ignorer certaines stations de manière permanente ?

Vous pouvez les ignorer pour l'instant, mais pas indéfiniment.

Certaines stations (par exemple, *Stratégie produit API, Audit API*, *Surveillance et amélioration)* peuvent sembler peu prioritaires au départ, mais les ignorer indéfiniment 
peut créer des lacunes en matière de gouvernance et une dette technique.
 
Comme nos partenaires APIOps Cycles peuvent vous le dire d'après leur expérience avec de nombreuses organisations, la station Audit API peut même être la plus importante pour commencer, en plus de la stratégie produit API (si de nombreuses API nouvelles ou améliorées sont prévues, ou si des changements commerciaux ou techniques majeurs sont prévus).

---

## 10. Comment la méthode APIOps Cycles nous aide-t-elle à créer ou à améliorer notre propre modèle de gouvernance API ?
APIOps Cycles est le *système d'exploitation* de votre gouvernance. Il transforme les politiques de haut niveau en artefacts concrets, en rituels et en contrôles automatisés au sein du cycle de vie des API, afin que la gouvernance soit légère, itérative et réellement utilisée.

Vous pouvez utiliser et relier les parties de la méthode qui s'appliquent directement à votre organisation, et ajouter toute exigence ou tout document supplémentaire à votre propre documentation interne. Les **ressources APIOps Cycles** comprennent des canevas, des lignes directrices et des exemples de types d'outils que vous pouvez adapter à votre modèle de gouvernance. À l'exception des canevas, de la **liste de contrôle d'audit API** et des **principes de conception API**, la plupart des ressources sont des « ébauches » qui indiquent ce qui pourrait ou devrait être fourni, plutôt que des lignes directrices complètes et normatives.

**Vous avez les options suivantes :**
- **Utiliser tel quel** : créez un lien vers les parties pertinentes de la méthode directement dans vos documents de gouvernance.
- **Adapter** : personnalisez les canevas, les listes de contrôle ou les directives en fonction de vos normes internes.
- **Contribuez** : suggérez de nouvelles directives ou ressources à inclure dans la méthode APIOps Cycles afin que d'autres puissent en bénéficier.

Vous obtenez ainsi un modèle de gouvernance qui combine **vos politiques internes** et **les pratiques APIOps Cycles éprouvées par la communauté**, ce qui facilite leur application par les équipes et leur mise en œuvre par les responsables dans le cadre des livraisons quotidiennes.