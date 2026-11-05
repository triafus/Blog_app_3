# Récapitulatif des modifications et améliorations techniques

Ce document répertorie l'ensemble des actions techniques réalisées sur le projet, les extraits de code associés, ainsi que la justification de chaque changement.

---

## 1. Sécurisation SQL : Correction de la vulnérabilité d'injection SQL

* **Fichier :** `server/controllers/article.controller.js`
* **Pourquoi :** L'ancien code injectait les données saisies par l'utilisateur directement dans la chaîne SQL par template string. Une apostrophe faisait crasher l'application et n'importe quel utilisateur pouvait injecter du code SQL malveillant pour lire ou supprimer la base. L'utilisation d'une **requête préparée** avec des paramètres fictifs (`?`) garantit que MySQL traite les données strictement comme du texte brut et non comme du code exécutable.

### Code avant :
```javascript
const [result] = await pool.query(
    `INSERT INTO articles (title, content, image, user_id) VALUES (${title}, ${content}, ${image}, ${req.userId})`,
);
```

### Code après :
```javascript
const [result] = await pool.query(
    'INSERT INTO articles (title, content, image, user_id) VALUES (?, ?, ?, ?)',
    [title, content, image, req.userId]
);
```

---

## 2. Base de données : Ajout de la table `comments` en auto-provisioning

* **Fichier :** `server/config/db.js`
* **Pourquoi :** Le cahier des charges (Bloc Blanc 3) exige la création de la table `comments` avec suppression en cascade. En intégrant ce DDL dans la fonction `initDB()`, la table est créée automatiquement dès le premier démarrage du serveur sans devoir exécuter de script SQL manuellement.

### Code ajouté :
```javascript
await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);
```

---

## 3. Harmonisation des ports Frontend / Backend (Images & Avatars)

* **Fichiers :** 
  * `client/src/components/ArticleCard.jsx`
  * `client/src/components/Navbar.jsx`
  * `client/src/pages/ArticleDetail.jsx`
  * `client/src/pages/EditArticle.jsx`
  * `client/src/pages/Profile.jsx`
* **Pourquoi :** Le serveur Express écoute sur le port `5030` (`PORT=5030` dans `server/.env`), et Axios appelait bien `http://localhost:5030/api`. Cependant, les balises `<img>` pointaient en dur vers `http://localhost:5000`, ce qui empêchait l'affichage de toutes les images d'articles et avatars uploadés.

### Code avant (exemple ArticleCard.jsx) :
```jsx
src={`http://localhost:5000${article.image}`}
src={`http://localhost:5000${article.avatar}`}
```

### Code après :
```jsx
src={`http://localhost:5030${article.image}`}
src={`http://localhost:5030${article.avatar}`}
```

---

## 4. Robustesse du chargement des variables d'environnement (`.env`)

* **Fichiers :** `server/server.js` et `server/config/db.js`
* **Pourquoi :** `dotenv.config()` cherche par défaut le `.env` dans le dossier où s'exécute la commande. Si le serveur était lancé depuis la racine (`node server/server.js`), le fichier `server/.env` n'était pas trouvé et les variables de base de données étaient vides. Le chemin est désormais résolu de manière absolue.

### Code avant :
```javascript
require('dotenv').config();
```

### Code après :
```javascript
// server/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// server/config/db.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
```

---

## 5. Configuration Git et protection des secrets

* **Fichiers créés :** `.gitignore` et `server/.env.example`
* **Pourquoi :** 
  * Éviter de pousser sur GitHub les dossiers volumineux (`node_modules`, builds `dist/`), les fichiers temporaires et les images uploadées.
  * Protéger les identifiants et clés de chiffrement en ignorant `server/.env`, tout en fournissant un fichier d'exemple `server/.env.example` pour les futurs déploiements.

### Extrait du fichier `.gitignore` :
```gitignore
# Dépendances
node_modules/
*/node_modules/

# Secrets & Environnement
.env
.env.*
!.env.example
server/.env
server/.env.*
!server/.env.example

# Builds
dist/
client/dist/

# Fichiers uploadés par les utilisateurs
server/uploads/*
!server/uploads/.gitkeep
```

---

## 6. Mise en place effective de la base de données (Docker)

* **Conteneur actif :** Le conteneur Docker `mysql:8.0` (`backoop-mysql`) est désormais opérationnel sur le port `3306`.
* **Configuration :** Le mot de passe root (`DB_PASSWORD=root`) a été renseigné dans `server/.env`.
* **Initialisation confirmée :**
  * La base `blog_db` a été créée avec succès.
  * Les tables `users`, `articles` et `comments` sont en place.
  * Le compte administrateur (`admin@blog.com` / `password123`) et les articles de démonstration ont été seedés automatiquement.
