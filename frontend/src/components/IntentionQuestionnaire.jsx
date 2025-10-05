import React, { useState } from 'react'
import { HeartPulse, Sparkles, Zap, Eye, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { intentionQuestions, intentionPresets } from '../data/frequencies'

const iconMap = {
  'heart-pulse': HeartPulse,
  'sparkles': Sparkles,
  'zap': Zap,
  'eye': Eye
}

const IntentionQuestionnaire = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedIntention, setSelectedIntention] = useState(null)

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentStep(2)
  }

  const handleIntentionSelect = (intentionId) => {
    setSelectedIntention(intentionId)
  }

  const handleComplete = () => {
    if (selectedIntention && intentionPresets[selectedIntention]) {
      onComplete({
        category: selectedCategory,
        intentionId: selectedIntention,
        preset: intentionPresets[selectedIntention]
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {currentStep} sur 2
          </span>
          <span className="text-sm text-gray-500">
            {currentStep === 1 ? 'Objectif principal' : 'Affinez votre intention'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-harmonia-purple to-harmonia-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Main Objective */}
      {currentStep === 1 && (
        <div className="card animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
            {intentionQuestions.step1.question}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sélectionnez la catégorie qui correspond le mieux à votre objectif
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {intentionQuestions.step1.options.map((option) => {
              const Icon = iconMap[option.icon]
              return (
                <button
                  key={option.id}
                  onClick={() => handleCategorySelect(option.id)}
                  className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 text-left transition-all duration-300 hover:border-harmonia-purple hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-harmonia-purple to-harmonia-blue p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-harmonia-purple transition-colors">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="absolute bottom-6 right-6 text-harmonia-purple opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </button>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <button onClick={onBack} className="text-gray-600 hover:text-harmonia-purple transition-colors">
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Specific Intention */}
      {currentStep === 2 && selectedCategory && (
        <div className="card animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
            Affinez votre intention
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Choisissez l'intention spécifique qui vous correspond
          </p>

          <div className="space-y-4 mb-8">
            {intentionQuestions.step2[selectedCategory]?.map((option) => {
              const isSelected = selectedIntention === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleIntentionSelect(option.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-harmonia-purple bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-harmonia-purple hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg mb-1 ${
                        isSelected ? 'text-harmonia-purple' : 'text-gray-800'
                      }`}>
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fréquences :</span> {option.freq}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="text-harmonia-purple flex-shrink-0 ml-4" size={28} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Preset Preview */}
          {selectedIntention && intentionPresets[selectedIntention] && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-harmonia-purple">
              <h3 className="font-bold text-harmonia-purple mb-3 flex items-center">
                <Sparkles size={20} className="mr-2" />
                Préréglage suggéré : {intentionPresets[selectedIntention].name}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Fréquences cibles :</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {intentionPresets[selectedIntention].targetFrequencies.join(', ')} Hz
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Accordage :</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {intentionPresets[selectedIntention].tuning} Hz
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Ajustement tempo :</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {intentionPresets[selectedIntention].tempoAdjustment > 0 ? '+' : ''}
                    {intentionPresets[selectedIntention].tempoAdjustment}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Battements binauraux :</span>
                  <span className="ml-2 font-semibold text-gray-800 capitalize">
                    Ondes {intentionPresets[selectedIntention].binauralBeat}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setCurrentStep(1)
                setSelectedIntention(null)
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-harmonia-purple transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>
            
            <button
              onClick={handleComplete}
              disabled={!selectedIntention}
              className={`btn-primary flex items-center space-x-2 ${
                !selectedIntention ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Continuer</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntentionQuestionnaire
