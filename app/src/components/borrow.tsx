import React, { useState, useRef, useEffect } from 'react'
import BorrowModal from './modals/borrow'

const Borrow = () => {

    const BorrowModalRef = useRef<HTMLDivElement>(null)
    const [isBorrowModalOpen, setBorrowModalOpen] = useState(false)
    const handleBorrowModal = () => { setBorrowModalOpen(prevState => !prevState) }

    const [loadingAPY, setLoadingAPY] = useState(true)

    useEffect(() => {
        setLoadingAPY(true)
        setTimeout(() => {
            setLoadingAPY(false)
        }, 500)
    })

    //const [posId, setPosId] = useState(null)

    const c = { name: 'testCollateral', symbol: 'COL', address: '0x', decimals: 18 }
    const d = { name: 'testDeposit', symbol: 'DEP', address: '0x', decimals: 18 }

    return (
        <>
            <tr className="w-full font-mono">
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>WETH</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>FUSD</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        {loadingAPY ? <>
                            <div className='flex justify-center mx-auto h-5 w-20 animate-loader bg-bg' />
                        </> : <>
                            <span className='flex justify-center mx-auto text-red'>-12%</span>
                        </>}
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm">
                        <div className='h-full w-full p-1.5'>
                            <button onClick={() => handleBorrowModal()} className='w-full h-full flex justify-center items-center bg-w text-bg rounded-sm font-[500] uppercase'>
                                Borrow
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
            <>
                {isBorrowModalOpen && <><BorrowModal collateral={c} deposit={d} showModal={isBorrowModalOpen} closeModal={handleBorrowModal} ref={BorrowModalRef} /></>}
            </>
        </>
    )
}

export default Borrow
