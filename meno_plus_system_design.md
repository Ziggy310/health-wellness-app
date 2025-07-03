# Meno+ System Design

## Implementation approach

Based on the comprehensive Meno+ PRD, we will design a scalable, secure, and emotionally supportive web application focused on personalized menopause nutrition management. The key challenges in this system include:

1. **Personalization at Scale**: Creating truly personalized meal plans and recommendations based on individual symptom profiles and preferences.

2. **Sensitive Health Data Management**: Handling women's health data with appropriate security and privacy measures.

3. **AI Integration**: Effectively integrating GPT-4o for meal generation and AudioFish for empathetic voice interactions.

4. **Emotional Design**: Translating emotional support requirements into technical implementation.

5. **Complex Data Correlation**: Connecting symptoms, nutrition, and interventions in meaningful, actionable ways.

### Technology Stack Selection

**Frontend:**
- **React**: For building responsive, component-based UI
- **Tailwind CSS**: For rapid styling with consistent design language
- **React Query**: For efficient API data fetching and state management 
- **Recharts**: For accessible data visualization of symptom tracking
- **PWA capabilities**: For potential mobile-like experience

**Backend:**
- **Node.js with Express**: For API endpoints and business logic
- **Firebase Authentication**: For secure user authentication
- **Cloud Functions**: For serverless API endpoints

**Database:**
- **Firestore**: For user profiles, preferences, and structured data
- **Firebase Storage**: For media assets (images, audio files)

**AI Services:**
- **GPT-4o API**: For meal planning, personalization, and conversational features
- **AudioFish API**: For high-quality, emotionally appropriate voice synthesis (cost-effective alternative to ElevenLabs)

**Integration Services:**
- **n8n**: For workflow automation and third-party API orchestration
- **OAuth 2.0**: For secure integration with grocery delivery services

**Monitoring and Analytics:**
- **Firebase Analytics**: For user engagement tracking
- **Sentry**: For error tracking and performance monitoring

## Database Schema

### User Domain

- **Users Collection**
  - userId (PK)
  - email
  - displayName
  - birthDate
  - createdAt
  - updatedAt
  - isActive
  - subscriptionTier
  - subscriptionExpiryDate

- **UserProfiles Collection**
  - userId (FK)
  - menopauseStage (enum: PREMENOPAUSAL, PERIMENOPAUSAL, MENOPAUSAL, POSTMENOPAUSAL)
  - lastPeriodDate
  - hasHotFlashes (boolean)
  - hasSleepIssues (boolean)
  - hasMoodChanges (boolean)
  - energyLevel (int)
  - hasCognitiveIssues (boolean)
  - healthConditions (array)

- **DietaryPreferences Collection**
  - userId (FK)
  - primaryDiet (enum: OMNIVORE, VEGETARIAN, VEGAN, etc.)
  - allergies (array)
  - dislikes (array)
  - preferences (array)
  - isGlutenFree (boolean)
  - isDairyFree (boolean)
  - isNutFree (boolean)
  - prepTimePreference (int)

- **HealthGoals Collection**
  - userId (FK)
  - primaryGoals (array)
  - secondaryGoals (array)
  - targetDate (timestamp)
  - improveSleep (boolean)
  - reduceHotFlashes (boolean)
  - stabilizeMood (boolean)
  - improveCognition (boolean)
  - maintainWeight (boolean)
  - loseWeight (boolean)

### Symptom Tracking Domain

- **SymptomProfiles Collection**
  - userId (FK)
  - topSymptoms (array of symptomIds)

- **Symptoms Collection**
  - symptomId (PK)
  - name
  - description
  - relatedNutrients (array)
  - reliefStrategies (array)
  - category (enum: PHYSICAL, EMOTIONAL, COGNITIVE, SLEEP, OTHER)
  - baselineSeverity (int)

- **SymptomRecords Collection**
  - recordId (PK)
  - userId (FK)
  - symptomId (FK)
  - timestamp
  - severity (int)
  - notes
  - triggers (array)
  - associatedMeals (array)

- **MoodCheckIns Collection**
  - checkInId (PK)
  - userId (FK)
  - timestamp
  - mood (enum: VERY_GOOD, GOOD, NEUTRAL, LOW, VERY_LOW, IRRITABLE, ANXIOUS, FOGGY)
  - notes
  - symptoms (array)

