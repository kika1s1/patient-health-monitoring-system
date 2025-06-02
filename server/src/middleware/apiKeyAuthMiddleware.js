import dotenv from 'dotenv';

// Ensure environment variables are loaded.
if (!process.env.VALID_API_KEYS) {
  dotenv.config();
}

const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : [];

export const apiKeyAuth = (req, res, next) => {
  if (validApiKeys.length === 0 && process.env.NODE_ENV !== 'test') { // Allow tests to run if keys not set
    // This means the API key authentication mechanism is not configured on the server.
    console.warn('Warning: VALID_API_KEYS environment variable is not set or is empty. API key authentication is not active.');
    // If strict API key usage is required, and this middleware is applied, it should fail.
    // return res.status(500).json({
    //   error: 'ConfigurationError',
    //   message: 'API key authentication is not configured on the server.'
    // });
    // For the purpose of this application, if no keys are set, we will allow passage
    // as this might be intentional during development or for certain deployments.
    // However, if a route *is* protected by this, and no keys are set, no key will be valid.
  }

  const submittedApiKey = req.headers['x-api-key'];

  if (!submittedApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is missing.',
    });
  }

  // If VALID_API_KEYS is null, no submitted key will be valid.
  if (validApiKeys.length === 0 || !validApiKeys.includes(submittedApiKey)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key.',
    });
  }

  // If the key is valid
  next();
};
