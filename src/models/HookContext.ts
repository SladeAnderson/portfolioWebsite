import { Accessor, JSX, Setter } from "solid-js";

export interface HookContext {
    isMobile: Accessor<boolean>;
    showList: [Accessor<boolean>, Setter<boolean>];
    getMouse: () => {x: number, y: number};
}

export interface ProviderProps<T> {
    children: JSX.Element;
    value: T;
}