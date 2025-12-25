import { Component, createMemo, createSignal, For, onMount } from "solid-js";
import styles from "./projects.module.scss";
import { useSlideTransition } from "../../shared/customHooks/PageTransition";
import { ProjectCard } from "./projCard/projcard";
import Paginator, { useTransition } from "../../shared/components/Paginator/paginator";


export interface Project {
    name: string;
    desc: string;
    imageUrl: string;
}

export const Projects: Component = () => {

    const [projects, setProjects] = createSignal<Project[]>([
        {
            name: "This Website",
            desc: "A Website to showcase my web development Projects & skills.\n\nCode Stack: SolidJS, Typescript, SCSS, HTML",
            imageUrl: "",
        },
        {
            name: "Arcane Dictionary",
            desc: "A website designed to help track dnd5e characters and other information\n\nCode Stack: SolidJS, Typescript, C#, CSS/SCSS, Dexie",
            imageUrl: ""
        },
        {
            name: "Professor's Team Tool",
            desc: "A website that i designed for tracking your Pokémon team.\n\nCode Stack: Angular, Dexie, Scss,",
            imageUrl: ""
        }
    ]);

    const [paginatedProjects, setPaginatedProjects] = createSignal<Project[]>([]);

    const { slideClass } = useSlideTransition();
    const {slideTranition, } = useTransition();

    const bodyCls = slideClass();

    const cls = slideTranition();

    return <div class={`${styles.projectsBody} ${bodyCls()}`}>
        <h1>Projects</h1>

        <div class={`${styles.projectsDisplay} ${cls()}`}>
            <For each={paginatedProjects()}>
                {(project) => <ProjectCard 
                    name={project.name}
                    description={project.desc}
                    imageUrl={project.imageUrl}
                />}
            </For>
        </div>
        
        <div class={`${styles.paginatorBar}`}>
            <Paginator 
                items={projects}
                setItems={setPaginatedProjects}
            />
        </div>
    </div>
}