// src/components/ErrorPage.jsx
import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">⚠️ Oops!</h1>
        <p className="mt-2 text-gray-600">Something went wrong.</p>
        <pre className="mt-4 text-red-500">{error?.message || 'Unknown error'}</pre>
      </div>
    </div>
  );
};

export default ErrorPage;
