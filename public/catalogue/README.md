# Images des produits

Déposez les photos d'un produit dans un dossier nommé par sa **référence** (minuscule = slug).

```
public/catalogue/
  dq103/
    1.jpg      ← 1ʳᵉ image = photo principale (carte + fiche)
    2.jpg
    3.jpg
  dq104/
    1.jpg
```

Formats : jpg, jpeg, png, webp, avif, gif. Tri par nom de fichier (préfixez `1-`, `2-`… pour ordonner).

Elles sont associées automatiquement au build (`npm run gen:config`, lancé avant `dev`/`build`). Aucun code à toucher.

Sans photo pour un produit, on retombe sur l'image de sa catégorie (`public/services/<catégorie>.jpg`), puis sur un placeholder.
