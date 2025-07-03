// scripts/create_meal_images.js

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { execSync } = require('child_process');

// Ensure the meal images directory exists
const mealImagesDir = path.join(__dirname, '../public/assets/images/meals');
const realMealImagesDir = path.join(mealImagesDir, 'real');

// Create directories if they don't exist
if (!fs.existsSync(realMealImagesDir)) {
  fs.mkdirSync(realMealImagesDir, { recursive: true });
  console.log(`Created directory: ${realMealImagesDir}`);
}

// Common meal names in our application
const mealsByType = {
  breakfast: [
    'Greek Yogurt with Berries and Flaxseeds',
    'Avocado Toast with Egg',
    'Oatmeal with Fruits and Nuts',
    'Spinach and Feta Omelette',
    'Whole Grain Pancakes with Berries'
  ],
  lunch: [
    'Mediterranean Quinoa Salad',
    'Grilled Chicken Wrap',
    'Lentil Soup with Whole Grain Bread',
    'Salmon Poke Bowl',
    'Chickpea and Vegetable Stir Fry'
  ],
  dinner: [
    'Baked Salmon with Roasted Vegetables',
    'Grilled Chicken with Sweet Potato and Broccoli',
    'Vegetarian Chili with Brown Rice',
    'Turkey and Vegetable Meatballs with Zucchini Noodles',
    'Stuffed Bell Peppers with Lean Ground Turkey'
  ],
  snack: [
    'Apple Slices with Almond Butter',
    'Mixed Nuts and Dried Fruits',
    'Carrot Sticks with Hummus',
    'Greek Yogurt with Honey',
    'Hard-Boiled Eggs'
  ]
};

// Generate image for each meal
async function generateAllMealImages() {
  console.log('Starting meal image generation...');
  
  // Process each meal type
  for (const [type, meals] of Object.entries(mealsByType)) {
    console.log(`\nProcessing ${type} meals...`);
    
    for (const meal of meals) {
      await generateMealImage(meal, type);
      await generateMealImageLarge(meal, type);
    }
  }
  
  console.log('\nMeal image generation completed!');
}

// Generate regular meal image
async function generateMealImage(mealName, mealType) {
  const safeFilename = mealName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const outputPath = path.join(realMealImagesDir, `${safeFilename}.jpg`);
  
  console.log(`Generating image for ${mealName}...`);
  
  try {
    // Use appropriate search term based on meal type
    let searchTerm;
    switch(mealType) {
      case 'breakfast':
        searchTerm = `Healthy ${mealName}, breakfast food photography, appetizing morning meal`;
        break;
      case 'lunch':
        searchTerm = `Healthy ${mealName}, lunch food photography, nutritious midday meal`;
        break;
      case 'dinner':
        searchTerm = `Healthy ${mealName}, dinner food photography, nutritious evening meal`;
        break;
      case 'snack':
        searchTerm = `Healthy ${mealName}, snack food photography, nutritious small bite`;
        break;
      default:
        searchTerm = `Healthy ${mealName}, food photography, nutritious meal`;
    }
    
    // Use ImageGetter to generate the image
    const relativePath = await ImageGetter.get(
      searchTerm,
      path.resolve(outputPath),
      "search"
    );
    
    console.log(`Generated image for ${mealName}: ${relativePath}`);
    return relativePath;
  } catch (error) {
    console.error(`Failed to generate image for ${mealName}:`, error);
    return createFallbackImage(mealName, mealType, outputPath, false);
  }
}

// Generate large meal image for detail view
async function generateMealImageLarge(mealName, mealType) {
  const safeFilename = mealName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const outputPath = path.join(realMealImagesDir, `${safeFilename}-large.jpg`);
  
  console.log(`Generating large image for ${mealName}...`);
  
  try {
    // Use more detailed search term for large images
    let searchTerm = `Professional food photography of ${mealName}, gourmet meal, overhead view, beautiful plating, high resolution`;
    
    // Use ImageGetter to generate the image
    const relativePath = await ImageGetter.get(
      searchTerm,
      path.resolve(outputPath),
      "search"
    );
    
    console.log(`Generated large image for ${mealName}: ${relativePath}`);
    return relativePath;
  } catch (error) {
    console.error(`Failed to generate large image for ${mealName}:`, error);
    return createFallbackImage(mealName, mealType, outputPath, true);
  }
}

// Create a fallback image using canvas if ImageGetter fails
function createFallbackImage(mealName, mealType, outputPath, isLarge) {
  try {
    const width = isLarge ? 800 : 400;
    const height = isLarge ? 600 : 300;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Set background color based on meal type
    let bgColor;
    switch(mealType) {
      case 'breakfast': bgColor = '#FFF7E6'; break; // Light yellow
      case 'lunch': bgColor = '#F0F7FF'; break;     // Light blue
      case 'dinner': bgColor = '#F5F0FF'; break;    // Light purple
      case 'snack': bgColor = '#F0FFF0'; break;     // Light green
      default: bgColor = '#F8F8F8';                 // Light gray
    }
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add meal name
    ctx.fillStyle = '#333333';
    ctx.font = isLarge ? 'bold 32px Arial' : 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Handle long meal names by wrapping text
    const words = mealName.split(' ');
    let line = '';
    let y = height / 2 - (isLarge ? 40 : 20);
    const lineHeight = isLarge ? 40 : 30;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      if (i > 0 && ctx.measureText(testLine).width > width - 40) {
        ctx.fillText(line, width / 2, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);
    
    // Add meal type label
    ctx.fillStyle = '#666666';
    ctx.font = isLarge ? '24px Arial' : '18px Arial';
    ctx.fillText(mealType.charAt(0).toUpperCase() + mealType.slice(1), width / 2, y + lineHeight + 20);
    
    // Add decorative elements based on meal type
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    
    // Different border styles for each meal type
    switch(mealType) {
      case 'breakfast':
        // Sunrise-like arc
        ctx.beginPath();
        ctx.arc(width / 2, height - 50, width / 3, Math.PI, 0);
        ctx.stroke();
        break;
      case 'lunch':
        // Diamond pattern
        ctx.beginPath();
        ctx.moveTo(width / 2, 50);
        ctx.lineTo(width - 50, height / 2);
        ctx.lineTo(width / 2, height - 50);
        ctx.lineTo(50, height / 2);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'dinner':
        // Double border frame
        ctx.strokeRect(30, 30, width - 60, height - 60);
        ctx.strokeRect(20, 20, width - 40, height - 40);
        break;
      case 'snack':
        // Dotted circle
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 3, 0, Math.PI * 2);
        ctx.setLineDash([5, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
      default:
        // Simple border
        ctx.strokeRect(10, 10, width - 20, height - 20);
    }
    
    // Save image to file
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Created fallback image for ${mealName} at ${outputPath}`);
    
    // Return the path relative to public folder
    return `/assets/images/meals/real/${path.basename(outputPath)}`;
  } catch (error) {
    console.error(`Failed to create fallback image for ${mealName}:`, error);
    return isLarge ? '/assets/images/meals/placeholder-meal-large.jpg' : '/assets/images/meals/placeholder-meal.jpg';
  }
}

// Run the generation
generateAllMealImages().catch(console.error);