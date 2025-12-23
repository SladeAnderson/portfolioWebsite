import { createSignal } from "solid-js";

const [menuRef, setMenuRef] = createSignal<HTMLElement | null>(null)

export const useShowMenu = () => {

    return {
        menuRef,
        setMenuRef
    }
};