// src/hooks/useGeneratedImage.js
import { useState, useEffect } from 'react';
import ImageGenerationService from '../services/ImageGenerationService';

const useGeneratedImage = (mealName, ingredients, slug) => {
  const [imagePath, setImagePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const savePath = `/data/chats/4gnaud/workspace/react_template/public/assets/generated-meals/${slug}.jpg`;
      try {
        const generatedImagePath = await ImageGenerationService.generateImage(mealName, ingredients, savePath);
        setImagePath(`/assets/generated-meals/${slug}.jpg`);
      } catch (err) {
        console.error('Error generating image:', err);
        setImagePath('/assets/fallback/coming-soon.jpg');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [mealName, ingredients, slug]);

  return { imagePath, loading, error };
};

export default useGeneratedImage;