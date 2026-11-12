'use client';

import React, { useMemo } from 'react';
import { Modal } from 'antd';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import logo from '@/public/logo.png';
import { useAuthModal } from '@/app/context/AuthModalProvider';
import { AuthIntent } from '@/app/lib/auth/types';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import ForgotPasswordForm from './forms/ForgotPasswordForm';
import ResendVerificationForm from './forms/ResendVerificationForm';
import '@/app/ui/components/authModal.scss';
import '@/app/ui/components/authForm.scss';

const INTENT_KEYS: Record<AuthIntent, string> = {
  save_pattern: 'intent_save_pattern',
  like: 'intent_like',
  comment: 'intent_comment',
};

const AuthModal: React.FC = () => {
  const { open, view, intent, prefillEmail, closeAuth, setAuthView, handleLoginSuccess } =
    useAuthModal();
  const tLogin = useTranslations('Login');
  const tRegister = useTranslations('Register');
  const tForgot = useTranslations('ForgotPassword');
  const tResend = useTranslations('ResendVerification');
  const tAuth = useTranslations('Auth');

  const title = useMemo(() => {
    if (view === 'register') return tRegister('title');
    if (view === 'forgot') return tForgot('title');
    if (view === 'resend_verification') return tResend('title');
    return tLogin('title');
  }, [view, tLogin, tRegister, tForgot, tResend]);

  const subtitle = useMemo(() => {
    if (view !== 'login' || !intent) return null;
    const key = INTENT_KEYS[intent];
    return tAuth(key);
  }, [view, intent, tAuth]);

  return (
    <Modal
      open={open}
      onCancel={closeAuth}
      footer={null}
      centered
      width={440}
      className="auth-modal"
      destroyOnClose
      styles={{
        mask: { backgroundColor: 'rgba(41, 41, 41, 0.45)' },
      }}
    >
      <div className="auth-modal-panel">
        <header className="auth-modal-header">
          <Image src={logo} alt="Tiệm len Tiểu Phương" width={48} height={48} priority />
          <div className="auth-modal-heading">
            <h2 className="auth-modal-title">{title}</h2>
            {subtitle && <p className="auth-modal-subtitle">{subtitle}</p>}
          </div>
        </header>
        <div className="auth-modal-body" key={view}>
          {view === 'login' && (
            <LoginForm onNavigate={setAuthView} onLoginSuccess={handleLoginSuccess} />
          )}
          {view === 'register' && (
            <RegisterForm onNavigateLogin={() => setAuthView('login')} />
          )}
          {view === 'forgot' && (
            <ForgotPasswordForm onBackToLogin={() => setAuthView('login')} />
          )}
          {view === 'resend_verification' && (
            <ResendVerificationForm
              initialEmail={prefillEmail}
              onBackToLogin={() => setAuthView('login', { email: '' })}
              onNavigateRegister={() => setAuthView('register', { email: '' })}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
