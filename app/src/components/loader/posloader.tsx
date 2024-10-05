import React from 'react'

const Posloader = () => {
    return (
        <>
            <tbody className="animate-loader w-full">
                {[...Array(10)].map((_, index) => (
                    <tr key={index} className="w-full">
                        <td className="w-1/4">
                            <div className="h-12 bg-black rounded-sm" />
                        </td>
                        <td className="w-1/4">
                            <div className="h-12 bg-black rounded-sm" />
                        </td>
                        <td className="w-1/4">
                            <div className="h-12 bg-black rounded-sm" />
                        </td>
                        <td className="w-1/4">
                            <div className="h-12 bg-black rounded-sm" />
                        </td>
                    </tr>
                ))}
            </tbody>
        </>
    )
}

export default Posloader
