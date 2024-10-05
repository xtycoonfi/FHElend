import React, { forwardRef, useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi'

interface ConnectModalProps {
    showModal: boolean
    closeModal: () => void
}

const ConnectModal = forwardRef<HTMLDivElement, ConnectModalProps>(({ showModal, closeModal }, ref) => {

    const { connect, connectors } = useConnect()
    const { isConnected } = useAccount()

    async function connectWallet(connector: any) { connect({ connector }) }

    useEffect(() => { if (isConnected) closeModal() }, [isConnected])

    return (
        <div ref={ref} className={`h-screen fixed inset-0 z-50 ${showModal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`h-screen fixed inset-0 bg-bg transition-opacity duration-300 ${showModal ? 'opacity-70' : 'opacity-0'}`} onClick={closeModal} />
            <div className={`h-fit absolute lg:h-auto lg:inset-0 left-0 right-0 bottom-0 lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-sm bg-bg border-t-[0.25px] border-ba lg:border-[0.75px] lg:rounded-sm shadow-lg overflow-hidden transition-all duration-1000 ease-out ${showModal ? 'translate-y-0 opacity-100 ' : 'translate-y-full lg:translate-y-0 opacity-0'}`}>
                <div className='flex justify-between mx-auto items-center p-3.5 border-b-[0.25px] border-ba'>
                    <h3 className='text-lg mt-0.5 font-normal'>Connect Wallet</h3>
                    <button onClick={() => closeModal()} type="button" aria-expanded="false" id="react-aria4544150664-:r1:" aria-label="Menu" className="items-center flex justify-center select-none bg-b hover:opacity-75 rounded-sm whitespace-nowrap font-bold focus:outline-none focus-visible:outline-main focus-visible:outline-offset-0 text-sm focus-visible:text-white transition duration-200 ease-in-out" data-rac="">
                        <svg className="w-[30px] h-[30px] p-[1px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className='block justify-center mx-auto p-3.5'>
                    {connectors.map((connector) => (
                        <button key={connector.id} onClick={() => connectWallet(connector)} className={`mb-2 py-3 flex font-normal text-sm rounded-sm bg-ba hover:opacity-70 disabled:hover:opacity-100 w-full`}>
                            {connector.icon !== undefined ? (
                                <img src={connector.icon} alt={connector.name} width={20} height={20} className="ml-2.5" />
                            ) : (
                                <>
                                    {connector.id === 'injected' && <img src="/wallets/browser.svg" alt={connector.name} width={20} height={20} className="ml-2.5" />}
                                </>
                            )}
                            <span className="text-center ml-3.5">{connector.id !== 'injected' ? connector.name : 'Injected Provider'}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default ConnectModal
