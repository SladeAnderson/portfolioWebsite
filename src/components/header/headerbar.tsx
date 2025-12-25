import { Accessor, Component, Setter } from "solid-js";
import styles from "./headerBar.module.scss";
import { TheBars } from "../../shared/components/icons/TheBars";
import { useSidebarManage } from "../navMenu/navMenu";
import { useSlideTransition } from "../../shared/customHooks/PageTransition";
import { useNavigate } from "@solidjs/router";

interface headerProps {
    list: [Accessor<boolean>, Setter<boolean>];
    isMobile: boolean;
    setAnchor: Setter<HTMLElement | undefined>;
}

export interface Tab {
    Name: string;
    Link: string;
}

export const HeaderBar: Component<headerProps> = (props) => {
    const {toggleSidebar} = useSidebarManage();

    const {triggerSlideOut, triggerSlideIn} = useSlideTransition();
    const navigate = useNavigate();

    const homeNaviagate = () => {
        triggerSlideOut().then(()=>{
            navigate("/")
            triggerSlideIn();
        })
    }
    return <div class={`${styles.headerBar}`}>
        <span>
            <a onclick={(e)=>{
                e.preventDefault();
                homeNaviagate()
            }} class={`AnchorEl ${styles.homeButton}`}>
                Portfolio
            </a>
        </span>

        <div class={`${styles.toolBar}`}>
            <button type="button" ref={props.setAnchor} onClick={toggleSidebar} class={`${styles.menuButton}`} aria-label="Menu Button">
                <TheBars />
            </button>
        </div>
    </div>
}