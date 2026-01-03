import { Component, createMemo, For, Show } from "solid-js";
import style from "./contact.module.scss";
import addSnackbar from "../../shared/components/snackBar/snackBar";
import { useSlideTransition } from "../../shared/customHooks/PageTransition";

export interface contact {
    name: string;
    websiteLink: string;
    asset?: string;
}

export const Contact: Component = (props) => {

    const contacts = createMemo<contact[]>(() => [
        {
            name: "LinkedIN",
            websiteLink: "https://www.linkedin.com/in/slade-anderson-b17826324",
            asset: "src/assets/LI-Logo.png",
        },
        {
            name: "Email",
            websiteLink: "andersonslade85@gmail.com",
        }
    ])

    const copyLink = (e: MouseEvent,link: string) => {
        navigator.clipboard.writeText(link).then(
            () => {
                addSnackbar({
                    severity: "Info",
                    message: "Coppied"
                })
            },
            () => {
                addSnackbar({
                    severity: "Error",
                    message: "Failed to copy"
                })
            }
        )
    }

    const {slideClass} = useSlideTransition();

    const cls = slideClass()
    

    return <div class={`${style.contactBody} ${cls()}`}>
        <h1>Contact Me</h1>
        
        <ul>
            <For each={contacts()}>
                {(contact)=><li onClick={(e)=>copyLink(e,contact.websiteLink)}>
                    <Show when={contact.name !== "Email"}>
                        <a class="AnchorEl" href={contact.websiteLink} target="_blank" title={contact.name}>
                            <Show when={contact.asset !== undefined}>
                                <img src={contact.asset} alt={contact.name} width="100px" /> 
                            </Show>
                        </a>
                        <span>@ Slade Anderson</span>
                    </Show>
                    <Show when={contact.name === "Email"}>
                        <span title={contact.name}>
                            {contact.name} @ {contact.websiteLink}

                        </span>
                    </Show>
                </li>}
            </For>
        </ul>
        
    </div>
}