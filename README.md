# Mini-Arcade-JS

link : mini-arcade-game.netlify.app

Mini-Arcade-JS rassemble plusieurs mini-jeux web (Flappy Bird, Tic Tac Toe et Fusion Clicker) dans une seule interface arcade, réalisée en HTML, CSS et JavaScript vanilla. La page d’accueil propose un carrousel responsive permettant de prévisualiser chaque jeu avant de le lancer.

## ✨ Fonctionnalités principales
- **Sélecteur de jeux interactif** : navigation au clavier ou via les flèches du carrousel, aperçu visuel et nom du jeu mis à jour dynamiquement.
- **Interface responsive** : mise en page optimisée pour mobile, tablette et desktop avec styles adaptés à chaque breakpoint.
- **En-tête commun** : intégré dynamiquement via `fetch` pour centraliser le logo, la musique et les liens globaux.
- **Mini-jeux intégrés** :
  - *Flappy Bird* : clone avec obstacles aléatoires et score en temps réel.
  - *Tic Tac Toe* : version classique et variante améliorée.
  - *Fusion Clicker* : jeu de clic chronométré avec sélection de durée.

## 🗂️ Structure du projet
```
Mini-Arcade-JS/
├── index.html              # Page d'accueil avec le carrousel de jeux
├── html/                   # Pages individuelles des jeux + header partagé
│   ├── Flappy-Bird.html
│   ├── fusionclicker.html
│   ├── tictactoe.html
│   ├── tictactoeV2.html
│   └── header.html
├── asset/
│   ├── css/                # Styles spécifiques à chaque page/jeu
│   ├── js/                 # Logique des jeux et du carrousel
│   ├── img/                # Visuels utilisés sur l'accueil et dans les jeux
│   └── sound/              # Effets sonores et musique de fond
└── README.md
```

## 🚀 Démarrer le projet
1. **Cloner ou télécharger** ce dépôt sur votre machine.
2. **Lancer un serveur HTTP local** pour éviter les erreurs CORS lors du chargement de `header.html` via `fetch` :
   ```bash
   # depuis la racine du projet
   npx serve            # ou python3 -m http.server 8080
   ```
3. **Ouvrir `index.html`** dans votre navigateur à l’adresse fournie par le serveur (ex. http://localhost:3000).
4. Utilisez les flèches ou le clavier pour choisir un jeu puis cliquez sur **PLAY**.

> 💡 Astuce : si vous ouvrez directement `index.html` via le système de fichiers (`file://`), le header partagé ne pourra pas être chargé pour des raisons de sécurité navigateur.

## 🛠️ Personnalisation et extension
- **Ajouter un jeu** : créez un nouveau fichier HTML/JS/CSS dans les dossiers dédiés puis ajoutez une entrée dans le tableau `games` (`asset/js/index.js`) avec l’image et le lien de votre page.
- **Modifier le style global** : ajustez les variables CSS dans `asset/css/style_index.css` et `asset/css/header.css`.
- **Changer la musique ou les effets** : remplacez les fichiers audio dans `asset/sound/` et mettez à jour les références dans les scripts concernés.

## ✅ Tests et compatibilité
- Testé sur les dernières versions de Chrome et Firefox.
- Conçu pour rester fonctionnel sans animations si l’utilisateur active l’option *prefers-reduced-motion*.
- Aucun build ni dépendance externe obligatoire (hormis un serveur HTTP statique).

## 🧭 Feuille de route suggérée
- Ajouter une indication visuelle du jeu sélectionné dans le carrousel.
- Introduire un système de score global ou de sauvegarde côté client.
- Localiser les textes (FR/EN) et rendre les règles accessibles depuis chaque jeu.

---

Projet réalisé dans le cadre du séminaire 6 – partagez vos retours ou idées d’amélioration ! 🎮
