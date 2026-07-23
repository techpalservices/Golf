import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { BiMaleFemale } from "react-icons/bi";
import {FaChrome, FaFacebookSquare, FaPhoneAlt, FaUser} from "react-icons/fa";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignup } from "@/features/auth/hooks/useSignup.ts";
import type { SignUpDTO } from "@/features/auth/types.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterForm() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [user, setUser] = useState<SignUpDTO>({
    firstName: '',
    lastName: '',
    email: '',
    gender: null,
    phoneNumber: '',
    username: '',
    password: '',
  });

  const signupMutation = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signupMutation.mutate({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        username: user.username,
        password: user.password,
    },{
      onSuccess: (res) => {
        if (res.data.success) {
          toast.success(t('notification.signupSuccess'));
          navigate("/dashboard");
        }
      },
      onError: (err: any) => {
        const message = err?.response?.data?.message || t('notification.signupError');
        toast.error(message);
      }
    })
  }

  const items : {
    label: string;
    value: string | null;
  }[] = [
    { label: `${t('register.genderPlaceholder')}`, value: null },
    { label: `${t('register.male')}`, value: 'MALE' },
    { label: `${t('register.female')}`, value: 'FEMALE' }
  ];

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
              value={user?.firstName || ''}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
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
              value={user?.lastName || ''}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
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
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder={t('register.emailPlaceholder')}
            className="pl-10 border-primary placeholder:text-secondary"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium tracking-widest text-primary">{t('register.gender')}</label>
          <div className="relative">
            <BiMaleFemale  size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Select items={items} value={user.gender} onValueChange={(value) => setUser({ ...user, gender: value })}>
              <SelectTrigger className="pl-10 border-primary placeholder:text-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium tracking-widest text-primary">{t('register.phoneNumber')}</label>
          <div className="relative">
            <FaPhoneAlt  size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
                type="tel"
                value={user.phoneNumber}
                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                placeholder={t('register.phoneNumberPlaceholder')}
                className="pl-10 border-primary placeholder:text-secondary"
                required
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('register.username')}</label>
        <div className="relative">
          <FaUser  size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
              type="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder={t('register.usernamePlaceholder')}
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
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
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

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-muted-foreground">
                  {t('login.orContinueWith', 'or continue with')}
                </span>
        </div>
      </div>

      <div className="flex flex-row gap-6">
        <a
            href="http://localhost:8081/oauth2/authorization/google"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <FaChrome size={18} />
        </a>
        <a
            href="http://localhost:8081/oauth2/authorization/facebook"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <FaFacebookSquare size={18} />
        </a>
      </div>

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