'use client';

import { useShop } from '@/lib/shop-context';
import { Icon } from './Icons';

export default function Announcement() {
  const { announcementDismissed, dismissAnnouncement } = useShop();

  if (announcementDismissed) return null;

  return (
    <div className="announcement" id="announcement">
      <p>
        <Icon name="truck" /> Free delivery on orders over $75
      </p>
      <button
        className="announcement-close"
        aria-label="Dismiss announcement"
        onClick={dismissAnnouncement}
      >
        <Icon name="close" />
      </button>
    </div>
  );
}
