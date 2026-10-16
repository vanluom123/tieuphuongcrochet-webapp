import { Suspense } from 'react';
import AuthRouteRedirect from '@/app/components/auth/AuthRouteRedirect';

const RegisterPage = () => (
  <Suspense fallback={null}>
    <AuthRouteRedirect auth="register" />
  </Suspense>
);

export default RegisterPage;
