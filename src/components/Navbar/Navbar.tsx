import nav from "./Navbar.module.css"
import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from "react"
import { PracticeHelp } from "../Help/PracticeHelp"
import { RecordHelp } from "../Help/RecordHelp"

export function Navbar(){
    const [currPage, setCurrPage] = useState("");
    const [pracHelpOpen, setPracHelpOpen] = useState(false);
    const [recHelpOpen, setRecHelpOpen] = useState(false);
    let location = useLocation();

    const help = () => {
        if(currPage == "/practice"){
            setPracHelpOpen(!pracHelpOpen);
        } else if (currPage == "/record") {
            setRecHelpOpen(!recHelpOpen);
        }
        //add another for record screen
    }
    
    useEffect(() => {
        setCurrPage(location.pathname);
        if(currPage!="/record"){
            setRecHelpOpen(false);
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            switch(event.key){
                case "h":
                    if(currPage == "/practice" || currPage == "/") {
                        setPracHelpOpen(prev => !prev);
                    } else if (currPage == "/record") {
                        setRecHelpOpen(prev => !prev);
                    }
                    break;
                default:
                    break;
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [location, currPage, pracHelpOpen])
    console.log(currPage);
    console.log("pracopen" + " " + pracHelpOpen);
    console.log("recopen" + " " +recHelpOpen);

    return (
        <div>
            <div className={nav.navBar}>
                <h2>CleanMoves</h2>
                <ol className={nav.navList}>
                    <li>
                        <NavLink to="/practice">Practice</NavLink>
                    </li>
                    <li>
                        <NavLink to="/record">Record</NavLink>
                    </li>
                    <li>
                        <a onClick={help}>Help</a>
                    </li>
                </ol>
            </div>
            {pracHelpOpen && 
                <PracticeHelp 
                    setOpen = {setPracHelpOpen}    
                />
            }
            {recHelpOpen &&
                <RecordHelp/>
            }
        </div>
    );
}