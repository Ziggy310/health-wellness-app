import React, { useState, useEffect } from 'react';
import { useHeadsUpContext } from '../../contexts/HeadsUpContext';
import HeadsUpModal from './HeadsUpModal';

const HeadsUpFeature = () => {
  const { checkForHeadsUpRecommendation, predictions } = useHeadsUpContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for recommendations when component mounts
  useEffect(() => {
    const checkRecommendations = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd use the actual user ID
        const userId = 'current-user';
        const result = await checkForHeadsUpRecommendation(userId);
        
        if (result.shouldPrompt) {
          // Add a small delay to make the prompt feel more natural
          setTimeout(() => {
            setShowPrompt(true);
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRecommendations();
  }, [checkForHeadsUpRecommendation]);

  const openModal = () => {
    setIsModalOpen(true);
    setShowPrompt(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Heads Up Messaging</h2>
          <button
            onClick={openModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
            </svg>
            Send Heads Up
          </button>
        </div>
        
        {/* Description card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Heads Up Messaging</h3>
              <p className="text-gray-600 mb-3">
                Let trusted contacts know when you might be experiencing more intense menopause symptoms. This helps build understanding and support during challenging times.
              </p>
              {isLoading ? (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking predictions...
                </div>
              ) : (
                <button 
                  onClick={openModal}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                >
                  Manage Contacts
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Recommendation alert - shown only when a prediction is available */}
        {showPrompt && predictions && (
          <div className="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-md animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-purple-800">Symptom Intensity Prediction</h3>
                <div className="mt-2 text-sm text-purple-700">
                  <p>
                    We've detected you may experience more intense symptoms in the coming days. Would you like to send a heads up message to your close contacts?
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      onClick={openModal}
                      className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 mx-2 my-1.5"
                    >
                      Send Message
                    </button>
                    <button
                      onClick={dismissPrompt}
                      className="rounded-md bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800 hover:bg-purple-200 mx-2 my-1.5"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heads Up Modal */}
      <HeadsUpModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        predictions={predictions}
      />
    </>
  );
};

export default HeadsUpFeature;
