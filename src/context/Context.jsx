import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Function to progressively add text for typing effect
    const delayPara = (text, index) => {
        setTimeout(() => {
            setResultData(prev => prev + text);
        }, 30 * index); // Adjust the delay as needed
    };

    const newChat=()=>
    {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt!==undefined)
        {
            response=await run(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response=await run(input)
        }
        // Handle bold text
        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }

        // Handle line breaks
        newResponse = newResponse.replace(/\*/g, "<br />");

        // Create typing effect
        setLoading(false);
        setInput("");
        for (let i = 0; i < newResponse.length; i++) {
            delayPara(newResponse[i], i);
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
