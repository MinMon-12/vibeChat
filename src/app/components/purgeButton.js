import axios from 'axios';
import React from 'react';

/**
 * PurgeButton Component
 * 
 * This button allows the user to purge (delete) all messages in their conversation.
 * After successful purge, it clears the conversation from the UI.
 * 
 * Props:
 *  - setResponses: Function to update the 'responses' state (current messages)
 */
const PurgeButton = ({ setResponses,className }) => {
  
  // Event handler triggered when the button is clicked
  const handlePurge = async () => {
    try {
      // Send DELETE request to the /api/purge endpoint
      const response = await axios.delete('/api/purge');
      
      // If the server confirms the purge was successful
      if (response.data.success) {
        console.log(response.data); // Log the response for debugging
        
        // Clear the conversation arrays in the frontend state
        setResponses([]);
        
        // Alert the user with how many messages were deleted
        alert(`Conversation purged! Deleted ${response.data.deletedCount} messages.`);
      }
    } catch (error) {
      // If the request fails, log the error and notify the user
      console.error('Failed to purge conversation:', error);
      alert('Failed to purge conversation.');
    }
  };

  return (
    <button type="button" onClick={handlePurge} className={`${className} "absolute top-2 right-2 z-20 bg-stone-50 text-white px-1 py-1 mt-2 rounded-full hover:bg-red-500"`}>
        <img className="w-[18px] h-[20px]" src="/assets/Trash.png"></img>
    </button>
  );
};

export default PurgeButton;