import React from "react"

export const Grid = (arr) => {

    return(
        <>
            {arr.map((row) => {
                return(
                    <div>
                        {row.map((node) => {
                            return(
                                <div>
                                    {node}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </>
    )
} 