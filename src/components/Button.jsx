import React, { lazy, Suspense } from 'react';

const WalletMultiButton = lazy(() => import("@solana/wallet-adapter-react-ui").then(module => ({ default: module.WalletMultiButton })));

const WalletMultiButtonDynamic = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WalletMultiButton />
    </Suspense>
  );
};

export default WalletMultiButtonDynamic;
