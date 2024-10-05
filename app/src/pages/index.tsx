import React, { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Main from '../components/main';

import { useAccount } from 'wagmi';

export default function Home() {

  const { isConnected } = useAccount()

  // useEffect(() => {
  //   if (isConnected) console.log('Force switch to FHE')
  // }, [isConnected])

  return <>
    <Head>
      <title></title>
    </Head>
    <Navbar />
    <Main />
  </>
}
