

import type { Language } from '../types';

type Dictionary = Record<string, string>;

const fr: Dictionary = {
  // General
  "app_name": "Galilée OS",
  "loading": "Chargement...",
  "save": "Sauvegarder",
  "cancel": "Annuler",
  "delete": "Supprimer",
  "edit": "Modifier",
  "create": "Créer",
  "back": "Retour",
  "confirm_action": "Êtes-vous sûr ?",
  
  // Auth & Landing
  "login_manual": "Connexion",
  "register_manual": "Inscription",
  "login_google": "Connexion Google",
  "login_init": "Accéder",
  "register_init": "S'inscrire",
  "login_id_placeholder": "ID Utilisateur",
  "email_placeholder": "Email Galilée...",
  "login_welcome": "Bon Retour",
  "register_welcome": "Rejoindre le Réseau",
  "landing_subtitle": "La plateforme de pilotage intégral pour les élèves-ingénieurs de Sup Galilée. Orchestrez vos projets, dopez vos révisions grâce à l'IA et maximisez votre potentiel académique.",
  "landing_cta": "Lancer Session d'Étude",
  "mode_terminal": "Mode : Terminal",
  "mode_student": "Mode : Étudiant",
  "switch_to_register": "Pas de compte ? Créer un accès",
  "switch_to_login": "Déjà un compte ? Se connecter",
  "select_speciality": "Sélectionnez votre Spécialité",

  // Specialities
  "spec_info": "Informatique",
  "spec_energy": "Énergétique",
  "spec_telecom": "Télécoms",
  "spec_instru": "Instrumentation",
  "spec_macs": "MACS",
  "spec_prepa": "Cycle Prépa",

  // Dashboard
  "view_projects": "PROJETS",
  "view_revision": "RÉVISIONS",
  "status_online": "EN LIGNE",
  "status_offline": "HORS LIGNE",
  "deploy_sector": "Déployer Secteur",
  "add_column": "Ajouter Colonne",
  "search_placeholder": "Recherche Protocoles...",
  "filter_tasks": "Filtrer tâches...",
  
  // Task
  "new_protocol": "Nouveau Protocole",
  "config_module": "Configuration Module",
  "priority_low": "BASSE",
  "priority_medium": "MOYENNE",
  "priority_high": "HAUTE",
  "deadline": "Échéance",
  "tags": "Étiquettes",
  "subtasks": "Sous-tâches",
  "ai_assist": "Assistant IA",
  "ai_generating": "Traitement...",
  "blueprint_tab": "Blueprint",
  "generate_blueprint": "Générer Diagramme",
  "blueprint_desc": "Visualisation architecturale générée par IA",
  
  // Flashcards
  "gali_strikes": "Gali Strikes",
  "neural_training": "Entraînement Neuronal",
  "new_deck": "Nouveau Deck",
  "create_deck": "Créer le Deck",
  "deck_config": "Configuration du Deck",
  "deck_title": "Titre (ex: Algèbre)",
  "deck_topic": "Sujet pour l'IA (optionnel)",
  "cards_count": "cartes",
  "question": "Question",
  "answer": "Réponse",
  "reveal": "Cliquer pour révéler",
  "grade_fail": "À revoir",
  "grade_hard": "Difficile",
  "grade_good": "Bien",
  "grade_easy": "Facile",
  "voice_feedback": "Votre réponse",
  "precision": "Précision",
  "export_pdf": "Exporter PDF",
  
  // Timer
  "hyperfocus": "Mode Hyperfocus",
  "alpha_waves": "Ondes Alpha",

  // Gamification
  "rank_novice": "Novice",
  "rank_adept": "Adepte",
  "rank_engineer": "Ingénieur",
  "rank_senior": "Ingénieur Chef",
  "rank_legend": "Légende Galilée",
  "xp_gained": "XP Gagnée",

  // Command
  "cmd_placeholder": "Entrer commande (Ctrl+K)...",
  "cmd_new_task": "Créer Tâche",
  "cmd_new_deck": "Créer Deck",
  "cmd_toggle_theme": "Changer Thème",
  "cmd_toggle_mute": "Couper Son",
};

