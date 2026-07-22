import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {useLogin} from "@/features/auth/hooks/useLogin.ts";

export default function LoginForm() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
        { identifier: email, password },
        {
          onSuccess: (res) => {
            if (res.data.success) {
              toast.success(t('notification.loginSuccess'));
              navigate("/dashboard");
            }
          },
          onError: (err: any) => {
            const message = err?.response?.data?.message || t('notification.loginError');
            toast.error(message);
          }
        }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('login.email')}</label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlaceholder')}
            className="pl-10 border-primary placeholder:text-secondary"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('login.password')}</label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder')}
            className="pl-10 border-primary placeholder:text-secondary"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full">
        {t('login.button')}
      </Button>

      {/* Switch to register */}
      <div className="mt-2 text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
          {t('login.register')}
        </Link>
      </div>
    </form>
  );
}