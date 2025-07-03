import React, { useState, useEffect } from 'react';
import { useHeadsUpContext } from '../../contexts/HeadsUpContext';
import HeadsUpContact from './HeadsUpContact';

const HeadsUpModal = ({ isOpen, onClose, predictions }) => {
  const { 
    contacts, 
    saveMessageDraft, 
    getMessageDraft, 
    sendHeadsUpMessage 
  } = useHeadsUpContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Filter contacts based on search term
  useEffect(() => {
    const filtered = contacts.filter(contact => {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.relationship.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower)
      );
    });
    
    // Sort by favorites first
    filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
    
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  // Load draft message when contact is selected
  useEffect(() => {
    if (selectedContact) {
      const draftMessage = getMessageDraft(selectedContact.id);
      setMessage(draftMessage || createDefaultMessage());
    }
  }, [selectedContact, getMessageDraft]);

  // Save draft message when it changes
  useEffect(() => {
    if (selectedContact && message) {
      saveMessageDraft(selectedContact.id, message);
    }
  }, [selectedContact, message, saveMessageDraft]);

  const createDefaultMessage = () => {
    if (!predictions) return '';
    
    const startDate = new Date(predictions.startDate).toLocaleDateString();
    const endDate = new Date(predictions.endDate).toLocaleDateString();
    
    return `Hi,\n\nI wanted to let you know that I might be experiencing more intense menopause symptoms from ${startDate} to ${endDate}. My symptoms may include ${predictions.predictedSymptoms.join(', ')}.\n\nI appreciate your understanding and support during this time.\n\nThanks,\n[Your Name]`;
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !message.trim()) return;
    
    setSendingMessage(true);
    
    try {
      const result = await sendHeadsUpMessage(selectedContact.id, message);
      
      if (result.success) {
        setMessageSent(true);
        // Reset message after a short delay
        setTimeout(() => {
          setMessageSent(false);
          setMessage('');
          setSelectedContact(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {selectedContact ? 'Send Heads Up Message' : 'Select Contact'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-purple-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedContact ? (
            <div className="p-4">
              {/* Selected contact info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <span className="text-purple-700 font-bold text-lg">{selectedContact.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContact.relationship}</p>
                </div>
              </div>
              
              {/* Message form */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Write your message here..."
                  disabled={sendingMessage || messageSent}
                ></textarea>
              </div>
              
              {/* Action buttons */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center"
                  disabled={sendingMessage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-2 rounded-md font-medium flex items-center ${messageSent
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  disabled={sendingMessage || messageSent || !message.trim()}
                >
                  {messageSent ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Sent!
                    </>
                  ) : sendingMessage ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Search input */}
              <div className="p-4 border-b">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Contacts list */}
              <div>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <HeadsUpContact 
                      key={contact.id}
                      contact={contact}
                      onSelect={handleContactSelect}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No contacts matching your search' : 'No contacts found'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadsUpModal;
