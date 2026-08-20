import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MembershipSearchBar from '../components/MembershipSearchBar';
import MembershipItem from '../components/MembershipItem';
import MembershipDialog from '../components/MembershipDialog';
import type { Membership, EMStatus } from '../types';
import { useSearchAllMemberships } from '../hooks/useSearchAllMemberships';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function MembershipsPage() {
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [filters, setFilters] = useState<{
    title: string;
    clubName: string;
    price: number | null;
    status: EMStatus;
  }>({
    title: '',
    clubName: '',
    price: null,
    status: null,
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchAllMemberships({
    title: filters.title,
    clubName: filters.clubName,
    status: filters.status,
    price: filters.price,
  });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, hasNextPage);

  const memberships = data?.pages.flatMap((page) => page) ?? [];

  const handleMembershipClick = (membership: Membership) => {
    setSelectedMembership(membership);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main>
        {/* Search bar */}
        <section className="border-b border-border bg-surface mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <MembershipSearchBar onFiltersChange={setFilters} />
          </div>
        </section>

        {/* List */}
        <section className="py-8">
          <div className="mx-auto w-full px-6">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading memberships...</p>
            ) : isError ? (
              <p className="py-8 text-center text-sm text-red-500">Failed to load memberships</p>
            ) : memberships.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No memberships found</p>
            ) : (
              <div className="flex flex-col gap-3">
                {memberships.map((membership, index) => (
                  <MembershipItem
                    key={membership.id || index}
                    membership={membership}
                    onClick={() => handleMembershipClick(membership)}
                  />
                ))}
              </div>
            )}

            {/* Infinite scroll loader trigger */}
            <div ref={loadMoreRef} className="py-4 text-center">
              {isFetchingNextPage && (
                <p className="text-sm text-muted-foreground">Loading more memberships...</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MembershipDialog
        membership={selectedMembership}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedMembership(null);
        }}
      />
    </div>
  );
}