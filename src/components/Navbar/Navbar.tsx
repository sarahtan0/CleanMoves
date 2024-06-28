import nav from "./Navbar.module.css"
import {NavLink} from 'react-router-dom'

export function Navbar(){
    
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
                </ul>
            </div>
        </div>
    );
}