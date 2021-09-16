/*
<----------------------->
SNAKE GAME - WITH REACT
<----------------------->
Version: 1.0.0
*/

// React gerneral imports
import React, { useState, useEffect } from "react"

// Custom hook and supporting functions/ components
import { useInterval } from "./useInterval"
import { randomNumber } from "./randomNumber"
import { Grid } from "./Grid"

// FireStore database import
import db from "../../Firebase/firebase"
import "./Snake.css"

// Firebase Functions
import { collection , onSnapshot, doc, setDoc } from 'firebase/firestore';

// General configurations for the game
const speed=200
const gridSize= 40
var moved = false

// Grid area intialize funtion using array
const arrInitialize = () => {
    let arr = new Array(gridSize)

    for (let i=0; i<gridSize ; i++){
        arr[i] = new Array(gridSize)
    }

    return arr
}

function App(props) {

    var foodAte = false

    // Setting States
    const [arr, setArr] = useState(arrInitialize)
    const [dots, setDots] = useState([[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]])
    const [delay, setDelay] = useState(speed)
    const [food, setFood] = useState([10,10])
    const [direction, setDirection] = useState("RIGHT")
    const [highScore, setHighScore] = useState(0)
    const [currentScore, setCurrentScore] = useState(0)

    // Array Functions
    function arrErase(anyArr) {
        let thisArr = [...anyArr]

        for (let i=0 ; i<gridSize ; i++) {
            for (let j=0 ; j<gridSize ; j++) {
                thisArr[i][j] = <div className="Snake__block"></div>
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
            setCurrentScore(prevState => prevState + 100)
            if (currentScore+100>highScore) updateHighscore(currentScore+100)
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
            array[dots[i][0]][dots[i][1]] = <div className="Snake__dot"></div>
        }

        // Food add

        array[food[0]][food[1]] = <div className="Snake__dot"></div>

        
        setArr(array)
        moved = true
    }

    // Keyboard Event
    function logKey(e){
        if (moved === true){
            switch (e.key) {
                case "ArrowUp":
                    setDirection(prevState =>{
                        if (prevState==="DOWN") {
                            return prevState
                        }
                        else return "UP"
                    })
                    moved = false
                    break
                case "ArrowDown":
                    setDirection(prevState =>{
                        if (prevState==="UP") {
                            return prevState
                        }
                        else return "DOWN"
                    })
                    moved = false
                    break
                case "ArrowLeft":
                    setDirection(prevState =>{
                        if (prevState==="RIGHT") {
                            return prevState
                        }
                        else return "LEFT"
                    })
                    moved = false
                    break
                case "ArrowRight":
                    setDirection(prevState =>{
                        if (prevState==="LEFT") {
                            return prevState
                        }
                        else return "RIGHT"
                    })
                    moved = false
                    break
                default:
                    break
            }
        }
    }

    // LifeCycle Functions
    useInterval(() => {
        snakeMove()
    } ,delay)

    useEffect(() => {
        window.addEventListener("keydown",logKey)
        setArr(arrErase(arr))
        console.log("Event added!!!")

        onSnapshot(collection(db,"snake-game"),((s) => {
            let score = 0
            
            s.docs.forEach((doc) => {score = doc.data().score})

            setHighScore(score)
        }))

        return (
            () => {
                window.removeEventListener("keydown",logKey)
            }   
        )
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

    // Updates High score with new value
    function updateHighscore(num) {
        setDoc(doc(db,"/snake-game/0h2CCaqEHuFj8XR6EwG4"),{score: num})
    }

    // Game Functions 
    function gameReset(){
        let final_length = dots.length
        setCurrentScore(0)
        setArr(arrErase(arr))
        setDelay(speed)
        setDirection("RIGHT")
        setDots([[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]])

        alert("Game over!!!\nYour final length was: " + final_length)
    }

    return(
        <>
            <div>Current score is: {currentScore}<br/>All time Highscore is: {highScore}</div>
            <div className="Snake__container">
                {Grid(arr)}
            </div>
        </>
    )
}

export default App;