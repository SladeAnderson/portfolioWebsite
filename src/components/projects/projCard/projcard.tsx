import { Component, JSX, onMount, splitProps } from "solid-js";
import styles from "./projcard.module.scss";

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
    name: string;
    description: string;
    imageUrl: string;
}

export const ProjectCard: Component<CardProps> = (props) => {

    const [local, other] = splitProps(props, ['name','description','imageUrl']);


   
    onMount(()=>{
        console.log(local.description);
        
    })

    return <div {...other} class={`${styles.projectCard}`}>
        <div>
            <h3>{local.name}</h3>

            <span>
                {local.description}
            </span>
        </div>

        <img src={local.imageUrl} alt="[Website Screenshot goes here]" />
    </div>
}