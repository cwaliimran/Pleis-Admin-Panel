import { useState, useMemo } from 'react';
import { mockOrders } from './mockOrders';
import type { TabId } from './types';

export const useOrders = () => {
  const [activeTab, setActiveTab] = useState<TabId>('active');
  const [search, setSearch] = useState('');
  const [isOrderingEnabled, setIsOrderingEnabled] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const orders = useMemo(() => {
    const list = mockOrders[activeTab];
    if (!search) return list;

    const term = search.toLowerCase();
    return list.filter(
      (o) =>
        o.customerName.toLowerCase().includes(term) || o.deliveryLabel.toLowerCase().includes(term) || o.contact.email.toLowerCase().includes(term)
    );
  }, [activeTab, search]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    isOrderingEnabled,
    setIsOrderingEnabled,
    orders,
    expandedId,
    toggleExpand,
  };
};
