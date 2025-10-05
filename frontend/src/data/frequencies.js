// Therapeutic Frequencies Database based on Solfège and Brainwaves

export const solfeggioFrequencies = {
  174: {
    name: "174 Hz",
    category: "Solfège Sacré",
    benefits: "Soulagement de la douleur physique, anesthésiant naturel",
    description: "Fréquence de base du Solfège, agit comme un anesthésiant naturel pour soulager la douleur.",
    color: "#e74c3c"
  },
  285: {
    name: "285 Hz",
    category: "Solfège Sacré",
    benefits: "Régénération cellulaire, guérison des tissus",
    description: "Favorise la régénération des tissus et des organes, aide à la guérison.",
    color: "#e67e22"
  },
  396: {
    name: "396 Hz - UT",
    category: "Solfège Sacré",
    benefits: "Libération de la peur et de la culpabilité",
    description: "Libère les sentiments de culpabilité et de peur, ancre dans la réalité.",
    color: "#f39c12"
  },
  417: {
    name: "417 Hz - RE",
    category: "Solfège Sacré",
    benefits: "Facilitation du changement, créativité",
    description: "Nettoie les expériences traumatisantes, facilite le changement et la créativité.",
    color: "#f1c40f"
  },
  528: {
    name: "528 Hz - MI",
    category: "Solfège Sacré",
    benefits: "Transformation, réparation ADN, amour",
    description: "Fréquence des miracles, réparation de l'ADN, transformation et amour inconditionnel.",
    color: "#2ecc71"
  },
  639: {
    name: "639 Hz - FA",
    category: "Solfège Sacré",
    benefits: "Harmonisation des relations, connexion",
    description: "Améliore la communication, la compréhension et l'harmonie dans les relations.",
    color: "#3498db"
  },
  741: {
    name: "741 Hz - SOL",
    category: "Solfège Sacré",
    benefits: "Expression, intuition, éveil",
    description: "Nettoie les cellules des toxines, éveille l'intuition et l'expression de soi.",
    color: "#9b59b6"
  },
  852: {
    name: "852 Hz - LA",
    category: "Solfège Sacré",
    benefits: "Vision spirituelle, retour à l'ordre spirituel",
    description: "Éveille l'intuition, permet de voir à travers les illusions de la vie.",
    color: "#8e44ad"
  },
  963: {
    name: "963 Hz - SI",
    category: "Solfège Sacré",
    benefits: "Conscience universelle, éveil spirituel",
    description: "Fréquence de la glande pinéale, connexion à la conscience universelle.",
    color: "#6c3483"
  }
}

export const brainwaves = {
  delta: {
    name: "Ondes Delta",
    range: "0.5 - 4 Hz",
    frequency: 2,
    benefits: "Sommeil profond, régénération, guérison",
    description: "Ondes du sommeil profond sans rêve, favorisent la guérison et la régénération.",
    color: "#34495e",
    recommendedFor: ["sleep", "healing", "recovery"]
  },
  theta: {
    name: "Ondes Theta",
    range: "4 - 8 Hz",
    frequency: 6,
    benefits: "Méditation profonde, créativité, intuition",
    description: "État de méditation profonde, accès au subconscient, créativité accrue.",
    color: "#16a085",
    recommendedFor: ["meditation", "creativity", "spiritual"]
  },
  alpha: {
    name: "Ondes Alpha",
    range: "8 - 14 Hz",
    frequency: 10,
    benefits: "Relaxation éveillée, réduction du stress",
    description: "État de relaxation consciente, réduction du stress et de l'anxiété.",
    color: "#27ae60",
    recommendedFor: ["relaxation", "stress-reduction", "balance"]
  },
  beta: {
    name: "Ondes Beta",
    range: "14 - 30 Hz",
    frequency: 18,
    benefits: "Concentration, éveil, performance cognitive",
    description: "État d'éveil normal, concentration et performance cognitive.",
    color: "#2980b9",
    recommendedFor: ["focus", "concentration", "work"]
  },
  gamma: {
    name: "Ondes Gamma",
    range: "30 - 100 Hz",
    frequency: 40,
    benefits: "Conscience supérieure, apprentissage, euphorie",
    description: "Haute activité mentale, apprentissage rapide, états de conscience élevés.",
    color: "#8e44ad",
    recommendedFor: ["learning", "euphoria", "high-consciousness"]
  }
}

export const notableTunings = {
  432: {
    name: "432 Hz",
    description: "Accordage naturel, en harmonie avec l'univers",
    benefits: "Ressenti plus naturel et apaisant, harmonie avec les fréquences de la nature",
    color: "#16a085"
  },
  440: {
    name: "440 Hz",
    description: "Accordage standard moderne (LA4)",
    benefits: "Standard international depuis 1939",
    color: "#7f8c8d"
  },
  444: {
    name: "444 Hz",
    description: "Accordage permettant d'obtenir 528 Hz pour le Do",
    benefits: "Basé sur la fréquence de l'amour (528 Hz)",
    color: "#2ecc71"
  }
}

