import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Users, UserPlus, Crown, Search, Check, X, Pencil, Power, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import OfferFormDialog from '../components/OfferFormDialog';

type TabId = 'members' | 'requests' | 'offers';
type MemberStatus = 'active' | 'suspended' | 'expired';
type RequestStatus = 'pending' | 'approved' | 'rejected';
type OfferStatus = 'active' | 'inactive';

interface Member {
  id: string;
  fullName: string;
  initials: string;
  since: string;
  status: MemberStatus;
  membership: string;
  contact: string;
}

interface MembershipRequest {
  id: string;
  fullName: string;
  initials: string;
  requestedAt: string;
  status: RequestStatus;
  membership: string;
  contact: string;
}

interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  benefits: string[];
  status: OfferStatus;
  membersCount: number;
}

const memberStatusColors: Record<MemberStatus, string> = {
  active: 'border-secondary bg-secondary/15 text-secondary',
  suspended: 'border-red-500 bg-red-500/15 text-red-600',
  expired: 'border-border bg-muted text-muted-foreground',
};

const requestStatusColors: Record<RequestStatus, string> = {
  pending: 'border-primary bg-primary/15 text-primary',
  approved: 'border-secondary bg-secondary/15 text-secondary',
  rejected: 'border-border bg-muted text-muted-foreground',
};

const offerStatusColors: Record<OfferStatus, string> = {
  active: 'border-secondary bg-secondary/15 text-secondary',
  inactive: 'border-border bg-muted text-muted-foreground',
};

const mockMembers: Member[] = [
  { id: '1', fullName: 'Ahmed Benali', initials: 'AB', since: '15/01/2024', status: 'active', membership: 'Premium Annuel', contact: '+212 6 12 34 56 78' },
  { id: '2', fullName: 'Sara Mansouri', initials: 'SM', since: '03/06/2024', status: 'active', membership: 'Standard Mensuel', contact: '+212 6 98 76 54 32' },
  { id: '3', fullName: 'Youssef Khalfouni', initials: 'YK', since: '20/09/2023', status: 'suspended', membership: 'Premium Annuel', contact: '+212 6 55 44 33 22' },
  { id: '4', fullName: 'Imane Rachidi', initials: 'IR', since: '11/02/2024', status: 'active', membership: 'Standard Mensuel', contact: '+212 6 77 88 99 00' },
  { id: '5', fullName: 'Karim El Idrissi', initials: 'KE', since: '28/11/2023', status: 'expired', membership: 'Premium Annuel', contact: '+212 6 11 22 33 44' },
];

const mockRequests: MembershipRequest[] = [
  { id: '1', fullName: 'Nadia Lamrani', initials: 'NL', requestedAt: 'il y a 2h', status: 'pending', membership: 'Premium Annuel', contact: '+212 6 90 80 70 60' },
  { id: '2', fullName: 'Omar Fassi', initials: 'OF', requestedAt: 'il y a 5h', status: 'pending', membership: 'Standard Mensuel', contact: '+212 6 33 22 11 00' },
  { id: '3', fullName: 'Leila Alaoui', initials: 'LA', requestedAt: 'il y a 1j', status: 'pending', membership: 'Premium Annuel', contact: '+212 6 44 55 66 77' },
  { id: '4', fullName: 'Hassan Tazi', initials: 'HT', requestedAt: 'il y a 2j', status: 'approved', membership: 'Standard Mensuel', contact: '+212 6 66 77 88 99' },
];

const mockOffers: Offer[] = [
  { id: '1', name: 'Premium Annuel', description: 'Accès illimité aux deux parcours, priorité de réservation et avantages exclusifs.', price: 12000, duration: 12, benefits: ['Accès illimité 7j/7', 'Réservation prioritaire (14j)', '2 invités gratuits/mois', 'Accès au practice illimité'], status: 'active', membersCount: 42 },
  { id: '2', name: 'Standard Mensuel', description: 'Accès au parcours principal avec tarifs préférentiels.', price: 1200, duration: 1, benefits: ['Accès au parcours Massy', 'Tarif vert réduit', '1 invité gratuit/mois'], status: 'active', membersCount: 68 },
  { id: '3', name: 'Étudiant', description: 'Tarif réduit pour les étudiants sur présentation de carte valide.', price: 600, duration: 6, benefits: ['Accès en semaine', 'Tarif vert réduit', 'Practice inclus'], status: 'inactive', membersCount: 15 },
];