### Nutrition and Meal Planning Domain

- **MealPlans Collection**
  - planId (PK)
  - userId (FK)
  - startDate
  - endDate
  - isActive (boolean)
  - adherenceRate (float)

- **Meals Collection**
  - mealId (PK)
  - planId (FK)
  - name
  - type (enum: BREAKFAST, LUNCH, DINNER, SNACK)
  - ingredients (array)
  - instructions (array)
  - targetedSymptoms (array)
  - benefitExplanations (array)
  - imageUrl
  - prepTimeMinutes (int)
  - isFavorited (boolean)

- **NutrientProfiles Collection**
  - profileId (PK)
  - mealId (FK)
  - calories (float)
  - protein (float)
  - carbs (float)
  - fiber (float)
  - sugar (float)
  - fat (float)
  - micronutrients (array of objects)

- **NutrientSummaries Collection**
  - summaryId (PK)
  - userId (FK)
  - planId (FK)
  - date
  - progress (array of micronutrient progress objects)

- **FavoriteMeals Collection**
  - favoriteId (PK)
  - userId (FK)
  - mealId (FK)
  - dateFavorited
  - notes

### Relief Tools Domain

- **ReliefTools Collection**
  - toolId (PK)
  - name
  - description
  - category (enum: SLEEP, MOOD, PHYSICAL, NUTRITION, MINDFULNESS)
  - targetSymptoms (array)
  - estimatedTimeMinutes (int)
  - requiresAudio (boolean)
  - requiresInteraction (boolean)
  - imageUrl

- **ReliefSessions Collection**
  - sessionId (PK)
  - userId (FK)
  - toolId (FK)
  - timestamp
  - durationSeconds (int)
  - completed (boolean)
  - effectivenessRating (int)
  - notes

- **NightSOSSessions Collection**
  - sessionId (PK)
  - userId (FK)
  - timestamp
  - selectedSymptoms (array)
  - audioOptions (array)
  - breathingCyclesCompleted (int)
  - completedFullSession (boolean)

- **WindDownRoutines Collection**
  - routineId (PK)
  - userId (FK)
  - durationMinutes (int)
  - lastCompleted
  - isActive (boolean)

- **RoutineSteps Collection**
  - stepId (PK)
  - routineId (FK)
  - description
  - durationMinutes (int)
  - completed (boolean)
  - imageUrl

- **SnackSubstitutions Collection**
  - substitutionId (PK)
  - cravingType (enum: SWEET, SALTY, CRUNCHY, CREAMY, SAVORY, CHOCOLATE, CARBS)
  - originalSnack
  - healthyAlternative
  - ingredients (array)
  - benefits (array)
  - imageUrl
  - quickPrep (boolean)

### Voice Concierge Domain

- **VoiceConcierges Collection**
  - userId (FK)
  - isActive (boolean)

- **VoicePreferences Collection**
  - userId (FK)
  - voiceId
  - speechRate (float)
  - pitch (float)
  - accentPreference
  - backgroundMusicEnabled (boolean)

- **ConversationHistories Collection**
  - historyId (PK)
  - userId (FK)
  - timestamp
  - userQuery
  - systemResponse
  - entitiesDiscussed (array)
  - intentDetected (array)
  - wasHelpful (boolean)

- **SmartSpeakerIntegrations Collection**
  - userId (FK)
  - deviceId
  - deviceType
  - isConnected (boolean)
  - lastInteraction

### External Integrations

- **GroceryIntegrations Collection**
  - userId (FK)
  - providerType (enum: INSTACART, WALMART, AMAZON_FRESH, KROGER, SHIPT)
  - accessToken
  - tokenExpiry
  - isConnected (boolean)

- **ShoppingLists Collection**
  - listId (PK)
  - userId (FK)
  - mealPlanId (FK)
  - estimatedTotal (float)
  - isCustomized (boolean)
  - created

- **ShoppingItems Collection**
  - itemId (PK)
  - listId (FK)
  - name
  - category
  - quantity (float)
  - unit
  - isPantryStaple (boolean)
  - isOptional (boolean)
  - mealIds (array)

- **OrderStatuses Collection**
  - orderId (PK)
  - userId (FK)
  - providerId
  - status (enum: CREATED, PROCESSING, SHOPPING, IN_TRANSIT, DELIVERED, CANCELED, ERROR)
  - orderTime
  - estimatedDelivery
  - total (float)
  - trackingUrl

