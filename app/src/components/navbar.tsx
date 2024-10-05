import React, { useEffect } from 'react'
import Connector from './connector'

const Navbar = () => {
    return (
        <>
            <nav className='py-2 px-2.5 w-full border-b-[0.5px] border-ba justify-between flex'>
                <div className='flex items-center'>
                    <span className='pl-1.5 uppercase font-bold text-base'>Fhelend</span>
                </div>
                {/* <div className='flex items-center'>
                    <a href='' className='uppercase text-xs'>markets</a>
                </div> */}
                <Connector />
            </nav>
        </>
    )
}

export default Navbar
