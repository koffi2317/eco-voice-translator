Eco-Voice TranslatorEco-Voice Translator est une application web innovante qui ne se contente pas de traduire la voix : elle sensibilise l'utilisateur à l'empreinte environnementale du numérique.
L'application permet de traduire du texte ou de la voix en temps réel tout en calculant instantanément la consommation d'eau et les émissions de CO2 générées par l'interaction.

Le projet utilise une architecture Client-Serveur découplée pour garantir performance et sécurité :

*Frontend (Interface Utilisateur) : Déployé sur Vercel. Développé avec React et Vite pour une expérience fluide et réactive.

*Backend (Serveur API) : Déployé sur Render. Développé avec Node.js et Express pour gérer les appels aux API de traduction et sécuriser les clés d'accès.

*Sécurité : Utilisation de variables d'environnement pour protéger les données sensibles et les clés API tierces.

Fonctionnalités Clés:

Traduction Vocale & Textuelle : Utilisation d'algorithmes de pointe pour une traduction rapide.
Calculateur d'Impact Écologique : Analyse de la phrase mot par mot pour estimer la consommation de ressources (Eau et CO2) nécessaire au traitement de la donnée.
Indicateur de Santé du Serveur : Route /api/health intégrée pour vérifier la disponibilité du backend en temps réel.
Interface Adaptative : Design moderne et responsive, optimisé pour une utilisation sur ordinateur et mobile.
