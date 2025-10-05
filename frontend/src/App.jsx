import React, { useState } from 'react'
import { Music, Sparkles, Info } from 'lucide-react'
import HomePage from './components/HomePage'
import IntentionQuestionnaire from './components/IntentionQuestionnaire'
import ControlPanel from './components/ControlPanel'
import KnowledgeBase from './components/KnowledgeBase'

function App() {
  const [currentStep, setCurrentStep] = useState('home') // home, questionnaire, control, knowledge
  const [uploadedFile, setUploadedFile] = useState(null)
  const [intention, setIntention] = useState(null)
  const [showKnowledge, setShowKnowledge] = useState(false)

  const handleFileUpload = (file) => {
    setUploadedFile(file)
    setCurrentStep('questionnaire')
  }

  const handleIntentionComplete = (intentionData) => {
    setIntention(intentionData)
    setCurrentStep('control')
  }

  const handleReset = () => {
    setCurrentStep('home')
    setUploadedFile(null)
    setIntention(null)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-br from-harmonia-purple to-harmonia-blue p-2 rounded-lg">
              <Music className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-harmonia-purple to-harmonia-blue bg-clip-text text-transparent">
                Harmonia
              </h1>
              <p className="text-xs text-gray-500">Fréquences Thérapeutiques</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowKnowledge(!showKnowledge)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all"
          >
            <Info size={20} className="text-harmonia-purple" />
            <span className="font-medium text-harmonia-purple">Base de connaissances</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showKnowledge ? (
          <KnowledgeBase onClose={() => setShowKnowledge(false)} />
        ) : (
          <>
            {currentStep === 'home' && (
              <HomePage onFileUpload={handleFileUpload} />
            )}
            
            {currentStep === 'questionnaire' && (
              <IntentionQuestionnaire
                onComplete={handleIntentionComplete}
                onBack={handleReset}
              />
            )}
            
            {currentStep === 'control' && (
              <ControlPanel
                file={uploadedFile}
                intention={intention}
                onBack={() => setCurrentStep('questionnaire')}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-60 backdrop-blur-sm mt-16 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles size={16} className="text-harmonia-purple" />
            <p className="text-sm">
              Harmonia - Transformez votre musique avec des fréquences thérapeutiques
            </p>
          </div>
          <p className="text-xs text-gray-500">
            © 2025 Harmonia. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
