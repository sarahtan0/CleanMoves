import cn from "./PracticeHelp.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBookmark } from '@fortawesome/free-solid-svg-icons'

export function PracticeHelp(){
    return(
       <div className={cn.background}>
        <div className={cn.container}>
            <div className={cn.tabs}>
                <button id={cn.closeBtn}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <div> Functions </div>
                <div> Keybinds </div>
            </div>

            <div className={cn.content}>
                <div>
                    YIPEEEE
                </div>
                <div>
                    YIPEEE2
                </div>
            </div>
        </div>
       </div>
    );
}  