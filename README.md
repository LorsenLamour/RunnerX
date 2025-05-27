# cls411-jeu

Receiver ID: 6BE88BF2

# Version de notre jeu V.7.0.0
# Version de notre react V6.3.0 

# Installation des libs

    npm i

# Exécution local

    npm run dev

# Exécution à distance

Via le html production_index.html qui utilise le bundle généré dans le répertoire **dist**.

# Création du build pour la production avec React & Vite

    npm run build


# Message
J'ai simplifié le code. J'ai mis les informations de niveau dans un fichier JSON, comme le prof nous l'avait conseillé. J'ai eu beaucoup de mal, je rencontrais des bugs à chaque fois. J'ai dû vérifier chaque ligne de code pour voir si j'avais bien importé les informations du fichier JSON. J'ai supprimé des fichiers qui n'étaient pas importants.
J'ai ajouté une fonctionnalité musicale qui permet au joueur d'écouter de la musique pendant qu'il joue.
J'ai aussi corrigé un autre bug qui était très compliqué : quand le joueur appuyait sur "Commencer", les informations de la page du bouton s'affichaient en arrière-plan du jeu. J'ai donc cherché un moyen de cacher cette page une fois que le joueur appuie sur "Start".
J'ai également ajouté un bouton "i" qui permet à l'utilisateur de consulter des informations sur le jeu, comme les contrôles et l'objectif.


# J'ai ajouté le rapport ainsi que le document de conception du jeu dans le répertoire RapportJeu.

# Les fonctionnalités et l'organisation du jeu

Dans le dossier components, il y a toutes les fonctionnalités nécessaires au bon fonctionnement du jeu et qui rendent l’expérience utilisateur satisfaisante.
Chaque component a son propre fichier CSS, situé dans un répertoire nommé componentsCss.

Dans le fichier PixiCanvas.jsx se trouve notre jeu.
Les informations importantes qui distinguent les niveaux du jeu sont dans le répertoire public, dans un dossier nommé levels.
Dans ce répertoire se trouve un fichier JSON level1.json qui stocke les informations importantes permettant de distinguer l’interface de chaque niveau.
On y trouve :

    les obstacles, qui sont les parcours flottants dans les airs sur lesquels le personnage peut se déplacer,

    la position du sprite, qui correspond au point de départ,

    la position des zones mortelles appelées deathzones (ce sont les triangles rouges : lorsque le personnage les touche, il meurt),

    timeLeft, qui indique le temps imparti pour réussir le niveau,

    et enfin, la position des portails, qui annoncent la fin du jeu lorsque le personnage les atteint.

Dans le répertoire public, nous avons également un fichier JSON nommé texture.json, qui contient les mouvements de notre sprite.
Il y a aussi texture.png, qui permet de voir les images de chaque frame du sprite.
On y trouve également portal.png, background.png, ainsi qu’un dossier music contenant la musique utilisée dans le jeu.


Dans le fichier GameOverMessage.jsx, nous avons la fonctionnalité qui permet au joueur de recommencer le jeu s’il meurt.
Cette fonctionnalité réinitialise la position du personnage, le remet à la case départ et réinitialise également le temps.


Dans le fichier CountdownTimer.jsx, nous avons la fonctionnalité qui permet d’afficher le compte à rebours, c’est-à-dire le temps que le joueur a pour réussir le niveau.
S’il n’y parvient pas, il perd.


Dans le fichier BoutonStart.jsx : lorsqu'on exécute le code, une page avec un bouton Commencer s’affiche, permettant à l’utilisateur de démarrer le jeu en cliquant dessus.


Dans le fichier GameMusic.jsx, nous avons la fonctionnalité qui permet d’écouter de la musique pendant que le joueur joue.
Le joueur peut l’arrêter s’il le souhaite.


Dans le fichier GameInfoBtn.jsx, nous avons la fonctionnalité qui permet au joueur de consulter le but, les règles du jeu ainsi que les contrôles.


Pour finir, le fichier VictoryMessage.jsx affiche un message de victoire lorsque le joueur touche le portail.
Il affiche aussi le temps mis pour réussir le niveau.

# Les bugs rencontrés

Notre jeu n'est pas un jeu complet, mais une démo.
Nous aurions aimé en faire davantage, mais chacun a son niveau, et pour aller plus loin ou corriger certains bugs, il nous aurait fallu plus de temps — ce que nous n’avions pas.

Voici les bugs rencontrés dans notre jeu, que nous aimerions pouvoir corriger à l’avenir :

    Premier bug : lorsque le joueur meurt, il peut encore bouger.
    Nous aurions aimé que le sprite disparaisse définitivement et que tout déplacement devienne impossible.

# Améliorations

    Rendre le déplacement plus fluide.

    Ajouter des sons lors des mouvements ou lorsque le personnage meurt.

    Rendre l'interfaces plus beau.

# Sources

PixiJS 
1) https://pixijs.com/ 
Voici l'Url qui m'a aidé à faire les collisions : https://pixijs.com/8.x/examples/advanced/collision-detection

Voici l'url qui m'a aidé à faire App.ticker : 
1) https://pixijs.com/8.x/guides/components/ticker
2) https://pixijs.com/8.x/examples/sprite/texture-swap



