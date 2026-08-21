  import { useState, useMemo, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { membershipApi } from '@/api/endpoints/membership.api';
import type { Membership } from '@/features/memberships/types';
import { useUpdateMembership } from '../hooks/useUpdateMembership';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Users, UserPlus, Crown, Search, Check, X, Pencil, Power, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function MembersPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [tab, setTab] = useState<TabId>('members');
  const [members, setMembers] = useState(mockMembers);
  const [requests, setRequests] = useState(mockRequests);

  const [searchMembers, setSearchMembers] = useState('');
  const [searchRequests, setSearchRequests] = useState('');
  const [searchOffers, setSearchOffers] = useState('');
  const [debouncedSearchOffers, setDebouncedSearchOffers] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchStatus, setSearchStatus] = useState<'' | 'ACTIVE' | 'SUSPENDED'>('');
  const [debouncedPrice, setDebouncedPrice] = useState('');

  // Debounce 500ms after typing, instant for first fetch (initial '' is synced)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchOffers(searchOffers), 500);
    return () => clearTimeout(timer);
  }, [searchOffers]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPrice(searchPrice), 500);
    return () => clearTimeout(timer);
  }, [searchPrice]);

  // Hook code inlined - was useSearchMyMemberships
  const {
    data: offersData,
    isLoading: isOffersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Membership[]>({
    queryKey: ['memberships', 'searchMy', debouncedSearchOffers, debouncedPrice, searchStatus],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await membershipApi.searchMyMemberships({
        title: debouncedSearchOffers,
        status: (searchStatus || null) as any,
        price: debouncedPrice ? Number(debouncedPrice) : (null as any),
        page: pageParam as number,
        size: 10,
      });
      return res.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length < 10 ? undefined : allPages.length,
    retry: false,
  });

  const offers = offersData?.pages.flat() ?? [];

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Membership | null>(null);
  const [open, setOpen] = useState(false);
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const updateMembership = useUpdateMembership();
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [editBenefits, setEditBenefits] = useState<string[]>(['']);

  useEffect(() => {
    if (selectedOffer) {
      setEditTitle(selectedOffer.title ?? '');
      setEditDescription(selectedOffer.description ?? '');
      setEditPrice(String(selectedOffer.price ?? ''));
      setEditStatus((selectedOffer.status as any) ?? 'ACTIVE');
      setEditBenefits(selectedOffer.benefits && selectedOffer.benefits.length > 0 ? selectedOffer.benefits : ['']);
    }
  }, [selectedOffer]);

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

  const openMember = (m: Member) => { setSelectedMember(m); setSelectedRequest(null); setSelectedOffer(null); setOpen(true); };
  const openRequest = (r: MembershipRequest) => { setSelectedRequest(r); setSelectedMember(null); setSelectedOffer(null); setOpen(true); };
  const openOffer = (o: Membership) => { setSelectedOffer(o); setSelectedMember(null); setSelectedRequest(null); setOpen(true); };

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

  const handleOfferStatus = (id: string, status: string) => {
    // TODO: wire to PATCH /memberships/update with status - currently only local toast
    setSelectedOffer((prev) => (prev ? { ...prev, status: status as any } : null));
    toast.success(status === 'ACTIVE' ? t('members.offer.activated') : t('members.offer.deactivated'));
  };

  const handleCreateOffer = (data: any) => {
    // TODO: wire to useAddMembership() -> POST /memberships/add
    setOfferFormOpen(false);
    toast.success(t('members.offer.created'));
  };

  const handleUpdateOffer = (data: any) => {
    if (!editingOffer) return;
    setSelectedOffer((prev) => (prev ? { ...prev, ...data } : null));
    setOfferFormOpen(false);
    setEditingOffer(null as any);
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
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('members.offer.form.name')}</Label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border-border" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('members.offer.form.description')}</Label>
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-secondary">{t('members.offer.form.price')}</Label>
              <Input type="number" min="0" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="border-border" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-secondary">Statut</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v as any)}>
                <SelectTrigger className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('members.offer.form.benefits')}</Label>
            <div className="flex flex-row gap-2">
              <Input value={editBenefits[0] ?? ''} onChange={(e) => { const next=[...editBenefits]; next[0]=e.target.value; setEditBenefits(next); }} className="border-border" placeholder={t('members.offer.form.benefitsPlaceholder')} />
              <Button type="button" className="bg-secondary w-8 shrink-0" onClick={() => setEditBenefits([...editBenefits, ''])}>
                +
              </Button>
            </div>
          </div>
          {editBenefits.slice(1).map((b, idx) => {
            const realIdx = idx + 1;
            return (
              <div key={realIdx} className="flex flex-row gap-2">
                <Input value={b} onChange={(e) => { const next=[...editBenefits]; next[realIdx]=e.target.value; setEditBenefits(next); }} className="border-border" placeholder={t('members.offer.form.benefitsPlaceholder')} />
                <Button type="button" className="bg-red-500 w-8 shrink-0 hover:bg-red-600" onClick={() => setEditBenefits(editBenefits.filter((_, i) => i !== realIdx))}>
                  -
                </Button>
              </div>
            );
          })}
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
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={updateMembership.isPending}
            onClick={() => {
              updateMembership.mutate(
                {
                  id: selectedOffer.id!,
                  title: editTitle,
                  description: editDescription,
                  price: Number(editPrice) || 0,
                  status: editStatus,
                  benefits: editBenefits.map((b) => b.trim()).filter(Boolean),
                } as any,
                { onSuccess: () => setOpen(false) },
              );
            }}
          >
            {updateMembership.isPending ? '...' : t('members.offer.form.save')}
          </Button>
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
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <Input value={searchOffers} onChange={(e) => setSearchOffers(e.target.value)} placeholder={t('members.searchOffers')} className="pl-10 border-primary placeholder:text-secondary" />
            </div>
            <Input type="number" value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)} placeholder="Prix" className="w-24 sm:w-32 shrink-0 border-primary placeholder:text-secondary" />
            <Select value={searchStatus} onValueChange={(v) => setSearchStatus(v as any)}>
              <SelectTrigger className="w-28 sm:w-36 shrink-0 border-primary text-secondary">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setEditingOffer(null); setOfferFormOpen(true); }}>
              <Plus size={16} />
              <span className="hidden sm:inline">{t('members.offer.create')}</span>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {isOffersLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Chargement...</p>
            ) : offers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t('members.empty')}</p>
            ) : (
              <>
                {offers.map((o) => (
                  <div key={o.id ?? o.title} onClick={() => openOffer(o)} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                      <Crown size={18} className="text-primary" />
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-medium text-secondary">{o.title}</span>
                      <span className="text-xs text-muted-foreground">{o.price} MAD · {o.benefits.length} avantages</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-serif text-sm font-bold text-primary">{o.price} MAD</span>
                      <Badge className={`shrink-0 border text-xs ${o.status === 'ACTIVE' ? 'border-secondary bg-secondary/15 text-secondary' : 'border-border bg-muted text-muted-foreground'}`}>
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {hasNextPage && (
                  <Button variant="outline" className="mt-2 w-full" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
                  </Button>
                )}
              </>
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