## API Architecture

### Authentication API
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh-token - Refresh authentication token
- POST /api/auth/reset-password - Password reset request

### User Profile API
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- POST /api/users/onboarding - Submit onboarding information
- GET /api/users/dietary-preferences - Get dietary preferences
- PUT /api/users/dietary-preferences - Update dietary preferences
- GET /api/users/health-goals - Get health goals
- PUT /api/users/health-goals - Update health goals

### Symptom Tracking API
- GET /api/symptoms - Get available symptoms list
- GET /api/symptoms/user - Get user's tracked symptoms
- POST /api/symptoms/record - Record symptom occurrence
- GET /api/symptoms/history - Get symptom history
- POST /api/mood/check-in - Submit mood check-in
- GET /api/mood/history - Get mood history

### Meal Plan API
- GET /api/meal-plans/current - Get current meal plan
- POST /api/meal-plans/generate - Generate new meal plan
- GET /api/meals/:mealId - Get meal details
- POST /api/meals/:mealId/swap - Get meal alternatives
- POST /api/meals/:mealId/favorite - Add meal to favorites
- DELETE /api/meals/:mealId/favorite - Remove meal from favorites
- GET /api/meals/favorites - Get favorite meals

### Nutrient API
- GET /api/nutrients/summary - Get nutrient summary for period
- GET /api/nutrients/deficiencies - Get identified nutrient deficiencies
- GET /api/nutrients/:nutrientId/sources - Get food sources for nutrient

### Relief Tools API
- GET /api/relief-tools - Get available relief tools
- GET /api/relief-tools/:toolId - Get relief tool details
- POST /api/relief-sessions/start - Start relief session
- PUT /api/relief-sessions/:sessionId/complete - Complete relief session
- GET /api/night-sos/start - Start night SOS session
- GET /api/wind-down/routine - Get wind-down routine
- PUT /api/wind-down/steps/:stepId/complete - Mark routine step complete
- GET /api/snacks/substitutes - Get snack substitution options

### Voice Concierge API
- POST /api/voice/query - Submit voice query
- GET /api/voice/preferences - Get voice preferences
- PUT /api/voice/preferences - Update voice preferences
- POST /api/voice/meal-explanation - Get meal explanation
- POST /api/voice/calming-exercise - Get calming exercise

### Grocery Integration API
- GET /api/grocery/providers - Get available grocery providers
- POST /api/grocery/connect - Connect grocery provider
- GET /api/grocery/shopping-list - Get current shopping list
- PUT /api/grocery/shopping-list - Update shopping list
- POST /api/grocery/checkout - Initiate grocery checkout
- GET /api/grocery/orders - Get order history
- GET /api/grocery/orders/:orderId - Get order details

## Integration Points with External Services

### GPT-4o Integration for Meal Generation

**Integration Pattern:** Asynchronous API calls with caching

**Key Integration Points:**
1. **Initial Meal Plan Generation** - Creates personalized meal plans based on user symptoms and preferences
2. **Meal Explanation** - Provides detailed explanations of how specific meals help with symptoms
3. **Meal Alternatives** - Generates appropriate meal swap options while maintaining nutritional targets
4. **Conversational Support** - Powers the voice concierge for natural language interactions

**Implementation Approach:**
- Create specialized prompt templates that incorporate user data, symptoms, and dietary preferences
- Implement a validation layer to ensure AI-generated meals meet nutritional guidelines
- Cache common responses to reduce API costs
- Implement fallback mechanisms for API failures

### AudioFish Integration for Voice Features

**Integration Pattern:** REST API with streaming support

**Key Integration Points:**
1. **Voice Response Generation** - Convert text responses to natural-sounding speech
2. **Night SOS Voice Guidance** - Provide calming voice for nighttime relief
3. **Guided Breathing Instructions** - Deliver paced breathing instructions

**Implementation Approach:**
- Select and customize appropriate voice models for an empathetic tone
- Implement audio caching for common phrases
- Create speech emotion mappings for different scenarios
- Design fallback text-based alternatives if voice synthesis fails

### Grocery API Integrations

**Integration Pattern:** OAuth-based API integrations

**Supported Providers:**
1. Instacart
2. Walmart
3. Amazon Fresh (future implementation)

