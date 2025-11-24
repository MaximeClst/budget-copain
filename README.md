# BudgetCopain 💰

Application mobile de gestion de budget personnelle développée avec React Native et Expo. BudgetCopain vous aide à suivre vos dépenses, gérer vos revenus et atteindre vos objectifs financiers.

## 📱 Fonctionnalités

### Gestion des transactions

- ✅ Ajout de transactions (dépenses et revenus)
- ✅ Catégorisation automatique des transactions
- ✅ Historique complet de vos mouvements financiers
- ✅ Filtrage par mois et catégorie

### Suivi budgétaire

- 📊 Vue d'ensemble mensuelle de vos finances
- 💵 Suivi des dépenses et revenus par catégorie
- 📈 Visualisation de l'évolution de votre budget
- 🎯 Objectifs financiers personnalisés

### Personnalisation

- 🎨 Onboarding personnalisé selon vos objectifs
- 💳 Support de différentes devises
- 📅 Personnalisation du premier jour de la semaine
- 🔔 Notifications (à venir)

### Abonnements

- 🆓 Plan gratuit disponible
- 💎 Plans premium (mensuel, annuel, lifetime)
- 🎁 Essai gratuit de 7 jours

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI installé globalement (optionnel)
- Un émulateur iOS/Android ou l'application Expo Go sur votre téléphone

### Installation

1. **Cloner le repository** (si applicable)

   ```bash
   git clone <repository-url>
   cd budget-copain
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Démarrer l'application**

   ```bash
   npm start
   # ou
   npx expo start
   ```

4. **Lancer sur une plateforme spécifique**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🛠️ Technologies utilisées

- **React Native** - Framework mobile cross-platform
- **Expo** - Outils et services pour React Native
- **Expo Router** - Navigation basée sur les fichiers
- **TypeScript** - Typage statique
- **React Query (TanStack Query)** - Gestion des données et cache
- **AsyncStorage** - Stockage local persistant
- **Lucide React Native** - Icônes modernes
- **Expo Linear Gradient** - Dégradés visuels

## 📁 Structure du projet

```
budget-copain/
├── app/                    # Routes de l'application (Expo Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── (onboarding)/      # Processus d'onboarding
│   ├── (tabs)/            # Navigation par onglets
│   ├── add-transaction.tsx
│   ├── subscription.tsx
│   └── _layout.tsx        # Layout racine
├── assets/                # Images, icônes, etc.
├── constants/             # Constantes et configurations
│   ├── Colors.ts
│   └── defaultCategories.ts
├── contexts/              # Contextes React
│   └── AppContext.tsx     # État global de l'application
├── types/                 # Définitions TypeScript
│   └── index.ts
└── package.json
```

## 🎯 Objectifs financiers supportés

- 💰 **Économiser** - Mettre de côté pour vos projets
- 📊 **Contrôler** - Suivre où va votre argent
- 📈 **Investir** - Faire fructifier votre argent
- ✨ **Se libérer** - Réduire vos dettes

## 💳 Catégories de dépenses

L'application inclut des catégories prédéfinies :

- 🍔 Alimentation
- 🚗 Transport
- 🏠 Logement
- 🎮 Loisirs
- 🏥 Santé
- 🛍️ Shopping
- ✈️ Voyage
- 📚 Éducation
- 🔧 Services
- 📦 Autres

## 🔧 Scripts disponibles

- `npm start` - Démarre le serveur de développement Expo
- `npm run ios` - Lance l'app sur le simulateur iOS
- `npm run android` - Lance l'app sur l'émulateur Android
- `npm run web` - Lance l'app dans le navigateur
- `npm run lint` - Vérifie le code avec ESLint

## 📝 Configuration

L'application utilise AsyncStorage pour stocker les données localement. Toutes les données sont sauvegardées automatiquement sur l'appareil de l'utilisateur.

## 🎨 Personnalisation

Vous pouvez personnaliser :

- La devise (€, $, £, etc.)
- Le premier jour de la semaine
- Les catégories de dépenses
- Les objectifs financiers

## 📱 Plateformes supportées

- ✅ iOS
- ✅ Android
- ✅ Web

## 🔐 Sécurité

Les données sont stockées localement sur l'appareil de l'utilisateur. Aucune donnée n'est envoyée à des serveurs externes (dans la version actuelle).

## 🚧 Développement

### Architecture

L'application utilise :

- **File-based routing** avec Expo Router
- **Context API** pour la gestion d'état globale
- **React Query** pour la gestion des données et du cache
- **TypeScript** pour la sécurité des types

### Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est privé.

## 👨‍💻 Développement

Développé avec ❤️ en utilisant React Native et Expo.

---

Pour plus d'informations sur Expo, consultez la [documentation Expo](https://docs.expo.dev/).
