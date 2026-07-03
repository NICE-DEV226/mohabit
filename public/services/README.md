# Images des catégories / services

Une image par catégorie, nommée par l'**identifiant de catégorie** utilisé dans les données produits
(`category` dans `src/data/models.ts`).

```
public/services/
  maison-acier.jpg
  conteneur.jpg
  modulaire.jpg
```

Cette image sert de **visuel par défaut** pour tous les produits de la catégorie tant qu'ils n'ont pas
leurs propres photos (`public/catalogue/<ref>/`). Une seule image couvre donc toute une gamme.

Associées automatiquement au build (`npm run gen:config`).
