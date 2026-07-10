import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterForm() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock — replace with API call
    toast.success(t('notification.registerSuccess'), {
      description: t('notification.registerSuccessDesc'),
    });
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* First name + Last name — side by side on desktop */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium tracking-widest text-primary">{t('register.firstName')}</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('register.firstNamePlaceholder')}
              className="pl-10 border-primary placeholder:text-secondary"
              required
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium tracking-widest text-primary">{t('register.lastName')}</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('register.lastNamePlaceholder')}
              className="pl-10 border-primary placeholder:text-secondary"
              required
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('register.email')}</label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('register.emailPlaceholder')}
            className="pl-10 border-primary placeholder:text-secondary"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('register.password')}</label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('register.passwordPlaceholder')}
            className="pl-10 border-primary placeholder:text-secondary"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full">
        {t('register.button')}
      </Button>

      {/* Switch to login */}
      <div className="mt-2 text-center text-sm text-muted-foreground">
        {t('register.hasAccount')}{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          {t('register.login')}
        </Link>
      </div>
    </form>
  );
}