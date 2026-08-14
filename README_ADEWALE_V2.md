# ADEWALE V2 — mise en ligne GitHub + Cloudflare Pages

## Structure
- index.html
- savoir.html
- lecture.html
- temoignages.html
- consultation.html
- assets/css/style.css
- assets/js/main.js
- assets/models/opon.glb (à remettre depuis ton projet actuel si tu l'as)
- assets/images/ (tes images peuvent être remises ici)

## Important
La page d'accueil contient un plateau 3D de secours construit en Three.js. Si `assets/models/opon.glb` est présent, il est chargé automatiquement et remplace le plateau de secours.

## Déploiement
1. Remplace les anciens fichiers par ceux de ce dossier dans ton dépôt GitHub.
2. Remets ton fichier `assets/models/opon.glb` dans le même chemin.
3. Si tu utilises des images personnalisées, remets-les dans `assets/images/`.
4. Commit + push.
5. Cloudflare Pages reconstruira automatiquement le site si ton projet est déjà relié au dépôt.

## Consultation
Le formulaire actuel valide et affiche une confirmation côté navigateur, mais ne transmet pas encore réellement les données. Il faut connecter l'envoi à ton service de formulaire ou à un backend/Cloudflare adapté avant de l'utiliser pour de vraies demandes.

## À personnaliser
- téléphone et e-mail dans le footer
- liens sociaux
- contenus exacts des Odù et témoignages
- branchement réel du formulaire de consultation
