#!/bin/bash

# Script de démarrage pour Harmonia
echo "🚀 Démarrage d'Harmonia - Application de Transformation Audio Thérapeutique"
echo "================================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Python 3 est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Créer les dossiers nécessaires pour le backend
echo "📁 Création des dossiers nécessaires..."
mkdir -p harmonia-backend/uploads
mkdir -p harmonia-backend/outputs

# Installer les dépendances du backend
echo "📦 Installation des dépendances du backend..."
cd harmonia-backend
npm install
cd ..

# Installer les dépendances du frontend
echo "📦 Installation des dépendances du frontend..."
cd harmonia-frontend
npm install
cd ..

# Installer les dépendances Python (si venv existe)
if [ -d "harmonia-audio-processor/venv" ]; then
    echo "🐍 Installation des dépendances Python..."
    cd harmonia-audio-processor
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo ""
echo "🎵 Harmonia est prêt à démarrer!"
echo ""
echo "Pour démarrer l'application complète:"
echo "1. Ouvrez un terminal et exécutez: cd harmonia-backend && npm start"
echo "2. Ouvrez un autre terminal et exécutez: cd harmonia-frontend && npm start"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend:  http://localhost:3001"
echo ""
echo "Bonne création musicale thérapeutique! 🎵✨"