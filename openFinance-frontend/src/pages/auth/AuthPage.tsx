// src/pages/auth/AuthPage.tsx
import { useState } from 'react';
import { AuthLayout } from '../../layout/AuthLayout';
import { LoginForm } from '../../features/form/LoginForm';
import { RegisterForm } from '../../features/form/RegisterForm';

export default function AuthPage() {
    const [view, setView] = useState<'login' | 'register'>('login');

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                {view === 'login' ? (
                    <LoginForm onSwitchToRegister={() => setView('register')} />
                ) : (
                    <RegisterForm onSwitchToLogin={() => setView('login')} />
                )}
            </div>
        </AuthLayout>
    );
}
