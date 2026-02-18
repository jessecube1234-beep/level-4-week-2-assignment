import { randomUUID } from 'crypto';

/**
 * Global error handling middleware.
 *
 * This catches all errors thrown in controllers or middleware
 * and makes sure they are returned in the required API response format.
 *
 * It standardizes:
 * - HTTP status codes
 * - Error codes
 * - Readable messages
 * - A unique requestId (for debugging)
 */
export const errorHandler = (err, _req, res, _next) => {
  // Log the full error to the server console for debugging
  console.error(err);

  // Use provided status or default to 500
  const status = err.status || 500;

  // Use custom error code if available, or default to 500
  const code = err.code || 'INTERNAL_ERROR';

  // Hide internal error details for 500 errors
  const message = status === 500 ? 'Something went wrong' : err.message || 'Error';

  // Send standardized error response
  res.status(status).json({
    ok: false,
    error: {
      code,
      message,
      details: null, // for future use (phase 2)
      requestId: randomUUID(), // unique ID (for debugging)
    },
  });
};
