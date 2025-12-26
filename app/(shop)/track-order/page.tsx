import type { Metadata } from 'next';
import TrackOrderClient from './track-order-client';

export const metadata: Metadata = {
  title: 'Track Your Order | DuBuBu',
  description: 'Check the status of your DuBuBu order by entering your order number and email address.',
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
