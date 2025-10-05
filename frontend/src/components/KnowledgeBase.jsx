import React, { useState } from 'react'
import { X, BookOpen, Heart, Brain, Music, Sparkles } from 'lucide-react'
import { solfeggioFrequencies, brainwaves, notableTunings } from '../data/frequencies'

const KnowledgeBase = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('solfeggio')

  const tabs = [
    { id: 'solfeggio', label: 'Solfège Sacré', icon: Music },
    { id: 'brainwaves', label: 'Ondes Cérébrales', icon: Brain },
    { id: 'tunings', label: 'Accordages', icon: Sparkles },
    { id: 'guide', label: 'Guide Pratique', icon: BookOpen }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-harmonia-purple to-harmonia-blue p-3 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Base de Connaissances</h2>
              <p className="text-gray-600 text-sm">Découvrez les fréquences thérapeutiques</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-harmonia-purple to-harmonia-blue text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {/* Solfeggio Frequencies */}
          {activeTab === 'solfeggio' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-harmonia-purple mb-2">
                  Les Fréquences du Solfège Sacré
                </h3>
                <p className="text-gray-700">
                  Le Solfège Sacré est un ensemble de fréquences sonores anciennes utilisées dans les chants grégoriens. 
                  Ces fréquences sont censées avoir des effets profonds sur la conscience et le corps physique, 
                  favorisant la guérison, la transformation et l'éveil spirituel.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(solfeggioFrequencies).map(([freq, data]) => (
                  <div
                    key={freq}
                    className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-harmonia-purple transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <h4 className="text-lg font-bold text-gray-800">{data.name}</h4>
                    </div>
                    <p className="text-sm font-semibold text-harmonia-purple mb-2">
                      {data.benefits}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brainwaves */}
          {activeTab === 'brainwaves' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-harmonia-blue mb-2">
                  Les Ondes Cérébrales et les Battements Binauraux
                </h3>
                <p className="text-gray-700 mb-3">
                  Les battements binauraux sont créés en présentant deux fréquences légèrement différentes 
                  à chaque oreille. Le cerveau perçoit alors une troisième fréquence (la différence entre les deux), 
                  qui peut induire différents états de conscience.
                </p>
                <p className="text-gray-700">
                  Ces états correspondent aux différents types d'ondes cérébrales que notre cerveau produit naturellement.
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(brainwaves).map(([key, wave]) => (
                  <div
                    key={key}
                    className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-harmonia-blue transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: wave.color }}
                        />
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{wave.name}</h4>
                          <p className="text-sm text-gray-500">{wave.range}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {wave.frequency} Hz
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-harmonia-blue mb-2">
                      {wave.benefits}
                    </p>
                    <p className="text-sm text-gray-600">
                      {wave.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tunings */}
          {activeTab === 'tunings' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-harmonia-purple mb-2">
                  Les Différents Accordages
                </h3>
                <p className="text-gray-700 mb-3">
                  L'accordage de référence (ou diapason) détermine la fréquence de la note La4 (A4). 
                  Cette fréquence influence ensuite toutes les autres notes de la gamme.
                </p>
                <p className="text-gray-700">
                  Différents accordages peuvent avoir des effets différents sur notre perception et notre ressenti de la musique.
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(notableTunings).map(([freq, data]) => (
                  <div
                    key={freq}
                    className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-harmonia-green transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-2xl font-bold text-gray-800">{data.name}</h4>
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                    </div>
                    <p className="text-base font-semibold text-gray-700 mb-2">
                      {data.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data.benefits}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                  <Sparkles size={20} className="mr-2" />
                  Le débat 432 Hz vs 440 Hz
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  Le 440 Hz est devenu le standard international en 1939, mais certains musiciens et thérapeutes 
                  préfèrent le 432 Hz, qu'ils considèrent comme plus harmonieux et aligné avec les fréquences naturelles.
                </p>
                <p className="text-sm text-gray-700">
                  Le 432 Hz est souvent décrit comme plus doux, plus chaud et plus apaisant, 
                  tandis que le 440 Hz est perçu comme plus brillant et plus énergique.
                </p>
              </div>
            </div>
          )}

          {/* Practical Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-harmonia-purple mb-2">
                  Guide Pratique : Comment choisir ?
                </h3>
                <p className="text-gray-700">
                  Voici quelques recommandations pour vous aider à choisir les bonnes fréquences selon votre objectif.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
                    <Heart size={20} className="mr-2" />
                    Pour la Relaxation et le Sommeil
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Fréquences :</strong> 174 Hz, 285 Hz, 528 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Accordage :</strong> 432 Hz pour plus de douceur</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Tempo :</strong> Ralentir de 10-20%</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Binauraux :</strong> Ondes Delta (sommeil) ou Theta (relaxation profonde)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                    <Brain size={20} className="mr-2" />
                    Pour la Concentration et le Travail
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Fréquences :</strong> 741 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Accordage :</strong> 440 Hz (standard) ou 444 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Tempo :</strong> Légèrement accéléré (+5 à +10%)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Binauraux :</strong> Ondes Beta</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                    <Sparkles size={20} className="mr-2" />
                    Pour la Méditation et la Créativité
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Fréquences :</strong> 417 Hz, 528 Hz, 852 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Accordage :</strong> 432 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Tempo :</strong> Légèrement ralenti (-5%)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Binauraux :</strong> Ondes Theta</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-pink-700 mb-3 flex items-center">
                    <Heart size={20} className="mr-2" />
                    Pour l'Éveil Spirituel
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Fréquences :</strong> 741 Hz, 852 Hz, 963 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Accordage :</strong> 432 Hz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Tempo :</strong> Ralenti (-5 à -10%)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Binauraux :</strong> Ondes Theta ou Gamma</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-800 mb-2">💡 Conseil</h4>
                <p className="text-sm text-gray-700">
                  N'hésitez pas à expérimenter ! Les effets des fréquences peuvent varier d'une personne à l'autre. 
                  Écoutez votre ressenti et ajustez les paramètres selon vos préférences personnelles.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBase
