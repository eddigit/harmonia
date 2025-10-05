import React, { useState } from 'react';

const KnowledgeBase = () => {
  const [activeCategory, setActiveCategory] = useState('solfeggio');

  const categories = {
    solfeggio: {
      title: 'Fréquences Solfège Sacré',
      content: [
        {
          frequency: '174 Hz',
          title: 'Fondations',
          description: 'Soulage la douleur physique et les tensions musculaires. Aide à la libération des énergies bloquées.',
          benefits: ['Soulagement de la douleur', 'Réduction des tensions', 'Libération énergétique']
        },
        {
          frequency: '285 Hz',
          title: 'Régénération',
          description: 'Favorise la régénération cellulaire et la guérison des tissus. Idéale pour la récupération physique.',
          benefits: ['Régénération cellulaire', 'Guérison des tissus', 'Récupération physique']
        },
        {
          frequency: '396 Hz',
          title: 'Libération',
          description: 'Libère la culpabilité et les peurs. Aide à surmonter les obstacles émotionnels et mentaux.',
          benefits: ['Libération des peurs', 'Guérison émotionnelle', 'Dépassement des obstacles']
        },
        {
          frequency: '417 Hz',
          title: 'Changement',
          description: 'Facilite le changement et l\'adaptation. Stimule la créativité et l\'expression personnelle.',
          benefits: ['Facilitation du changement', 'Stimulation créative', 'Expression personnelle']
        },
        {
          frequency: '528 Hz',
          title: 'Transformation',
          description: 'Fréquence de l\'amour inconditionnel. Aide à la guérison émotionnelle profonde et à la transformation spirituelle.',
          benefits: ['Amour inconditionnel', 'Guérison émotionnelle', 'Transformation spirituelle']
        },
        {
          frequency: '639 Hz',
          title: 'Connexion',
          description: 'Améliore les relations interpersonnelles et favorise l\'harmonie dans les connexions sociales.',
          benefits: ['Harmonie relationnelle', 'Communication améliorée', 'Connexions sociales']
        },
        {
          frequency: '741 Hz',
          title: 'Intuition',
          description: 'Développe l\'intuition et l\'expression personnelle. Aide à résoudre les problèmes de manière créative.',
          benefits: ['Développement de l\'intuition', 'Résolution créative', 'Expression personnelle']
        },
        {
          frequency: '852 Hz',
          title: 'Conscience',
          description: 'Éveille l\'intuition spirituelle et favorise le retour à l\'ordre spirituel naturel.',
          benefits: ['Éveil spirituel', 'Intuition développée', 'Ordre spirituel']
        },
        {
          frequency: '963 Hz',
          title: 'Illumination',
          description: 'Active le système énergétique humain et favorise la connexion à la conscience supérieure.',
          benefits: ['Connexion spirituelle', 'Illumination intérieure', 'Conscience supérieure']
        }
      ]
    },
    brainwaves: {
      title: 'Ondes Cérébrales',
      content: [
        {
          frequency: 'Delta (1-3 Hz)',
          title: 'Sommeil Profond',
          description: 'Ondes lentes associées au sommeil profond et à la guérison physique. Favorise la régénération cellulaire.',
          benefits: ['Sommeil réparateur', 'Régénération physique', 'Guérison profonde']
        },
        {
          frequency: 'Theta (4-7 Hz)',
          title: 'Méditation',
          description: 'État de relaxation profonde et de créativité. Favorise l\'apprentissage et la mémorisation.',
          benefits: ['Méditation profonde', 'Créativité augmentée', 'Apprentissage facilité']
        },
        {
          frequency: 'Alpha (8-12 Hz)',
          title: 'Relaxation',
          description: 'État de relaxation éveillée et de calme mental. Idéal pour la méditation légère et la réduction du stress.',
          benefits: ['Relaxation éveillée', 'Réduction du stress', 'Calme mental']
        },
        {
          frequency: 'Beta (16-18 Hz)',
          title: 'Concentration',
          description: 'État d\'alerte et de concentration active. Favorise la productivité et la résolution de problèmes.',
          benefits: ['Concentration accrue', 'Productivité améliorée', 'Résolution de problèmes']
        },
        {
          frequency: 'Gamma (30-100 Hz)',
          title: 'Performance',
          description: 'Ondes associées à la performance cognitive élevée et à la conscience supérieure.',
          benefits: ['Performance cognitive', 'Conscience élargie', 'Clarté mentale']
        }
      ]
    },
    tuning: {
      title: 'Accordages Thérapeutiques',
      content: [
        {
          frequency: '432 Hz',
          title: 'Accordage Naturel',
          description: 'Considéré comme l\'accordage naturel de l\'univers. Favorise la relaxation et l\'harmonie avec la nature.',
          benefits: ['Relaxation profonde', 'Harmonie naturelle', 'Réduction du stress']
        },
        {
          frequency: '440 Hz',
          title: 'Standard Musical',
          description: 'Fréquence de référence standard en musique occidentale. Équilibré pour la majorité des usages.',
          benefits: ['Standard musical', 'Polyvalence', 'Compatibilité générale']
        },
        {
          frequency: '528 Hz',
          title: 'Amour et Guérison',
          description: 'Fréquence associée à l\'amour inconditionnel et à la guérison émotionnelle profonde.',
          benefits: ['Amour inconditionnel', 'Guérison émotionnelle', 'Transformation personnelle']
        }
      ]
    }
  };

  return (
    <aside className="knowledge-base">
      <div className="knowledge-base-header">
        <h3>📚 Base de Connaissances</h3>
      </div>

      <div className="knowledge-categories">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`category-button ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="knowledge-content">
        <h4>{categories[activeCategory].title}</h4>
        <div className="frequency-cards">
          {categories[activeCategory].content.map((item, index) => (
            <div key={index} className="frequency-card">
              <div className="card-header">
                <span className="frequency">{item.frequency}</span>
                <h5>{item.title}</h5>
              </div>
              <p className="description">{item.description}</p>
              <div className="benefits">
                <h6>Bienfaits:</h6>
                <ul>
                  {item.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="knowledge-footer">
        <p>
          💡 <strong>Astuce:</strong> Chaque fréquence a des effets subtils mais puissants.
          Expérimentez et écoutez votre ressenti intérieur.
        </p>
      </div>
    </aside>
  );
};

export default KnowledgeBase;