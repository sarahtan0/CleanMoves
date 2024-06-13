import nav from "./Navbar.module.css"

export function Navbar({}){
    return (
        <div className={nav.navBar}>
            <h2>CleanMoves</h2>
            <ul>
                <li>
                <a href="/">Practice</a>
                </li>
                <li>
                <a href="/">Record</a>
                </li>
                <li>
                <a href="/">Help</a>
                </li>
            </ul>
        </div>
    );
}