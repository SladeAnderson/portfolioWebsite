import { Component, createContext, createEffect, createMemo, createSignal, ErrorBoundary, onCleanup, onMount } from "solid-js";
import { HookContext, ProviderProps } from "../models/HookContext";
import mobileCheck from "../shared/customHooks/mobileCheck";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import ReloadPrompt from "../ReloadPrompt";
import picture1 from "../assets/1000000338.jpg";
import { HeaderBar } from "./header/headerbar";
import { effect } from "solid-js/web";
import { useInjectServices } from "../shared/customHooks/injectServices";
import { NavMenu } from "./navMenu/navMenu";

const defaultValue: HookContext = {
    isMobile: createSignal(mobileCheck())[0],
    showList: createSignal(false),
    getMouse: () => ({x: 0,y: 0})
}
export const SharedHookContext = createContext<HookContext>(defaultValue);

const Provider: Component<ProviderProps<HookContext>> = (props: ProviderProps<HookContext>) => {
    return <SharedHookContext.Provider value={props.value}>{props.children}</SharedHookContext.Provider>
};

export const RootApp: Component<RouteSectionProps<unknown>> = (props) => {
   
    const [defaultShowList,setDefaultShowList] = createSignal(false);
    const [defaultIsMobile, setDefaultIsMobile] = createSignal(mobileCheck());
    const [mouse, setMouse] = createSignal({x: 0, y: 0});

    createEffect(() => {
        setDefaultIsMobile(mobileCheck());
    })

    

    setDefaultIsMobile(mobileCheck());
    

    const mouseCapture = (e: MouseEvent) => setMouse({x: e.clientX, y: e.clientY});

    onMount(() => {
        window.addEventListener('mousemove',mouseCapture);
    })

    onCleanup(() => {
        window.addEventListener('mousemove',mouseCapture);
    })

    let isMobile;
    try {
        const services = useInjectServices();
        isMobile = services.isMobile;
    } catch (err) {
        console.error("Failed to inject services:", err);
        // Fallback to our direct check
        isMobile = () => defaultIsMobile();
    }

    const [menuAnchor, setMenuAnchor] = createSignal<HTMLElement | undefined>();

    const navigate = useNavigate();

    return <ErrorBoundary fallback={(err) => {
         console.error("Error in RootApp render:", err);
      return (
        <div style="padding: 20px; color: red; background: white; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
          <h2>Something went wrong in the application shell</h2>
          <pre>{err.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload Application</button>
        </div>
      );
    }}>
        <Provider value={{
            isMobile: defaultIsMobile,
            showList: [defaultShowList,setDefaultShowList],
            getMouse: () => mouse()
        }}>
            <div class="root" style={{
                height: "100vh",
            }}>
                <HeaderBar
                    setAnchor={setMenuAnchor}
                    isMobile={isMobile()}
                    list={[defaultShowList,setDefaultShowList]}
                />
                <div class="subheader">

                </div>
                <div class="body">
                    {props.children}
                </div>
             
             
            </div>
            <NavMenu 
                anchorEl={menuAnchor}
                defaultShowList={[defaultShowList,setDefaultShowList]}
            />     
        </Provider>
    </ErrorBoundary>
}
