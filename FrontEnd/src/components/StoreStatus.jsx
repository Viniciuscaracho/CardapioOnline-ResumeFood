import React from 'react';
import { isStoreOpen } from '../lib/utils';

export default function StoreStatus() {
  const [open, setOpen] = React.useState(isStoreOpen());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOpen(isStoreOpen());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {open ? (
        <span className="text-green-600 font-bold">Loja Aberta</span>
      ) : (
        <span className="text-red-600 font-bold">Loja Fechada</span>
      )}
    </div>
  );
} 