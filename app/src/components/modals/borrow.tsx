import React, { forwardRef, useEffect } from 'react'

type Token = {
    name: string,
    symbol: string,
    address: string,
    decimals: number
}

interface BorrowModalProps {
    collateral: Token,
    deposit: Token,
    apy: number,
    showModal: boolean
    closeModal: () => void
}

const BorrowModal = forwardRef<HTMLDivElement, BorrowModalProps>(({ collateral, deposit, apy, showModal, closeModal }, ref) => {
    return (
        <div ref={ref} className={`h-screen fixed inset-0 z-50 ${showModal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`h-screen fixed inset-0 bg-bg transition-opacity duration-300 ${showModal ? 'opacity-70' : 'opacity-0'}`} onClick={closeModal} />
            <div className={`h-fit absolute lg:h-auto lg:inset-0 left-0 right-0 bottom-0 lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-lg bg-bg border-t-[0.25px] border-ba lg:border-[0.75px] lg:rounded-sm shadow-lg overflow-hidden transition-all duration-1000 ease-out ${showModal ? 'translate-y-0 opacity-100 ' : 'translate-y-full lg:translate-y-0 opacity-0'}`}>
                <div className='flex justify-between mx-auto items-center p-3.5 border-b-[0.25px] border-ba'>
                    <h3 className='text-lg mt-0.5 font-normal'>Borrow {deposit.symbol} for <span className='text-red mx-0.5 font-mono'>-{apy}%</span> APY</h3>
                    <button onClick={() => closeModal()} type="button" aria-expanded="false" id="react-aria4544150664-:r1:" aria-label="Menu" className="items-center flex justify-center select-none bg-b hover:opacity-75 rounded-sm whitespace-nowrap font-bold focus:outline-none focus-visible:outline-main focus-visible:outline-offset-0 text-sm focus-visible:text-white transition duration-200 ease-in-out" data-rac="">
                        <svg className="w-[30px] h-[30px] p-[1px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba '>
                    <div className='h-40 bg-bg'>Dep collat {collateral.symbol} + view collat supplied + calc max borrow + deposit asset</div>
                </div>
                <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba '>
                    <div className='flex justify-center mx-auto'>cta</div>
                </div>
            </div>
        </div>
    )
})

export default BorrowModal