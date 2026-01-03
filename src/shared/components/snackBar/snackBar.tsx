import { Component, createSignal, For, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import style from "./snackBar.module.scss";

type Severity = "Succsess" | "Warning" | "Info" | "Error"

export interface Snackbar {
    message: string;
    severity: Severity; 
    timeOut?: number
}

const [snackbars, setSnackBars] = createSignal<Snackbar[]>([]);

/** quoue a snack to display */
const addSnackbar = (snack: Snackbar) => setSnackBars(old => [...old, snack]);

/** Remove snack at index */
const removeSnackbar = (index: number) => setSnackBars(old => old.filter((_, i) => i !== index));

/** Mount once near app root to render any queued snackbars (portal not required here but container simplifies styling) */
const SnackBarController: Component = () => (
    <Show when={snackbars().length > 0}>
        <div>
            <For each={snackbars()}>
                {(snack, index) => (
                    <Snackbar {...snack} index={index()} onClose={() => removeSnackbar(index())} />
                )}
            </For>
        </div>
    </Show>
)

interface SnackProps extends Snackbar { onClose: () => void; index: number }

const Snackbar: Component<SnackProps> = (props) => {
    
    const timeout = setTimeout(props.onClose, props.timeOut ?? 5000);

    onCleanup(() => clearTimeout(timeout));

    const messageLinesHeuristic = Math.floor(props.message.length / 17); // maintain vertical stackin calc

    return (
        <Portal mount={document.body}>
            <div
                style={{ bottom: `${10 + (props.index * (50 + (messageLinesHeuristic)))}px`}}
                class={`${style.primary} ${style.snack} ${style[props.severity ?? 'info']}`}
                role="status"
                aria-live="polite"
            >
                <span>{props.message}</span>
                <button onClick={props.onClose} aria-label="Close notification">X</button>
            </div>
        </Portal>
    )
}

export { addSnackbar, SnackBarController };
export default addSnackbar;