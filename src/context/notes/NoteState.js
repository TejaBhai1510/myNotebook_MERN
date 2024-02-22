import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
    const s1 = {
        "name" : "TejaBhai",
        "class" : "5"
    }
    const [state, setState] = useState(s1);
    const update = () => {
        setTimeout(() => {
            setState({
                "name" : "BabuBhai",
                "class" : "10"
            })
        }, 1000);
    }
    return (
        <NoteContext.Provider value={{state:state, update:update}}>
            { props.children }
        </NoteContext.Provider>
    )
};

export default NoteState;