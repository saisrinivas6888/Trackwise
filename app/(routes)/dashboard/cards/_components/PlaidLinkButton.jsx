'use client';
import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import {Button} from "../../../../../components/ui/button"
export function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateLinkToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
         credentials: 'include',
      });
      const { link_token } = await response.json();
      setLinkToken(link_token);
    } catch (error) {
      console.error('Error generating link token:', error);
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        const response = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token, metadata }),
        });
        
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error exchanging token:', error);
      }
    },
  });

  const handleClick = () => {
    if (linkToken) {
      open();
    } else {
      generateLinkToken();
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading || (linkToken && !ready)}
      className="w-full"
    >
      {loading ? 'Loading...' : 'Connect Bank Account'}
    </Button>
  );
}
