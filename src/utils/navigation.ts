import { CategoryId } from '../types';

export interface NavigationParams {
  view: 'store' | 'admin';
  category: CategoryId | 'all';
  q: string;
  productId: string | null;
  cart: boolean;
  checkout: boolean;
  trackingId: string | null;
  location: boolean;
}

export interface NavigationHistoryState extends NavigationParams {
  gks_nav: number;
  scrollY?: number;
  isRoot?: boolean;
}

/**
 * Parses application navigation state from URL query parameters.
 */
export function parseNavFromQuery(search: string): NavigationParams {
  const sp = new URLSearchParams(search);
  return {
    view: sp.get('view') === 'admin' ? 'admin' : 'store',
    category: (sp.get('category') as CategoryId) || 'all',
    q: sp.get('q') || '',
    productId: sp.get('product') || null,
    cart: sp.get('cart') === '1',
    checkout: sp.get('checkout') === '1',
    trackingId: sp.get('tracking') || null,
    location: sp.get('location') === '1',
  };
}

/**
 * Serializes application navigation parameters into a URL query string.
 */
export function serializeNavToQuery(params: Partial<NavigationParams>): string {
  const sp = new URLSearchParams();
  if (params.view === 'admin') sp.set('view', 'admin');
  if (params.category && params.category !== 'all') sp.set('category', params.category);
  if (params.q && params.q.trim()) sp.set('q', params.q.trim());
  if (params.productId) sp.set('product', params.productId);
  if (params.cart) sp.set('cart', '1');
  if (params.checkout) sp.set('checkout', '1');
  if (params.trackingId) sp.set('tracking', params.trackingId);
  if (params.location) sp.set('location', '1');

  const qs = sp.toString();
  return qs ? `?${qs}` : window.location.pathname;
}
