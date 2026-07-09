import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">{pathname} — à venir</p>
    </div>
  );
}