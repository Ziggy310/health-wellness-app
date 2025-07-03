import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create the context
const HeadsUpContext = createContext();

// Custom hook for using the context
export function useHeadsUpContext() {
  const context = useContext(HeadsUpContext);
  if (!context) {
    throw new Error('useHeadsUpContext must be used within a HeadsUpProvider');
  }
  return context;
}

// Provider component
export function HeadsUpProvider({ children }) {
  // Mock data for contacts - in a real app, this would be fetched from an API
  const [contacts, setContacts] = useState([
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      relationship: 'Partner', 
      email: 'sarah@example.com', 
      isFavorite: true 
    },
    { 
      id: '2', 
      name: 'Michael Chen', 
      relationship: 'Friend', 
      email: 'michael@example.com', 
      isFavorite: false 
    },
    { 
      id: '3', 
      name: 'Emily Rodriguez', 
      relationship: 'Family Member', 
      email: 'emily@example.com', 
      isFavorite: true 
    },
    { 
      id: '4', 
      name: 'Dr. Taylor', 
      relationship: 'Healthcare Provider', 
      email: 'dr.taylor@example.com', 
      isFavorite: false 
    },
  ]);

  // Mock predictions for upcoming menopause symptoms
  const [predictions, setPredictions] = useState({
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Two days from now
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // Six days from now
    predictedSymptoms: ['Hot Flashes', 'Sleep Disturbances', 'Mood Changes'],
    severity: 'moderate'
  });

  // Draft messages storage
  const [messageDrafts, setMessageDrafts] = useState({});

  // Toggle favorite status for a contact
  const toggleFavorite = useCallback((contactId) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFavorite: !contact.isFavorite } 
          : contact
      )
    );
  }, []);

  // Save a draft message for a specific contact
  const saveMessageDraft = useCallback((contactId, messageText) => {
    setMessageDrafts(prevDrafts => ({
      ...prevDrafts,
      [contactId]: messageText
    }));
  }, []);

  // Get a draft message for a specific contact
  const getMessageDraft = useCallback((contactId) => {
    return messageDrafts[contactId] || '';
  }, [messageDrafts]);

  // Send a Heads Up message to a contact
  const sendHeadsUpMessage = useCallback(async (contactId, messageText) => {
    // In a real app, this would make an API call to send the message
    console.log(`Sending message to contact ${contactId}:`, messageText);
    
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clear the draft after sending
        setMessageDrafts(prevDrafts => {
          const newDrafts = { ...prevDrafts };
          delete newDrafts[contactId];
          return newDrafts;
        });
        
        resolve({ success: true });
      }, 1500);
    });
  }, []);

  // Check if the user should be prompted to send Heads Up messages
  const checkForHeadsUpRecommendation = useCallback(async (userId) => {
    // In a real app, this would check the user's symptom history and predictions
    // For this demo, we'll return a static response to show the prompt
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          shouldPrompt: true,
          reason: 'Predicted increase in symptom intensity'
        });
      }, 1000);
    });
  }, []);

  // Context value
  const value = {
    contacts,
    predictions,
    toggleFavorite,
    saveMessageDraft,
    getMessageDraft,
    sendHeadsUpMessage,
    checkForHeadsUpRecommendation
  };

  return <HeadsUpContext.Provider value={value}>{children}</HeadsUpContext.Provider>;
}
