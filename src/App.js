import React, { useState, useEffect } from "react"
import { Grid } from "./Grid"
import { useInterval } from "./useInterval"
import { randomNumber } from "./randomNumber"

const speed=200
const gridSize= 40

const arrInitialize = () => {
    let arr = new Array(gridSize)

    for (let i=0; i<gridSize ; i++){
        arr[i] = new Array(gridSize)
    }

    return arr
}


function App() {

    var foodAte = false
    // Setting States
    const [arr, setArr] = useState(arrInitialize)
    const [dots, setDots] = useState([[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]])
    const [delay, setDelay] = useState(speed)
    const [food, setFood] = useState([10,10])
    const [direction, setDirection] = useState("RIGHT")



    // Array Functions

    function arrErase(anyArr) {
        let thisArr = [...anyArr]

        for (let i=0 ; i<gridSize ; i++) {
            for (let j=0 ; j<gridSize ; j++) {
                thisArr[i][j] = <div className="block"></div>
            }
        }
        return thisArr
    }

    // Snake
    function snakeMove(){
        let snakeDots = [...dots]
        let head = snakeDots[snakeDots.length - 1]

        switch (direction) {
            case "RIGHT":
                head = [head[0] + 1, head[1]]
                break
            case "DOWN":
                head = [head[0], head[1] + 1]
                break
            case "LEFT":
                head = [head[0] - 1, head[1]]
                break
            case "UP":
                head = [head[0], head[1] - 1]
                break
            default:
                break
        }

        checkForFood(head)
        snakeDots.push(head)
        if (foodAte===false){
            snakeDots.shift()
        } 
        else {
            setDelay(prevState => prevState * 0.9)
            setFood(randomNumber(gridSize-1,0))
            foodAte=false
        }
        
        
        if (
            checkHitBoundary(head) ||
            checkHitBody(head)
        ) return

        else{
            setDots(snakeDots)
        }
        
    }

    // Snake Update

    function update(){

        let array = arrErase(arr)

        // Snake add
        for (let i=0; i<dots.length; i++) {
            array[dots[i][0]][dots[i][1]] = <div className="dot"></div>
        }

        // Food add

        array[food[0]][food[1]] = <div className="dot"></div>

        
        setArr(array)
    }

    // Keyboard Event
    function logKey(e){
        switch (e.key) {
            case "ArrowUp":
                setDirection(prevState =>{
                    if (prevState==="DOWN") {
                        return prevState
                    }
                    else return "UP"
                })
                break
            case "ArrowDown":
                setDirection(prevState =>{
                    if (prevState==="UP") {
                        return prevState
                    }
                    else return "DOWN"
                })
                break
            case "ArrowLeft":
                setDirection(prevState =>{
                    if (prevState==="RIGHT") {
                        return prevState
                    }
                    else return "LEFT"
                })
                break
            case "ArrowRight":
                setDirection(prevState =>{
                    if (prevState==="LEFT") {
                        return prevState
                    }
                    else return "RIGHT"
                })
                break
            default:
                break
        }
    }


    // LifeCycle Functions

    useInterval(() => {
        snakeMove()
    } ,delay)

    useEffect(() => {
        document.addEventListener("keydown",logKey)
        setArr(arrErase(arr))
    },[])

    useEffect(() => {        
        update()
    },[dots])



    // Cheker Functions

    function checkHitBoundary(head){
        if (head[0]>39 || head[0]<0) {
            gameReset()
            return true
        }
        else if (head[1]>39 || head[1]<0) {
            gameReset()
            return true
        }
        else return false
    }

    function checkHitBody(head){

        for (let i=1 ; i < dots.length ; i++) {
            if ((dots[i][0]===head[0]) && (dots[i][1]===head[1])) {
                gameReset()
                return true
            }
        }
        return false
    }

    function checkForFood(head){
        if ((head[0]===food[0]) && (head[1]===food[1])) {
            foodAte = true
            return true
        }
        return false
    }

    // Game Functions 

    function gameReset(){
        setArr(arrErase(arr))
        setDelay(speed)
        setDirection("RIGHT")
        setDots([[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]])
        alert("Game over!!!")
    }



        



    return(
        <div className="container">
            {Grid(arr)}
        </div>
    )
}

export default App;