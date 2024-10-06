import React from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Main from '../components/main';

export default function Home() {

  return <>
    <Head>
      <title>FHElend</title>
    </Head>
    <Navbar />
    <Main />
  </>
}