**Key Integration Points:**
1. **Authentication** - Connect user accounts via OAuth
2. **Product Search** - Find products that match recipe ingredients
3. **Cart Management** - Add items to cart and manage quantities
4. **Checkout Flow** - Initiate and track order fulfillment

**Implementation Approach:**
- Implement provider-agnostic adapter pattern for grocery service integrations
- Create mapping layer between generic ingredients and provider-specific product IDs
- Use n8n workflows for orchestrating multi-step API interactions
- Implement token refresh and error handling logic

## Security Considerations

### Health Data Protection

1. **Data Classification**
   - Classify all data by sensitivity level
   - Implement different security controls based on classification

2. **Encryption**
   - Implement at-rest encryption for all stored health data
   - Use TLS 1.3 for all data in transit
   - Implement field-level encryption for highly sensitive data

3. **Access Controls**
   - Role-based access control for all system components
   - Least privilege principle for service accounts
   - Regular access reviews and audit logging

4. **Authentication Security**
   - Multi-factor authentication for administrative access
   - Secure password policies
   - JWT with appropriate expiration times

5. **API Security**
   - Implement rate limiting
   - Use OWASP API security best practices
   - Regular security testing and vulnerability scanning

### Privacy Compliance

1. **HIPAA Considerations**
   - While not strictly a medical service, implement HIPAA-inspired controls
   - Business Associate Agreements with any data processors
   - Regular privacy impact assessments

2. **GDPR Compliance**
   - Implement data minimization principles
   - Provide data portability options
   - Clear consent mechanisms for data processing
   - Right to be forgotten implementation

3. **Data Retention**
   - Clearly defined data retention periods
   - Automated data purging processes
   - Backup and recovery procedures

## Scalability Approach

### Horizontal Scaling

1. **Stateless API Design**
   - Ensure all API endpoints can scale horizontally
   - Session state stored in databases or distributed caches

2. **Microservices Architecture**
   - Divide system into independently scalable services:
     - User Management Service
     - Symptom Tracking Service
     - Meal Planning Service
     - Voice Processing Service
     - Integration Orchestration Service

3. **Database Scaling**
   - Firestore auto-scaling for document storage
   - Implement read replicas for high read scenarios
   - Consider data partitioning for very large user bases

### Performance Optimization

1. **Caching Strategy**
   - Cache AI-generated meal plans
   - Cache common voice responses
   - Implement CDN for static assets and images

2. **Background Processing**
   - Use queue-based approach for meal plan generation
   - Implement asynchronous processing for non-critical operations
   - Schedule periodic batch operations during low traffic periods

3. **Resource Efficiency**
   - Implement lazy loading of application components
   - Optimize image and audio assets
   - Monitor and tune database queries

### Resilience

1. **Circuit Breaker Pattern**
   - Implement for external API dependencies
   - Graceful degradation when services are unavailable

2. **Retry Mechanisms**
   - Smart retry logic for transient failures
   - Exponential backoff strategy

3. **Monitoring and Alerts**
   - Real-time system health monitoring
   - Proactive alerts for potential issues
   - User experience impact metrics

## Supporting Emotional and Personalized Experience

### Technical Implementations for Emotional Support

1. **Sentiment Analysis**
   - Analyze user inputs for emotional cues
   - Adjust response tone and content based on detected sentiment

2. **Personalized Content Delivery**
   - Use recommendation algorithms to deliver most relevant content
   - A/B test different emotional approaches to find most effective ones

3. **Adaptive UI**
   - Implement time-of-day adjustments (calmer UI at night)
   - Context-aware interface elements that respond to user emotional state
   - Accessibility considerations for diverse user needs

4. **Engagement Psychology**
   - Implement positive reinforcement mechanisms
   - Create non-judgmental feedback loops
   - Build progress visualization that focuses on improvements

## Conclusion

The Meno+ system architecture is designed to provide a secure, scalable, and emotionally intelligent platform for women experiencing menopause. By leveraging modern cloud architecture, AI services, and thoughtful integration points, the system can deliver personalized nutrition guidance and symptom relief while maintaining appropriate security and privacy controls.

The architecture prioritizes user experience through responsive design, emotionally supportive interactions, and personalization at scale. The modular approach allows for phased development and continuous improvement based on user feedback and evolving requirements.
