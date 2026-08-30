import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, Plus, Calendar, MapPin, Users, Pencil, Trash2, Play, CheckCircle, XCircle, Unlock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TournamentFormDialog from '../components/TournamentFormDialog';
import { tournamentApi } from '@/api/endpoints/tournament.api';

type FrontStatus = 'planned' | 'open' | 'ongoing' | 'completed' | 'cancelled';

const statusColor: Record<FrontStatus,string> = {
  planned: 'border-primary bg-primary/15 text-primary',
  open: 'border-secondary bg-secondary/15 text-secondary',
  ongoing: 'border-secondary bg-secondary/15 text-secondary',
  completed: 'border-blue-500 bg-blue-500/15 text-blue-600',
  cancelled: 'border-border bg-muted text-muted-foreground',
};

function mapBackendToFront(s?: string): FrontStatus {
  switch(s){
    case 'PENDING': return 'planned';
    case 'ACTIVE': return 'open';
    case 'COMPLETED': return 'completed';
    case 'CANCELED': return 'cancelled';
    default: return 'planned';
  }
}
function mapFrontToBackend(s: FrontStatus): string {
  switch(s){
    case 'planned': return 'PENDING';
    case 'open':
    case 'ongoing': return 'ACTIVE';
    case 'completed': return 'COMPLETED';
    case 'cancelled': return 'CANCELED';
  }
}

export default function ManageTournamentsPage(){
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [tournaments,setTournaments] = useState<any[]>([]);
  const [search,setSearch] = useState('');
  const [debounced,setDebounced] = useState('');
  const [statusFilter,setStatusFilter] = useState('all');
  const [locationFilter,setLocationFilter] = useState('all');
  const [loading,setLoading] = useState(false);
  const [selected,setSelected] = useState<any|null>(null);
  const [open,setOpen] = useState(false);
  const [formOpen,setFormOpen] = useState(false);
  const [editing,setEditing] = useState<any|null>(null);

  useEffect(()=>{
    const id=setTimeout(()=>setDebounced(search),500);
    return ()=>clearTimeout(id);
  },[search]);

  const fetchTournaments = async ()=>{
    setLoading(true);
    try{
      const data = await tournamentApi.search({
        q: debounced || undefined,
        status: statusFilter!=='all'? mapFrontToBackend(statusFilter as FrontStatus): undefined,
        location: locationFilter!=='all'? locationFilter: undefined,
        page:0,size:50
      });
      const items = (data?.content ?? data ?? []).map((t:any)=>({
        ...t,
        frontStatus: mapBackendToFront(t.status),
        image: t.imageUrl || '/section1.png',
        date: t.date ? new Date(t.date).toLocaleDateString('fr-MA') : ''
      }));
      setTournaments(items);
    }catch(e){
      toast.error('Erreur de chargement');
    }finally{setLoading(false);}
  };

  useEffect(()=>{fetchTournaments();},[debounced,statusFilter,locationFilter]);

  const locations = useMemo(()=>['all', ...Array.from(new Set(tournaments.map(t=>t.location)))], [tournaments]);

  const handleClick = (t:any)=>{setSelected(t);setOpen(true);};
  const handleStatusChange = async (id:string,status:FrontStatus)=>{
    try{
      await tournamentApi.update({id, status: mapFrontToBackend(status)});
      toast.success('Statut mis à jour');
      fetchTournaments();
    }catch{toast.error('Erreur');}
  };
  const handleDelete = async (id:string)=>{
    await tournamentApi.delete(id);
    toast.success('Supprimé');
    setOpen(false); fetchTournaments();
  };
  const handleCreate = async (data:any)=>{
    await tournamentApi.create({...data,status:'PENDING'});
    setFormOpen(false); fetchTournaments(); toast.success('Créé');
  };
  const handleUpdate = async (data:any)=>{
    if(!editing) return;
    await tournamentApi.update({id:editing.id,...data});
    setFormOpen(false); setEditing(null); fetchTournaments(); toast.success('Mis à jour');
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      <img src={selected.image} className="h-40 w-full rounded-lg object-cover"/>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-secondary">{selected.name}</h2>
        <Badge className={`border ${statusColor[selected.frontStatus as FrontStatus]}`}>{t(`manageTournaments.status.${selected.frontStatus}`)}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{selected.description}</p>
      <Separator/>
      <div className="grid grid-cols-2 gap-3">
        {[
          [t('manageTournaments.details.date'), selected.date],
          [t('manageTournaments.details.location'), selected.location],
          [t('manageTournaments.details.club'), selected.clubName],
          [t('manageTournaments.details.entryFee'), `${selected.entryFee} MAD`],
          [t('manageTournaments.details.participants'), `${selected.currentParticipants}/${selected.maxParticipants}`],
        ].map(([k,v])=>(
          <div key={k} className="rounded-lg border p-3">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className="text-sm font-semibold text-secondary block">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('manageTournaments.title')}</h1>
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"/>
              <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('manageTournaments.searchPlaceholder')} className="pl-10"/>
            </div>
            <Button onClick={()=>{setEditing(null);setFormOpen(true);}} className="gap-2"><Plus size={16}/>{t('manageTournaments.add')}</Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('manageTournaments.filterStatus')}</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger className="w-full border-border"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('manageTournaments.all')}</SelectItem>
                  {(['planned','open','ongoing','completed','cancelled'] as FrontStatus[]).map(s=>(
                    <SelectItem key={s} value={s}>{t(`manageTournaments.status.${s}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('manageTournaments.filterLocation')}</Label>
              <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v ?? 'all')}>
                <SelectTrigger className="w-full border-border"><SelectValue/></SelectTrigger>
                <SelectContent>
                  {locations.map(l=> <SelectItem key={l} value={l}>{l==='all'?t('manageTournaments.allLocations'):l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {loading ? <p>Chargement...</p> : tournaments.length===0 ? <p>{t('manageTournaments.empty')}</p> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map(t=>(
            <Card key={t.id} onClick={()=>handleClick(t)} className="cursor-pointer overflow-hidden p-0">
              <div className="relative"><img src={t.image} className="h-48 w-full object-cover"/><Badge className={`absolute right-3 top-3 border ${statusColor[t.frontStatus as FrontStatus]}`}>{t(`manageTournaments.status.${t.frontStatus}`)}</Badge></div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-bold text-secondary">{t.name}</h3>
                <div className="text-xs text-muted-foreground flex gap-2"><MapPin size={12}/>{t.location}</div>
                <div className="text-xs text-muted-foreground flex gap-2"><Calendar size={12}/>{t.date}</div>
                <div className="text-xs text-muted-foreground flex gap-2"><Users size={12}/>{t.currentParticipants}/{t.maxParticipants}</div>
                <div className="mt-auto font-serif text-lg font-bold text-primary">{t.entryFee} MAD</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('manageTournaments.details.title')}</DialogTitle></DialogHeader>
            {detailsContent}
          </DialogContent>
        </Dialog>
      ):(
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>{detailsContent}</DrawerContent>
        </Drawer>
      )}

      <TournamentFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={editing?handleUpdate:handleCreate} initialData={editing}/>
    </div>
  );
}
