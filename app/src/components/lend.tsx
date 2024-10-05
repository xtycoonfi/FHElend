import React, { useState, useRef, useEffect } from 'react'
import LendModal from './modals/lend'

const Lend = () => {

    const LendModalRef = useRef<HTMLDivElement>(null)
    const [isLendModalOpen, setLendModalOpen] = useState(false)
    const handleLendModal = () => { setLendModalOpen(prevState => !prevState) }

    const [loadingAPY, setLoadingAPY] = useState(false)

    // const [posId, setPosId] = useState(null)

    const d = { name: 'testDeposit', symbol: 'DEP', address: '0x', decimals: 18 }
    const c = { name: 'testCollateral', symbol: 'COL', address: '0x', decimals: 18 }

    return (
        <>
            <tr className="w-full font-mono">
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>FUSD</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>WETH</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        {loadingAPY ? <>
                            <div className='flex justify-center mx-auto h-5 w-20 animate-loader bg-bg' />
                        </> : <>
                            <span className='flex justify-center mx-auto text-green'>12%</span>
                        </>}
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm">
                        <div className='h-full w-full p-1.5'>
                            <button onClick={() => handleLendModal()} className='w-full h-full flex justify-center items-center bg-w text-bg rounded-sm font-[500] uppercase'>
                                Lend
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
            <>
                {isLendModalOpen && <><LendModal deposit={d} collateral={c} showModal={isLendModalOpen} closeModal={handleLendModal} ref={LendModalRef} /></>}
            </>
        </>
    )
}

export default Lend
