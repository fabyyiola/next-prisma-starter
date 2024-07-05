// src/components/Alert.tsx
import React from 'react';

interface AlertProps {
  title: string;
  messages: string[];
}

const AlertMessage: React.FC<AlertProps> = ({ title, messages }) => {
  return (
    <div className="border rounded-md p-4 bg-gray-100">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.718-1.36 3.482 0l5.946 10.557c.725 1.287-.184 2.844-1.741 2.844H4.052c-1.557 0-2.466-1.557-1.741-2.844L8.257 3.099zM11 13a1 1 0 11-2 0v-2a1 1 0 112 0v2zm-1-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <div className="mt-2 text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-1">
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;
