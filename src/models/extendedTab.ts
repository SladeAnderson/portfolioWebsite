import { Tab } from "../components/header/headerbar";

export interface ExtendedTab extends Tab {
    isOpen: boolean;
    children?: tabChild[];
}

interface tabChild {
    name: string;
    link: string;
    isOpen: boolean;
}