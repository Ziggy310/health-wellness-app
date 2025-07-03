// src/components/meals/GeneratedMealImage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import useGeneratedImage from '../../hooks/useGeneratedImage';

const GeneratedMealImage = ({ mealName, ingredients, slug, isThumbnail }) => {
  const { imagePath, loading, error } = useGeneratedImage(mealName, ingredients, slug);

  if (loading) {
    return <div className="image-placeholder">Loading...</div>;
  }

  if (error) {
    return <img src="/assets/fallback/coming-soon.jpg" alt="Fallback image" className={isThumbnail ? 'thumbnail' : 'header-image'} />;
  }

  return <img src={imagePath} alt={`${mealName} image`} className={isThumbnail ? 'thumbnail' : 'header-image'} />;
};

GeneratedMealImage.propTypes = {
  mealName: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  slug: PropTypes.string.isRequired,
  isThumbnail: PropTypes.bool,
};

GeneratedMealImage.defaultProps = {
  isThumbnail: false,
};

export default GeneratedMealImage;