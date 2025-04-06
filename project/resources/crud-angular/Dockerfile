# Image de base Node
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source existant
COPY . .

# Installer Angular CLI globalement (v19)
RUN npm install -g @angular/cli@19

# Commande pour démarrer l'application en mode développement
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]