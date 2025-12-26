import { Component } from "solid-js";
import style from "./about.module.scss";
import { useSlideTransition } from "../../shared/customHooks/PageTransition";

interface pageProps {

}

export const About:Component<pageProps> = (props) => {

    const {slideClass} = useSlideTransition();

    const cls = slideClass();

    return <div class={`${style.AboutBody} ${cls()}`}>
        <h1>About Me</h1>

        <div class={`${style.description}`}>
            I'm a passionate and imaginative developer As  Well as a hands on learner with a strong desire to learn. I'm eager to  apply my skills and knowledge to exciting projects and contribute to a  dynamic team. I'm continuously seeking new challenges and opportunities  to grow both professionally and personally.
        </div>

        <h2>Skills:</h2>

        <div class={`${style.SkillsBox}`}>
            <div>
                <h3>Web Development</h3>
                <ul>
                    <li>Typescript</li>
                    <li>SolidJS</li>
                    <li>Angular</li>
                    <li>React</li>
                    <li>HTML</li>
                    <li>CSS, SCSS</li>
                    <li>MongoDB</li>
                    <li>Dexie</li>
                    <li>C#</li>
                    <li>Entity Framework</li>
                    <li>Git</li>
                </ul>
            </div>
            <div>
                <h3>General</h3>
                <ul>
                    <li>Construction (Plumbing)</li>
                    <li>Manaual Labor</li>
                    <li>Power & Hand Tools</li>
                    <li>Organization & Attention to Detail</li>
                    <li>Team Collaboration</li>
                    <li>Problem Solving & Quick Learning</li>
                </ul>
            </div>
        </div>
    </div>
}