import { Accessor, Component, createEffect, createMemo, createSignal, For, onCleanup, onMount, Setter, Show, untrack, useContext } from "solid-js";
import styles from "./navMenu.module.scss";
import { ExtendedTab } from "../../models/extendedTab";
import { useNavigate } from "@solidjs/router";
import { Portal } from "solid-js/web";
import { isNullish } from "../../shared/customHooks/tools/tools";
import { useShowMenu } from "../../shared/customHooks/useShowMenu";
import { SharedHookContext } from "../rootApp";

const [showList, setShowList] = createSignal(false);
const [isTransitioning, setIsTransitioning] = createSignal(false);
let transitiionTimer: number | undefined;

export const useSidebarManage = () => {
    const toggleSidebar = () => {
        if (isTransitioning()) return; // ignore rapid re-clicks

        setIsTransitioning(true);
        setShowList((old)=>!old);
        
        if (transitiionTimer) clearTimeout(transitiionTimer);
        transitiionTimer = window.setTimeout(() => setIsTransitioning(false), 300);
    };

    return {showList ,isTransitioning ,toggleSidebar}
};


interface menuProps {
    anchorEl: Accessor<HTMLElement | undefined>;
    defaultShowList: [Accessor<boolean>, Setter<boolean>],
}

export const NavMenu: Component<menuProps> = (props) => {
    const { showList, toggleSidebar} = useSidebarManage();
    const [shouldRender, setShouldRender] = createSignal(false);
    const [isClosing, setIsClosing] = createSignal(false);
    const [isOpening, setIsOpening] = createSignal(false);

    const context = useContext(SharedHookContext);

    const {
        menuRef,
        setMenuRef
    } = useShowMenu();

    const navigate = useNavigate();

    const menuItems = createMemo<ExtendedTab[]>(()=>[
       {
        Name: "Projects",
        Link: "/projects",
        isOpen: false
       },
       {
        Name: "About",
        Link: "/about",
        isOpen: false
       },
       {
        Name: "Contact",
        Link: "/contact",
        isOpen: false
       }
    ])

    const getAndSetPosition = (menu: HTMLElement,anchorEl: HTMLElement) => {
        const rect = anchorEl.getBoundingClientRect();
        
        // menu.style.position = 'absolute';
        // menu.style.top = `${rect.bottom}px`;

        menu.style.setProperty("--menu-pos",'absolute');
        menu.style.setProperty("--menu-top", `${rect.bottom}px`)

        const mod = rect.width < 12 ? 1.25 : 1;
        const menuFix = (menu.getBoundingClientRect().width) * mod;

        // menu.style.left = `${rect.right - menuFix}px`;
        
        menu.style.setProperty("--menu-left",`${rect.right - menuFix}px`)
    }

    const updatePostion = () => {
        const menu = menuRef();
        const anchorEl = props.anchorEl();
        
        if (menu && anchorEl) {
            getAndSetPosition(menu, anchorEl)
        }
    }

    const offClick = (e: MouseEvent) => {
        untrack(()=> {
            if (menuRef() && showList() && !menuRef()!.contains(e.target as Node)) {
                toggleSidebar()
            }
        })
    };

    const clickIntercept = () => {
        if (context.isMobile()) {
            setShowList(false);
        } else {
            setShowList(window.matchMedia("only screen and (max-width: 768px)").matches)
        }
    };
    
    createEffect(()=>{
        if (showList()) {
            setShouldRender(true);
            setIsClosing(false);
            setIsOpening(true);
            
            // Remove opening class after animation
            setTimeout(() => {
                setIsOpening(false);
            }, 300);
        } else if (shouldRender()) {
            setIsClosing(true);
            setIsOpening(false);

            // Remove after animation completes
            setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            },300)
        }
    });

    createEffect(()=>{
        const menu = menuRef();
        const anchorEl = props.anchorEl();

        if (menu && anchorEl) {
            getAndSetPosition(menu, anchorEl)
        }
    })

    onMount(()=>{
        document.body.addEventListener('click',offClick);
        window.addEventListener('resize',clickIntercept);
        
        const menu = menuRef();
        const anchorEl = props.anchorEl();
        

        if (menu && anchorEl) {
            getAndSetPosition(menu, anchorEl);
        
            anchorEl.addEventListener('click',()=>updatePostion());
       
            onCleanup(()=>{
                anchorEl.removeEventListener('click',()=>updatePostion());
            })
        }

   
    })
    
    onCleanup(()=>{
       

        const menu = menuRef();

        if (menu) {
            menu.style.top = '';
            menu.style.left = '';
        }

        document.body.removeEventListener('click',offClick)
        window.removeEventListener('resize',clickIntercept);
    })

   
    return (
        <Show when={shouldRender()}>
             <Portal ref={menuRef}>
                <div ref={(ref)=>setMenuRef(ref)} class={`${styles.navMenu} ${isClosing() ? styles.closing : ''} ${isOpening() ? styles.opening : ''}`}>
                    <ul>
                        <li onClick={()=>{
                            navigate("/");
                            toggleSidebar();
                        }}>
                            <h3>Naviagtion</h3>
                        </li>

                        <For each={menuItems()}>
                            {(tab) => <li onClick={(e)=>{
                                navigate(tab.Link);
                                toggleSidebar();
                            }}>
                                {tab.Name}    
                            </li>}
                        </For>
                    </ul>
                </div>           
            </Portal>
        </Show>
    )
}