export const intentionPresets = {
  "healing-pain": {
    name: "Soulagement de la douleur",
    targetFrequencies: [174],
    tuning: 432,
    tempoAdjustment: -15,
    binauralBeat: "delta",
    description: "Configuration pour soulager la douleur physique"
  },
  "healing-regeneration": {
    name: "Régénération cellulaire",
    targetFrequencies: [285],
    tuning: 432,
    tempoAdjustment: -10,
    binauralBeat: "delta",
    description: "Favorise la régénération et la guérison"
  },
  "healing-sleep": {
    name: "Sommeil profond",
    targetFrequencies: [174, 285],
    tuning: 432,
    tempoAdjustment: -20,
    binauralBeat: "delta",
    description: "Pour un sommeil profond et réparateur"
  },
  "wellbeing-fear": {
    name: "Libération des peurs",
    targetFrequencies: [396],
    tuning: 432,
    tempoAdjustment: -5,
    binauralBeat: "alpha",
    description: "Libère la peur et la culpabilité"
  },
  "wellbeing-relationships": {
    name: "Harmonie relationnelle",
    targetFrequencies: [639],
    tuning: 432,
    tempoAdjustment: 0,
    binauralBeat: "alpha",
    description: "Améliore les relations et la communication"
  },
  "wellbeing-relaxation": {
    name: "Relaxation consciente",
    targetFrequencies: [528],
    tuning: 432,
    tempoAdjustment: -10,
    binauralBeat: "alpha",
    description: "Détente profonde tout en restant éveillé"
  },
  "wellbeing-stress": {
    name: "Réduction du stress",
    targetFrequencies: [528, 639],
    tuning: 432,
    tempoAdjustment: -10,
    binauralBeat: "theta",
    description: "Réduit le stress et l'anxiété"
  },
  "energy-focus": {
    name: "Concentration intense",
    targetFrequencies: [741],
    tuning: 440,
    tempoAdjustment: 5,
    binauralBeat: "beta",
    description: "Améliore la concentration pour le travail"
  },
  "energy-creativity": {
    name: "Stimulation créative",
    targetFrequencies: [417],
    tuning: 432,
    tempoAdjustment: 0,
    binauralBeat: "theta",
    description: "Booste la créativité et l'inspiration"
  },
  "energy-euphoria": {
    name: "Euphorie et joie",
    targetFrequencies: [528],
    tuning: 444,
    tempoAdjustment: 10,
    binauralBeat: "gamma",
    description: "Génère des sentiments de joie et d'euphorie"
  },
  "spiritual-intuition": {
    name: "Développement de l'intuition",
    targetFrequencies: [741, 852],
    tuning: 432,
    tempoAdjustment: -5,
    binauralBeat: "theta",
    description: "Éveille l'intuition et la perception"
  },
  "spiritual-consciousness": {
    name: "Conscience supérieure",
    targetFrequencies: [963],
    tuning: 432,
    tempoAdjustment: -10,
    binauralBeat: "gamma",
    description: "Connexion à la conscience universelle"
  }
}

export const intentionQuestions = {
  step1: {
    question: "Quel est votre objectif principal ?",
    options: [
      {
        id: "healing",
        label: "Guérison et Récupération",
        description: "Pour le sommeil, la relaxation profonde, la récupération physique",
        icon: "heart-pulse"
      },
      {
        id: "wellbeing",
        label: "Bien-être et Équilibre",
        description: "Pour la méditation, la réduction du stress, l'harmonie relationnelle",
        icon: "sparkles"
      },
      {
        id: "energy",
        label: "Énergie et Motivation",
        description: "Pour la concentration, la créativité, l'euphorie, la performance",
        icon: "zap"
      },
      {
        id: "spiritual",
        label: "Exploration Spirituelle",
        description: "Pour l'éveil de l'intuition, la connexion à la conscience supérieure",
        icon: "eye"
      }
    ]
  },
  step2: {
    healing: [
      { id: "healing-pain", label: "Soulager une douleur physique", freq: "174 Hz" },
      { id: "healing-regeneration", label: "Favoriser la régénération cellulaire", freq: "285 Hz" },
      { id: "healing-sleep", label: "Obtenir un sommeil profond et réparateur", freq: "Ondes Delta, 174-285 Hz" }
    ],
    wellbeing: [
      { id: "wellbeing-fear", label: "Libérer des peurs ou de la culpabilité", freq: "396 Hz" },
      { id: "wellbeing-relationships", label: "Harmoniser mes relations", freq: "639 Hz" },
      { id: "wellbeing-relaxation", label: "Me sentir relaxé mais éveillé", freq: "Ondes Alpha, 432 Hz" },
      { id: "wellbeing-stress", label: "Réduire le stress et l'anxiété", freq: "528 Hz, Ondes Theta" }
    ],
    energy: [
      { id: "energy-focus", label: "Augmenter ma concentration pour travailler/étudier", freq: "Ondes Beta, 16-18 Hz" },
      { id: "energy-creativity", label: "Stimuler ma créativité", freq: "417 Hz, Ondes Theta" },
      { id: "energy-euphoria", label: "Ressentir de l'euphorie et de la joie", freq: "528 Hz, Ondes Gamma" }
    ],
    spiritual: [
      { id: "spiritual-intuition", label: "Développer mon intuition", freq: "741 Hz, 852 Hz" },
      { id: "spiritual-consciousness", label: "Me connecter à une conscience supérieure", freq: "963 Hz" }
    ]
  }
}
