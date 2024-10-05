import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Chain } from 'wagmi/chains';

const fhenixHelium: Chain = {
    testnet: true,
    id: 8008135,
    name: 'Fhenix Helium',
    nativeCurrency: { name: 'tETH', symbol: 'tETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://api.helium.fhenix.zone'] } },
    blockExplorers: { default: { name: 'Fhenix Helium Explorer', url: 'https://explorer.testnet.fhenix.zone' } },
}

export const config = createConfig({
    chains: [fhenixHelium],
    connectors: [
        injected({ shimDisconnect: true, unstable_shimAsyncInject: 2_000 }),
    ],
    // multiInjectedProviderDiscovery: false, 
    // ssr: true, 
    // syncConnectedChain: false, 
    // batch: { multicall: true }, // => https://viem.sh/docs/clients/custom.html#batch-optional
    // cacheTime: 4_000, // => https://viem.sh/docs/clients/public.html#cachetime-optional
    // pollingInterval: 4_000, // => https://viem.sh/docs/clients/custom.html#pollinginterval-optional
    transports: {
        [fhenixHelium.id]: http('https://api.helium.fhenix.zone'),
    },
})