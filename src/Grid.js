import React from "react"

// Funciton to render grid on every snake movement
export const Grid = (arr) => {

    return(
        <>
            {arr.map((row, rowId) => {
                return(
                    <div key={rowId}>
                        {row.map((node, nodeId) => {
                            return(
                                <div key={nodeId}>
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