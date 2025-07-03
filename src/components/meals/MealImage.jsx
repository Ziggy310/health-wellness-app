import { useEffect, useState } from 'react';

const MealImage = ({ mealName, mealSlug }) => {
  const [imageSrc, setImageSrc] = useState(`/assets/generated-meals/${mealSlug}.jpg`);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageSrc(`/assets/generated-meals/${mealSlug}.jpg`);
    img.onerror = () => {
      console.warn(`Image not found for ${mealSlug}, using fallback.`);
      setImageSrc('/assets/fallback/coming-soon.jpg');
      setError(true);
    };
    img.src = `/assets/generated-meals/${mealSlug}.jpg`;
  }, [mealSlug]);

  return (
    <img
      src={imageSrc}
      alt={mealName}
      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
    />
  );
};

export default MealImage;