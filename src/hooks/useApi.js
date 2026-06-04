import { useCallback, useState } from 'react';

const CONTACT_API_URL = '/api/contact';

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.error || `HTTP ${response.status}`);
    error.fields = payload.fields || {};
    throw error;
  }

  return response.json().catch(() => ({}));
};

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const submitContact = useCallback(async (contactData) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      await apiCall(CONTACT_API_URL, {
        method: 'POST',
        body: contactData,
      });
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setFieldErrors(err.fields || {});
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitContact, loading, error, fieldErrors, success };
};

export { apiCall };
