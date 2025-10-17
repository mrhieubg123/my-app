import { Box, Typography } from "@mui/material";
import React,{useState, useEffect} from "react";


const TypewriterText = ({text, sender}) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect (() =>{
        let index = 0;
        const interval = setInterval(() =>{
            setDisplayedText(text.substring(0, index + 1 ));
            index ++;
            if(index === text.length){
                clearInterval(interval);
            }
        }, sender === 'Bot'  ? 20 : 20);
        return () => clearInterval(interval);
    }, [text]);

    return (<Typography dangerouslySetInnerHTML={{__html: displayedText}} />)
}

export default TypewriterText;