import { useTranslation } from 'react-i18next';
import { MapPin, Building2, Tag, Calendar, Check } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Membership, MembershipType } from '../types';
import { toast } from 'sonner';

interface MembershipDialogProps {
  membership: Membership | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeColors: Record<MembershipType, string> = {
  MONTHLY: 'bg-primary/15 text-primary border-primary',
  YEARLY: 'bg-secondary/15 text-secondary border-secondary',
  VIP: 'bg-primary text-primary-foreground border-primary',
};

export default function MembershipDialog({ membership, open, onOpenChange }: MembershipDialogProps) {
  const { t } = useTranslation('memberships');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!membership) return null;

  const details = (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <Building2 size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">{t('dialog.club')}</span>
        <span className="text-sm font-semibold text-foreground">{membership.clubName}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <MapPin size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">{t('dialog.location')}</span>
        <span className="text-sm font-semibold text-foreground">{membership.location}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <Tag size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">{t('dialog.type')}</span>
        <Badge className={`w-fit border text-xs ${typeColors[membership.type]}`}>
          {t(`type.${membership.type}`)}
        </Badge>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <Calendar size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">{t('dialog.duration')}</span>
        <span className="text-sm font-semibold text-foreground">{membership.duration}</span>
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col gap-6">
      {/* Title + price */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-secondary sm:text-3xl">
            {membership.offerName}
          </h2>
          <Badge className={`mt-2 border ${typeColors[membership.type]}`}>
            {t(`type.${membership.type}`)}
          </Badge>
        </div>
        <div className="text-right">
          <span className="font-serif text-2xl font-bold text-primary">
            {membership.price} MAD
          </span>
          <p className="text-xs text-muted-foreground">
            {membership.type === 'YEARLY' ? t('item.perYear') : t('item.perMonth')}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="mb-2 text-xs font-medium tracking-widest text-primary">
          {t('dialog.description')}
        </h3>
        <p className="text-sm text-muted-foreground">{membership.description}</p>
      </div>

      {/* Details */}
      <div>
        <h3 className="mb-3 text-xs font-medium tracking-widest text-primary">
          {t('dialog.details')}
        </h3>
        {details}
      </div>

      <Separator />

      {/* Benefits */}
      <div>
        <h3 className="mb-3 text-xs font-medium tracking-widest text-primary">
          {t('dialog.benefits')}
        </h3>
        <ul className="flex flex-col gap-2">
          {membership.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={16} className="text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe button */}
      <div className="mt-auto">
        <Button
            size="lg"
            className="w-full"
            onClick={() => {
            toast.success(t('notification.success'), {
                description: t('notification.successDesc'),
            });
            onOpenChange(false);
            }}
        >
            {t('dialog.subscribe')}
        </Button>
      </div>
    </div>
  );

  // ─── Desktop: centered Dialog ───
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg bg-white">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Mobile: bottom sheet Drawer ───
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] bg-white">
        <div className="overflow-y-auto p-5">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}