import React, { forwardRef, useEffect, useState, useRef } from 'react'

import { FHELend, RPC, UNDERLYING_SYMBOL, COLLATERAL_SYMBOL, DEBT_SHARE_ADDRESS, DEBT_SHARE_SYMBOL } from '../../utils/const'
import FHELend_ABI from '../../utils/ABI.json'

import { ethers } from 'ethers'
import { useAccount, useReadContract } from 'wagmi'
import { minERC20ABI } from '../../utils/minERC20'

import DepositCollateralModal from './depositCollateral'
import BorrowUnderlyingModal from './borrowUnderlying'
import RepayDebtModal from './repayDebt'
import WidthrawCollateralModal from './withdrawCollateral'

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

    const provider = new ethers.JsonRpcProvider(RPC)
    const FHELend_contract = new ethers.Contract(FHELend, FHELend_ABI, provider)

    const [display, setDisplay] = useState('borrow')
    const { isConnected, address } = useAccount()

    //@ts-ignore
    const { data: balanceDebtShare, isLoading: loadingDebtShare } = useReadContract({ address: DEBT_SHARE_ADDRESS, abi: minERC20ABI, functionName: 'balanceOf', args: [address], enabled: isConnected && !!address })

    const [loadingPosition, setLoadingPosition] = useState(true)
    const [balanceCollateralSupplied, setBalanceCollateralSupplied] = useState('')
    const [balanceUnderlyingSupplied, setBalanceUnderlyingSupplied] = useState('')
    const [healthScore, setHealthScore] = useState('')

    async function getUserPosition(address: string) {
        setLoadingPosition(true)
        const pos = await FHELend_contract.positions(address)
        setBalanceCollateralSupplied(pos.collateral_amount)
        setBalanceUnderlyingSupplied(pos.underlying_amount)
        const health = await FHELend_contract.healthFactor(address)
        setHealthScore(parseFloat(ethers.formatEther(health)).toFixed(2))
        setLoadingPosition(false)
    }

    useEffect(() => {
        if (address) {
            setLoadingPosition(true)
            getUserPosition(address)
        }
    }, [address])

    const DepositCollateralModalRef = useRef<HTMLDivElement>(null)
    const [isDepositCollateralModalOpen, setDepositCollateralModalOpen] = useState(false)
    const handleDepositCollateralModal = () => { setDepositCollateralModalOpen(prevState => !prevState) }

    const BorrowUnderlyingModalRef = useRef<HTMLDivElement>(null)
    const [isBorrowUnderlyingModalOpen, setBorrowUnderlyingModalOpen] = useState(false)
    const handleBorrowUnderlyingModal = () => { setBorrowUnderlyingModalOpen(prevState => !prevState) }

    const RepayDebtModalRef = useRef<HTMLDivElement>(null)
    const [isRepayDebtModalOpen, setRepayDebtModalOpen] = useState(false)
    const handleRepayDebtModal = () => { setRepayDebtModalOpen(prevState => !prevState) }

    const WidthrawCollateralModalRef = useRef<HTMLDivElement>(null)
    const [isWidthrawCollateralModalOpen, setWidthrawCollateralModalOpen] = useState(false)
    const handleWidthrawCollateralModal = () => { setWidthrawCollateralModalOpen(prevState => !prevState) }

    return (
        <>
            <div ref={ref} className={`h-screen fixed inset-0 z-50 ${showModal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className={`h-screen fixed inset-0 bg-bg transition-opacity duration-300 ${showModal ? 'opacity-70' : 'opacity-0'}`} onClick={closeModal} />
                <div className={`h-fit absolute lg:h-auto lg:inset-0 left-0 right-0 bottom-0 lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-lg bg-bg border-t-[0.25px] border-ba lg:border-[0.75px] lg:rounded-sm shadow-lg overflow-hidden transition-all duration-1000 ease-out ${showModal ? 'translate-y-0 opacity-100 ' : 'translate-y-full lg:translate-y-0 opacity-0'}`}>
                    <div className='flex justify-between mx-auto items-center p-3.5 border-b-[0.25px] border-ba'>
                        <h3 className='text-lg mt-0.5 font-normal'>Borrow {deposit.symbol} for <span className='text-red mx-0.5 font-mono'>{apy.toFixed(2)}%</span> APY on {collateral.symbol}</h3>
                        <button onClick={() => closeModal()} type="button" aria-expanded="false" id="react-aria4544150664-:r1:" aria-label="Menu" className="items-center flex justify-center select-none bg-ba hover:opacity-75 rounded-sm whitespace-nowrap font-bold focus:outline-none focus-visible:outline-main focus-visible:outline-offset-0 text-sm focus-visible:text-white transition duration-200 ease-in-out" data-rac="">
                            <svg className="w-[30px] h-[30px] p-[1px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className='w-full flex items-center border-b-[0.75px] border-ba py-[1px]'>
                        <button onClick={() => setDisplay('borrow')} className={`text-sm uppercase w-1/2 font-normal py-1 border-e-[0.75px] border-ba ${display == 'borrow' ? 'bg-w text-bg font-[500]' : 'hover:opacity-75'}`}>Borrow</button>
                        <button onClick={() => setDisplay('repay')} className={`text-sm uppercase w-1/2 font-normal py-1 ${display == 'repay' ? 'bg-w text-bg font-[500]' : 'hover:opacity-75'}`}>Repay</button>
                    </div>
                    {display === 'borrow' && <>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba '>
                            <div className='h-80 bg-ba'>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Your health score</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5 flex items-center'>{!loadingPosition ? <span className='mx-2'>{healthScore !== '' ? <>{healthScore}</> : <>10</>}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}
                                                <svg className={`w-4 h-4 ${parseFloat(healthScore) < 1.25 ? 'text-red' : 'text-green'}`} fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 8V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm2-4v5a1 1 0 0 1-1 1H4v4h5a1 1 0 0 1 1 1v5h4v-5a1 1 0 0 1 1-1h5v-4h-5a1 1 0 0 1-1-1V4z" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Your supplied collateral</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5'>{!loadingPosition ? <span className='mx-2'>{balanceCollateralSupplied !== '' ? <>{Number(ethers.formatUnits(balanceCollateralSupplied, 18)).toFixed(2)}</> : <>0</>}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}{collateral.symbol}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Your debt share</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5'>{!loadingDebtShare ? <span className='mx-2'>{Number(ethers.formatUnits(balanceDebtShare, 18)).toFixed(2)}</span> : <div className='bg-bg w-10 h-5 animate-loader' />}{DEBT_SHARE_SYMBOL}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Your current debt</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5'>{!loadingPosition ? <span className='mx-2'>{balanceUnderlyingSupplied !== '' ? <>{Number(ethers.formatUnits(balanceUnderlyingSupplied, 18)).toFixed(2)}</> : <>0</>}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}{UNDERLYING_SYMBOL}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba'>
                            <button onClick={() => handleDepositCollateralModal()} className='flex justify-center mx-auto bg-w py-1.5 text-bg font-[500] uppercase w-full'>
                                Deposit {collateral.symbol}
                            </button>
                            <button onClick={() => handleBorrowUnderlyingModal()} className='flex justify-center mx-auto bg-w py-1.5 mt-1.5 text-bg font-[500] uppercase w-full'>
                                Borrow {UNDERLYING_SYMBOL}
                            </button>
                        </div>
                    </>}
                    {display === 'repay' && <>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba '>
                            <div className='h-60 bg-ba'>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Your health score</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5 flex items-center'>{!loadingPosition ? <span className='mx-2'>{healthScore !== '' ? <>{healthScore}</> : <>10</>}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}
                                                <svg className={`w-4 h-4 ${parseFloat(healthScore) < 1.25 ? 'text-red' : 'text-green'}`} fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 8V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm2-4v5a1 1 0 0 1-1 1H4v4h5a1 1 0 0 1 1 1v5h4v-5a1 1 0 0 1 1-1h5v-4h-5a1 1 0 0 1-1-1V4z" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Collateral to recover</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5'>{!loadingPosition ? <span className='mx-2'>{balanceCollateralSupplied !== '' ? <>{Number(ethers.formatUnits(balanceCollateralSupplied, 18)).toFixed(2)}</> : <>0</>}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}{collateral.symbol}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-20 bg-ba'>
                                    <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                        <div className='w-full mx-2.5 justify-between flex items-center'>
                                            <span>Debt to be repaid</span>
                                            {/* @ts-ignore */}
                                            <span className='font-mono pl-1.5'>{!loadingPosition ? <span className='mx-2'>{balanceUnderlyingSupplied !== '' ? <>{Number(ethers.formatUnits(balanceUnderlyingSupplied, 18)).toFixed(2)}</> : <>0</>}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}{UNDERLYING_SYMBOL}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba'>
                            <button onClick={() => handleRepayDebtModal()} className='flex justify-center mx-auto bg-w py-1.5 text-bg font-[500] uppercase w-full'>
                                Repay {UNDERLYING_SYMBOL} debt
                            </button>
                            <button onClick={() => handleWidthrawCollateralModal()} className='flex justify-center mx-auto bg-w py-1.5 mt-1.5 text-bg font-[500] uppercase w-full'>
                                Withdraw {COLLATERAL_SYMBOL} collateral
                            </button>
                        </div>
                    </>}
                </div>
            </div>
            <>
                {isDepositCollateralModalOpen && <><DepositCollateralModal showModal={isDepositCollateralModalOpen} closeModal={handleDepositCollateralModal} ref={DepositCollateralModalRef} /></>}
                {isBorrowUnderlyingModalOpen && <><BorrowUnderlyingModal showModal={isBorrowUnderlyingModalOpen} closeModal={handleBorrowUnderlyingModal} ref={BorrowUnderlyingModalRef} /></>}
                {isRepayDebtModalOpen && <><RepayDebtModal showModal={isRepayDebtModalOpen} closeModal={handleRepayDebtModal} ref={RepayDebtModalRef} /></>}
                {isWidthrawCollateralModalOpen && <><WidthrawCollateralModal showModal={isWidthrawCollateralModalOpen} closeModal={handleWidthrawCollateralModal} ref={WidthrawCollateralModalRef} /></>}
            </>
        </>
    )
})

export default BorrowModal