export default function MembersPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [tab, setTab] = useState<TabId>('members');
  const [members, setMembers] = useState(mockMembers);
  const [requests, setRequests] = useState(mockRequests);
  const [offers, setOffers] = useState(mockOffers);

  const [searchMembers, setSearchMembers] = useState('');
  const [searchRequests, setSearchRequests] = useState('');
  const [searchOffers, setSearchOffers] = useState('');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [open, setOpen] = useState(false);
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const filteredMembers = useMemo(() => {
    if (!searchMembers) return members;
    const q = searchMembers.toLowerCase();
    return members.filter((m) => m.fullName.toLowerCase().includes(q) || m.membership.toLowerCase().includes(q) || m.status.includes(q));
  }, [members, searchMembers]);

  const filteredRequests = useMemo(() => {
    if (!searchRequests) return requests;
    const q = searchRequests.toLowerCase();
    return requests.filter((r) => r.fullName.toLowerCase().includes(q) || r.membership.toLowerCase().includes(q) || r.status.includes(q));
  }, [requests, searchRequests]);

  const filteredOffers = useMemo(() => {
    if (!searchOffers) return offers;
    const q = searchOffers.toLowerCase();
    return offers.filter((o) => o.name.toLowerCase().includes(q) || o.status.includes(q));
  }, [offers, searchOffers]);

  const openMember = (m: Member) => { setSelectedMember(m); setSelectedRequest(null); setSelectedOffer(null); setOpen(true); };
  const openRequest = (r: MembershipRequest) => { setSelectedRequest(r); setSelectedMember(null); setSelectedOffer(null); setOpen(true); };
  const openOffer = (o: Offer) => { setSelectedOffer(o); setSelectedMember(null); setSelectedRequest(null); setOpen(true); };

  const handleSuspend = (id: string, action: 'suspended' | 'active') => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: action } : m)));
    setSelectedMember((prev) => (prev ? { ...prev, status: action } : null));
    toast.success(action === 'suspended' ? t('members.member.suspended') : t('members.member.reinstated'));
  };

  const handleRequestAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
    setSelectedRequest((prev) => (prev ? { ...prev, status: action } : null));
    toast.success(action === 'approved' ? t('members.request.approved') : t('members.request.rejected'));
    if (action === 'rejected') setTimeout(() => setOpen(false), 800);
  };

  const handleOfferStatus = (id: string, status: OfferStatus) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOffer((prev) => (prev ? { ...prev, status } : null));
    toast.success(status === 'active' ? t('members.offer.activated') : t('members.offer.deactivated'));
  };

  const handleCreateOffer = (data: Omit<Offer, 'id' | 'membersCount' | 'status'>) => {
    const newOffer: Offer = { ...data, id: `offer-${Date.now()}`, membersCount: 0, status: 'active' };
    setOffers((prev) => [...prev, newOffer]);
    setOfferFormOpen(false);
    toast.success(t('members.offer.created'));
  };

  const handleUpdateOffer = (data: Omit<Offer, 'id' | 'membersCount' | 'status'>) => {
    if (!editingOffer) return;
    setOffers((prev) => prev.map((o) => (o.id === editingOffer.id ? { ...o, ...data } : o)));
    setSelectedOffer((prev) => (prev && prev.id === editingOffer.id ? { ...prev, ...data } : prev));
    setOfferFormOpen(false);
    setEditingOffer(null);
    toast.success(t('members.offer.updated'));
  };

  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'members', label: t('members.tabMembers'), icon: Users },
    { id: 'requests', label: t('members.tabRequests'), icon: UserPlus },
    { id: 'offers', label: t('members.tabOffers'), icon: Crown },
  ];

  const detailsContent = (
    <>
      {selectedMember && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="border-2 border-primary">
              <AvatarFallback className="bg-primary/15 font-bold text-primary">{selectedMember.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-bold text-secondary">{selectedMember.fullName}</span>
              <Badge className={`w-fit border text-xs ${memberStatusColors[selectedMember.status]}`}>
                {t(`members.member.${selectedMember.status === 'suspended' ? 'suspended_status' : selectedMember.status}`)}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.member.membership')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedMember.membership}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.member.since')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedMember.since}</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.member.contact')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedMember.contact}</span>
            </div>
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="border-2 border-primary">
              <AvatarFallback className="bg-primary/15 font-bold text-primary">{selectedRequest.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-bold text-secondary">{selectedRequest.fullName}</span>
              <Badge className={`w-fit border text-xs ${requestStatusColors[selectedRequest.status]}`}>
                {t(`members.request.${selectedRequest.status}`)}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.request.membership')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedRequest.membership}</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.request.contact')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedRequest.contact}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{t('members.request.requested')} {selectedRequest.requestedAt}</span>
        </div>
      )}

      {selectedOffer && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-bold text-secondary">{selectedOffer.name}</span>
              <Badge className={`w-fit border text-xs ${offerStatusColors[selectedOffer.status]}`}>
                {t(`members.offer.${selectedOffer.status}`)}
              </Badge>
            </div>
            <span className="font-serif text-xl font-bold text-primary">{selectedOffer.price} MAD</span>
          </div>
          <p className="text-sm text-muted-foreground">{selectedOffer.description}</p>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.offer.duration')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedOffer.duration} mois</span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t('members.offer.members')}</span>
              <span className="text-sm font-semibold text-secondary">{selectedOffer.membersCount}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-widest text-primary">{t('members.offer.benefits')}</span>
            <ul className="flex flex-col gap-1.5">
              {selectedOffer.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-secondary">
                  <Check size={14} className="text-primary" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );

  const detailsFooter = (
    <>
      {selectedMember && (
        <div className="flex gap-2">
          {selectedMember.status === 'active' ? (
            <Button className="flex-1 gap-2 bg-red-500 text-white hover:bg-red-500/80" onClick={() => handleSuspend(selectedMember.id, 'suspended')}>
              <X size={16} /> {t('members.member.suspend')}
            </Button>
          ) : (
            <Button className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80" onClick={() => handleSuspend(selectedMember.id, 'active')}>
              <Check size={16} /> {t('members.member.reinstate')}
            </Button>
          )}
        </div>
      )}
      {selectedRequest && selectedRequest.status === 'pending' && (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2 border-border text-muted-foreground hover:bg-muted" onClick={() => handleRequestAction(selectedRequest.id, 'rejected')}>
            <X size={16} /> {t('members.request.reject')}
          </Button>
          <Button className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80" onClick={() => handleRequestAction(selectedRequest.id, 'approved')}>
            <Check size={16} /> {t('members.request.approve')}
          </Button>
        </div>
      )}
      {selectedOffer && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-primary text-primary hover:bg-primary/10"
            onClick={() => { setEditingOffer(selectedOffer); setOpen(false); setOfferFormOpen(true); }}
          >
            <Pencil size={16} /> {t('members.offer.update')}
          </Button>
          {selectedOffer.status === 'active' ? (
            <Button className="flex-1 gap-2 bg-red-500 text-white hover:bg-red-500/80" onClick={() => handleOfferStatus(selectedOffer.id, 'inactive')}>
              <Power size={16} /> {t('members.offer.deactivate')}
            </Button>
          ) : (
            <Button className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80" onClick={() => handleOfferStatus(selectedOffer.id, 'active')}>
              <Power size={16} /> {t('members.offer.activate')}
            </Button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('members.title')}</h1>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {tabs.map((tabItem) => {
          const Icon = tabItem.icon;
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                tab === tabItem.id
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border bg-surface text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon size={16} />
              {tabItem.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'members' && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input value={searchMembers} onChange={(e) => setSearchMembers(e.target.value)} placeholder={t('members.searchMembers')} className="pl-10 border-primary placeholder:text-secondary" />
          </div>
          <div className="flex flex-col gap-2">
            {filteredMembers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t('members.empty')}</p>
            ) : (
              filteredMembers.map((m) => (
                <div key={m.id} onClick={() => openMember(m)} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md">
                  <Avatar size="lg" className="border border-border">
                    <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">{m.initials}</AvatarFallback>
                  </Avatar>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-medium text-secondary">{m.fullName}</span>
                    <span className="text-xs text-muted-foreground">{m.membership} · {t('members.member.since')} {m.since}</span>
                  </div>
                  <Badge className={`shrink-0 border text-xs ${memberStatusColors[m.status]}`}>
                    {t(`members.member.${m.status === 'suspended' ? 'suspended_status' : m.status}`)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input value={searchRequests} onChange={(e) => setSearchRequests(e.target.value)} placeholder={t('members.searchRequests')} className="pl-10 border-primary placeholder:text-secondary" />
          </div>
          <div className="flex flex-col gap-2">
            {filteredRequests.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t('members.empty')}</p>
            ) : (
              filteredRequests.map((r) => (
                <div key={r.id} onClick={() => openRequest(r)} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md">
                  <Avatar size="lg" className="border border-border">
                    <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">{r.initials}</AvatarFallback>
                  </Avatar>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-medium text-secondary">{r.fullName}</span>
                    <span className="text-xs text-muted-foreground">{r.membership} · {t('members.request.requested')} {r.requestedAt}</span>
                  </div>
                  <Badge className={`shrink-0 border text-xs ${requestStatusColors[r.status]}`}>
                    {t(`members.request.${r.status}`)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'offers' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <Input value={searchOffers} onChange={(e) => setSearchOffers(e.target.value)} placeholder={t('members.searchOffers')} className="pl-10 border-primary placeholder:text-secondary" />
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setEditingOffer(null); setOfferFormOpen(true); }}>
              <Plus size={16} />
              <span className="hidden sm:inline">{t('members.offer.create')}</span>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {filteredOffers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t('members.empty')}</p>
            ) : (
              filteredOffers.map((o) => (
                <div key={o.id} onClick={() => openOffer(o)} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                    <Crown size={18} className="text-primary" />
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-medium text-secondary">{o.name}</span>
                    <span className="text-xs text-muted-foreground">{o.duration} mois · {o.membersCount} {t('members.offer.members')}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-serif text-sm font-bold text-primary">{o.price} MAD</span>
                    <Badge className={`shrink-0 border text-xs ${offerStatusColors[o.status]}`}>
                      {t(`members.offer.${o.status}`)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Details dialog/drawer */}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-surface max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-secondary">
                {selectedMember ? t('members.tabMembers') : selectedRequest ? t('members.tabRequests') : t('members.tabOffers')}
              </DialogTitle>
            </DialogHeader>
            {detailsContent}
            {(selectedMember || (selectedRequest && selectedRequest.status === 'pending') || selectedOffer) && (
              <DialogFooter className="gap-2">{detailsFooter}</DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] bg-surface">
            <DrawerHeader>
              <DrawerTitle className="font-serif text-lg font-bold text-secondary">
                {selectedMember ? t('members.tabMembers') : selectedRequest ? t('members.tabRequests') : t('members.tabOffers')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4 max-h-[60vh]">{detailsContent}</div>
            {(selectedMember || (selectedRequest && selectedRequest.status === 'pending') || selectedOffer) && (
              <DrawerFooter className="px-4 pb-6">{detailsFooter}</DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      )}

      {/* Offer form dialog */}
      <OfferFormDialog
        open={offerFormOpen}
        onOpenChange={setOfferFormOpen}
        onSubmit={editingOffer ? handleUpdateOffer : handleCreateOffer}
        initialData={editingOffer ?? undefined}
      />
    </div>
  );
}