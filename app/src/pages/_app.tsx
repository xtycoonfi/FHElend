'use client'
import "../styles/globals.css";
import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

const ms = Montserrat({ weight: "variable", subsets: ["vietnamese"] })

import { config } from "../utils/config";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

import { useAccount } from "wagmi"
import { switchChain, getChainId } from '@wagmi/core'

const Middleware = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount()
  const chainId = getChainId(config)

  useEffect(() => {
    if (isConnected && chainId !== config.chains[0].id && switchChain) switchChain(config, { chainId: config.chains[0].id })
  }, [isConnected, chainId])
  return <>{children}</>
}

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Middleware>
          <Component className={`${ms}`} {...pageProps} />
        </Middleware>
      </QueryClientProvider>
    </WagmiProvider>
  </>
}
