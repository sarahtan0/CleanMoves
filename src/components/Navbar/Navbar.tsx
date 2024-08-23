import nav from "./Navbar.module.css"
import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from "react"
import { PracticeHelp } from "../Help/PracticeHelp"

export function Navbar(){
    const [currPage, setCurrPage] = useState("");
    const [pracHelpOpen, setPracHelpOpen] = useState(false);
    let location = useLocation();
    
    useEffect(() => {
        setCurrPage(location.pathname);
        const handleKeyDown = (event: KeyboardEvent) => {
            switch(event.key){
                case "h":
                    setPracHelpOpen((prev) => !prev)
            }
        }

        document.addEventListener("keydown", handleKeyDown);
    }, [location])

    const help = () => {
        if(currPage == "/practice"){
            setPracHelpOpen(!pracHelpOpen);
        }
        //add another for record screen
    }

    return (
        <div>
            <div className={nav.navBar}>
                <h2>CleanMoves</h2>
                <ul>
                    <li>
                        <NavLink to="/practice">Practice</NavLink>
                    </li>
                    <li>
                        <NavLink to="/record">Record</NavLink>
                    </li>
                    <li>
                        <a onClick={help}>Help</a>
                    </li>
                </ul>
            </div>
            {pracHelpOpen && 
                <PracticeHelp 
                    setOpen = {setPracHelpOpen}    
                />}
        </div>
    );
}