const en: Dictionary = {
  // General
  "app_name": "Galilée OS",
  "loading": "Loading...",
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "edit": "Edit",
  "create": "Create",
  "back": "Back",
  "confirm_action": "Are you sure?",

  // Auth & Landing
  "login_manual": "Login",
  "register_manual": "Register",
  "login_google": "Google Login",
  "login_init": "Access",
  "register_init": "Sign Up",
  "login_id_placeholder": "User ID",
  "email_placeholder": "Galilée Email...",
  "login_welcome": "Welcome Back",
  "register_welcome": "Join the Network",
  "landing_subtitle": "The comprehensive command center for Sup Galilée engineering students. Orchestrate projects, boost revisions with AI, and maximize your academic potential.",
  "landing_cta": "Start Study Session",
  "mode_terminal": "Mode: Terminal",
  "mode_student": "Mode: Student",
  "switch_to_register": "No account? Create access",
  "switch_to_login": "Already have an account? Login",
  "select_speciality": "Select your Major",

  // Specialities
  "spec_info": "Computer Science",
  "spec_energy": "Energetics",
  "spec_telecom": "Telecoms",
  "spec_instru": "Instrumentation",
  "spec_macs": "Applied Maths",
  "spec_prepa": "Preparatory Cycle",

  // Dashboard
  "view_projects": "PROJECTS",
  "view_revision": "REVISION",
  "status_online": "ONLINE",
  "status_offline": "OFFLINE",
  "deploy_sector": "Deploy Sector",
  "add_column": "Add Column",
  "search_placeholder": "Search Protocols...",
  "filter_tasks": "Filter tasks...",

  // Task
  "new_protocol": "New Protocol",
  "config_module": "Module Config",
  "priority_low": "LOW",
  "priority_medium": "MEDIUM",
  "priority_high": "HIGH",
  "deadline": "Deadline",
  "tags": "Tags",
  "subtasks": "Subtasks",
  "ai_assist": "AI Assistant",
  "ai_generating": "Processing...",
  "blueprint_tab": "Blueprint",
  "generate_blueprint": "Generate Diagram",
  "blueprint_desc": "AI Generated architectural visualization",

  // Flashcards
  "gali_strikes": "Gali Strikes",
  "neural_training": "Neural Training",
  "new_deck": "New Deck",
  "create_deck": "Create Deck",
  "deck_config": "Deck Configuration",
  "deck_title": "Title (e.g., Algebra)",
  "deck_topic": "AI Topic (Optional)",
  "cards_count": "cards",
  "question": "Question",
  "answer": "Answer",
  "reveal": "Click to reveal",
  "grade_fail": "Again",
  "grade_hard": "Hard",
  "grade_good": "Good",
  "grade_easy": "Easy",
  "voice_feedback": "Your answer",
  "precision": "Accuracy",
  "export_pdf": "Export PDF",

  // Timer
  "hyperfocus": "Hyperfocus Mode",
  "alpha_waves": "Alpha Waves",

  // Gamification
  "rank_novice": "Novice",
  "rank_adept": "Adept",
  "rank_engineer": "Engineer",
  "rank_senior": "Senior Engineer",
  "rank_legend": "Galilée Legend",
  "xp_gained": "XP Gained",

  // Command
  "cmd_placeholder": "Enter command (Ctrl+K)...",
  "cmd_new_task": "Create Task",
  "cmd_new_deck": "Create Deck",
  "cmd_toggle_theme": "Toggle Theme",
  "cmd_toggle_mute": "Toggle Mute",
};

export const getTranslation = (lang: Language, key: string): string => {
  return (lang === 'fr' ? fr[key] : en[key]) || key;
};