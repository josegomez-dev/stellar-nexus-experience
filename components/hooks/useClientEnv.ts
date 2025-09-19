import { useEffect, useState } from 'react';
import clientEnv from '@/lib/client-env';

export function useClientEnv() {
  const [isClient, setIsClient] = useState(false);
  const [env, setEnv] = useState<typeof clientEnv | null>(null);

  useEffect(() => {
    setIsClient(true);
    setEnv(clientEnv);
  }, []);

  return {
    isClient,
    env,
    // Safe accessors that work during SSR and client
    stellar: {
      network: isClient ? env?.NEXT_PUBLIC_STELLAR_NETWORK : 'TESTNET',
      horizonUrl: isClient
        ? env?.NEXT_PUBLIC_STELLAR_NETWORK === 'PUBLIC'
          ? env?.NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC
          : env?.NEXT_PUBLIC_STELLAR_HORIZON_TESTNET
        : 'https://horizon-testnet.stellar.org',
    },
    asset: {
      defaultAsset: {
        code: isClient ? env?.NEXT_PUBLIC_DEFAULT_ASSET_CODE : 'USDC',
        issuer: isClient
          ? env?.NEXT_PUBLIC_DEFAULT_ASSET_ISSUER
          : 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
        decimals: 10000000,
      },
      platformFee: isClient ? env?.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE : 4,
      defaultEscrowDeadlineDays: isClient ? env?.NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS : 7,
    },
    app: {
      name: isClient ? env?.NEXT_PUBLIC_APP_NAME : 'Stellar Nexus',
      version: isClient ? env?.NEXT_PUBLIC_APP_VERSION : '0.1.0',
      debugMode: isClient ? env?.NEXT_PUBLIC_DEBUG_MODE : false,
      platformPublicKey: isClient ? env?.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY : '',
    },
  };
}





