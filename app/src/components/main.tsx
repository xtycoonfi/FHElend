import React, { useState, useEffect } from 'react'
import Posloader from './loader/posloader'
import LendCmp from './lend'
import BorrowCmp from './borrow'

const Main = () => {

    const [display, setDisplay] = useState(0)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (display == 0) {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        if (display == 1) {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [display])

    return (
        <main className="flex justify-center mx-auto w-full lg:w-[85%] lg:mt-10">
            <div className='bg-ba/25 w-full h-fit'>
                <div className='w-full flex items-center border-b-[0.75px] border-ba py-[1px]'>
                    <button onClick={() => setDisplay(0)} className={`text-sm uppercase w-1/2 font-normal py-1 border-e-[0.75px] border-ba ${display == 0 ? 'bg-w text-bg font-semibold' : 'hover:opacity-75'}`}>Lend</button>
                    <button onClick={() => setDisplay(1)} className={`text-sm uppercase w-1/2 font-normal py-1 ${display == 1 ? 'bg-w text-bg font-semibold' : 'hover:opacity-75'}`}>Borrow</button>
                </div>
                {display == 0 && <>
                    <table className="w-full @[500px]:![--image-size:60px] @[500px]:![--container-padding:.8rem]">
                        <thead className="border-[0.75px] border-ba">
                            <tr className='text-xs font-mono font-normal'>
                                <th className='border-[0.75px] border-ba py-0.5'>Deposit</th>
                                <th className='border-[0.75px] border-ba py-0.5'>Collateral</th>
                                <th className='border-[0.75px] border-ba py-0.5'>APY</th>
                                <th className='border-[0.75px] border-ba py-0.5'>IN/OUT</th>
                            </tr>
                        </thead>
                        {loading ? <Posloader /> : <><LendCmp /></>}
                    </table>
                </>}
                {display == 1 && <>
                    <table className="w-full @[500px]:![--image-size:60px] @[500px]:![--container-padding:.8rem]">
                        <thead className="border-[0.75px] border-ba">
                            <tr className='text-xs font-mono font-normal'>
                                <th className='border-[0.75px] border-ba py-0.5'>Deposit</th>
                                <th className='border-[0.75px] border-ba py-0.5'>Collateral</th>
                                <th className='border-[0.75px] border-ba py-0.5'>APY</th>
                                <th className='border-[0.75px] border-ba py-0.5'>IN/OUT</th>
                            </tr>
                        </thead>
                        {loading ? <Posloader /> : <><BorrowCmp /></>}
                    </table>
                </>}
            </div>
        </main>
    )
}

export default Main
