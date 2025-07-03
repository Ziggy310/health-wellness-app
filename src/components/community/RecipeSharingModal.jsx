import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { PostTopic } from '../../utils/types';

const RecipeSharingModal = ({ onClose, onSubmit }) => {
  const { user } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [nutrients, setNutrients] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Predefined symptom and nutrient options
  const symptomOptions = [
    'Hot flashes', 
    'Night sweats', 
    'Sleep disturbances', 
    'Mood changes', 
    'Brain fog',
    'Fatigue', 
    'Joint pain', 
    'Heart palpitations',
    'Inflammation'
  ];
  
  const nutrientOptions = [
    'Calcium', 
    'Magnesium', 
    'Vitamin D', 
    'Omega-3 fatty acids',
    'Iron', 
    'Protein', 
    'Fiber', 
    'Antioxidants',
    'Vitamin E',
    'Vitamin B12',
    'Phytoestrogens',
    'Prebiotics',
    'Probiotics',
    'Healthy fats'
  ];
  
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };
  
  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };
  
  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };
  
  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  const toggleNutrient = (nutrient) => {
    if (nutrients.includes(nutrient)) {
      setNutrients(nutrients.filter(n => n !== nutrient));
    } else {
      setNutrients([...nutrients, nutrient]);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image and not too large (max 5MB)
    if (!file.type.startsWith('image/')) {
      setErrors({...errors, image: 'Please select an image file'});
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors({...errors, image: 'Image must be less than 5MB'});
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setErrors({...errors, image: null});
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!prepTime.trim()) newErrors.prepTime = 'Preparation time is required';
    if (ingredients.filter(i => i.trim()).length < 1) newErrors.ingredients = 'At least one ingredient is required';
    if (!instructions.trim()) newErrors.instructions = 'Instructions are required';
    if (symptoms.length === 0) newErrors.symptoms = 'Please select at least one related symptom';
    if (nutrients.length === 0) newErrors.nutrients = 'Please select at least one key nutrient';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // In a real app, we would upload the image to storage and get a URL
    // For now, we'll use a placeholder if no image was selected
    let imageUrl = '/assets/images/default-recipe.jpg';
    
    if (imageFile) {
      // Mock image upload - in reality, this would be an API call to upload the image
      // and get back a URL
      imageUrl = `/assets/images/recipes/${Date.now()}-${imageFile.name}`;
      // Simulate successful upload
      console.log(`[Mock] Image uploaded to ${imageUrl}`);
    }
    
    const newRecipe = {
      title,
      description,
      image: imageUrl,
      ingredients: ingredients.filter(i => i.trim()),
      instructions,
      prepTime,
      symptoms,
      nutrients
    };
    
    onSubmit(newRecipe);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Share a Recipe</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Recipe Details */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="e.g., Anti-inflammatory Berry Smoothie"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Describe how this recipe helps with menopause symptoms"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preparation Time *
                </label>
                <input
                  type="text"
                  id="prepTime"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className={`w-full border ${errors.prepTime ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="e.g., 15 minutes"
                />
                {errors.prepTime && <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients *
                </label>
                {ingredients.map((ingredient, index) => (
                  <div key={`ingredient-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      className={`flex-grow border ${errors.ingredients ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      disabled={ingredients.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Ingredient
                </button>
                {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions *
                </label>
                <textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className={`w-full border ${errors.instructions ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Step-by-step instructions for preparing this recipe"
                ></textarea>
                {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
              </div>
            </div>
            
            <div>
              {/* Recipe Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Image
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-48">
                      <img 
                        src={imagePreview} 
                        alt="Recipe preview" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="mt-2">
                        <label htmlFor="image-upload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                          Choose Image
                        </label>
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden" 
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>
              
              {/* Symptoms & Nutrients */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Symptoms *
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map(symptom => (
                    <button
                      key={`symptom-${symptom}`}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`text-sm px-3 py-1 rounded-full transition-colors ${
                        symptoms.includes(symptom) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                {errors.symptoms && <p className="text-red-500 text-sm mt-1">{errors.symptoms}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Nutrients *
                </label>
                <div className="flex flex-wrap gap-2">
                  {nutrientOptions.map(nutrient => (
                    <button
                      key={`nutrient-${nutrient}`}
                      type="button"
                      onClick={() => toggleNutrient(nutrient)}
                      className={`text-sm px-3 py-1 rounded-full transition-colors ${
                        nutrients.includes(nutrient) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {nutrient}
                    </button>
                  ))}
                </div>
                {errors.nutrients && <p className="text-red-500 text-sm mt-1">{errors.nutrients}</p>}
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="border-t border-gray-200 mt-6 pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Share Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeSharingModal;