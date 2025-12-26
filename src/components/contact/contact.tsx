import { Component } from "solid-js";
import style from "./contact.module.scss";

export const Contact: Component = (props) => {

    return <div class={`${style.contactBody}`}>
        <h1>Contact Me</h1>
        
        <ul>
            <li>
                <a class="AnchorEl" href="https://www.linkedin.com/in/slade-anderson-b17826324" target="_blank" title="LinkedIN">
                    <img src="src/assets/LI-Logo.png" alt="LinkedIN" width="100px" />
                </a>
            </li>
        </ul>
        
    </div>
}