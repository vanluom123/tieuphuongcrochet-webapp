'use client';

import React from 'react';

interface AuthTextLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const AuthTextLink: React.FC<AuthTextLinkProps> = ({
  children,
  onClick,
  className = '',
}) => (
  <button type="button" className={`auth-text-link ${className}`.trim()} onClick={onClick}>
    {children}
  </button>
);

export default AuthTextLink;
