import { useState, useEffect } from "react";
import { charactersInformation } from "./characters"
function Board() {
    const [franchise, setFranchise] = useState(null)
    const [charactersInfo, setCharacters] = useState(charactersInformation) //all characters objects info
    const [selected, setSelected] = useState([])
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    let characters = []
    useEffect(
        () => {
            if(franchise!==null){
                
                if (charactersInfo[franchise].characters.filter((character)=>character.imageUrl==null).length>0) {

                let urls = charactersInfo[franchise].characters.map((character)=>{
                    return 'https://api.giphy.com/v1/gifs/'+character.fetchId+'?api_key=fhn9ubjtTqPFIJNCaNX6cRVWDEkAyFdS&rating=r'
                })                

                let promises = charactersInfo[franchise].characters.map((character)=>{
                    return fetch('https://api.giphy.com/v1/gifs/'+character.fetchId+'?api_key=fhn9ubjtTqPFIJNCaNX6cRVWDEkAyFdS&rating=r', {mode: 'cors'})
                })
                Promise.all(promises).then(responses=>{
                    let jsonPromises = responses.map(response=>response.json())
                    Promise.all(jsonPromises).then(response=>{
                        let charactersCopy = {...charactersInfo}
                        for(let i=0;i<charactersCopy[franchise].characters.length;i++){
                            if(response[i].meta.status==200){
                                charactersCopy[franchise].characters[i].imageUrl = response[i].data.images.original.url
                            }
                            
                        }

                        setCharacters(charactersCopy)
                    })
    
                })
            }
            }
            
        }
        , [franchise])

        useEffect(
            ()=>{
                document.querySelector(':root').className = franchise;
            }
            
            ,[franchise]
        )



    if (franchise !== null) {
        characters = shuffle(charactersInfo[franchise].characters)
    }

    function selectCard(name) {
        if (!selected.includes(name)) {
            setScore(score+1)
            setSelected([...selected,name])
        } else {
            if(score>bestScore){
                setBestScore(score)
            }
            setScore(0)
            setSelected([])
        }
    }
    
    function backToMenu(){
        setSelected([])
        setFranchise(null)
        setScore(0)
        setBestScore(0)
    }

    return (
        franchise == null ? <OptionMenu onChooseFranchise={setFranchise}></OptionMenu> :
            <div className={franchise+" "+"board"}>
                <div className="info">
                    <i className="fa-solid fa-arrow-left back" onClick={()=>backToMenu()}></i>
                    <div className="score">
                        <div>Score: {score}</div>
                        <div>Best Score: {bestScore}</div>
                    </div>
                    
                   
                    
                    <img src={'./src/assets/'+franchise+'-logo.png'} className={"logo "+franchise}  alt="" />
                </div>
                
                <div className="card-wrapper">
                     {characters.map(character => {
                        return <Card name={character.name} franchise={franchise} imageUrl={character.imageUrl} onSelected={selectCard} key={character.name}></Card>
                    })}

                </div>
               
            </div>
    )
}

function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let random = Math.floor(Math.random() * arr.length)
        let oldElement = arr[i]
        arr[i] = arr[random]
        arr[random] = oldElement
    }

    return arr
}

function Card({ name, franchise, imageUrl, onSelected }) {
    return (
        <div className={"card "+franchise} onClick={() => onSelected(name)}>
            <h1 className="character-name">{name}</h1>
            <img src={imageUrl} alt={name} />
        </div>
    )
}

function OptionMenu({ onChooseFranchise }) {

    function handleHover(franchise){
        document.querySelector(':root').className = franchise
    }

    function handleLeave(franchise){
        document.querySelector(':root').classList.remove(franchise)
    }

    return (
        <div className="option-menu">
            <div onMouseEnter={(e)=>{handleHover("aot")}} onMouseLeave={(e)=>{handleLeave("aot")}} className="aot" onClick={() => onChooseFranchise("aot")}>Attack On Titan</div>
            <div onMouseEnter={(e)=>{handleHover("one-piece")}} onMouseLeave={(e)=>{handleLeave("one-piece")}} className="one-piece" onClick={() => onChooseFranchise("one-piece")}>One Piece</div>
            <div onMouseEnter={(e)=>{handleHover("naruto")}} onMouseLeave={(e)=>{handleLeave("naruto")}} className="naruto" onClick={() => onChooseFranchise("naruto")}>Naruto</div>
        </div>
    )
}

export { Board }