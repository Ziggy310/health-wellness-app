/**
 * Controller for server status and health checking
 */
const getStatus = (req, res) => {
  const status = {
    service: 'Meno+ API',
    status: 'running',
    version: process.env.VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  };
  
  res.status(200).json(status);
};

module.exports = {
  getStatus
};
