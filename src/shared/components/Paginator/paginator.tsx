import { Accessor, Component, createEffect, createMemo, createSignal, For, Setter, splitProps } from "solid-js";
import styles from "./paginator.module.scss";

const [isSliding, setIsSliding] = createSignal(false);
const [slideDirection, setSlideDirection] = createSignal<"in" | "out">("in");

export const useTransition = () => {

    // Call this before navigation to trigger slide out
    const triggerSlideOut = () => {
        setSlideDirection("out");
        setIsSliding(true);
        // Wait for animation to finish before navigating
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setIsSliding(false);
                resolve();
            }, 300); // match animation duration
        });
    };

    // Call this after navigation to trigger slide in
    const triggerSlideIn = () => {
        setSlideDirection("in");
        setIsSliding(true);
        setTimeout(() => setIsSliding(false), 300);
    };

    // Factory that returns a reactive getter (memo) for the given CSS module
    const slideTranition = () =>
        createMemo(() => {
            if (!isSliding()) return "";
            
            return slideDirection() === "in" ? 'slideIn' : 'slideOut';
        });

    return { triggerSlideOut, triggerSlideIn, slideTranition, isSliding, slideDirection};
};


interface PaginatorProps<T> { 
    items: Accessor<T>;
    setItems: Setter<T>;
    itemsPerPage?: number[];
}

const Paginator = <T,>(props: PaginatorProps<T[]>) => {
    const [local, other] = splitProps(props, ['items','itemsPerPage','setItems'])

    const [currentPage, setCurrentPage] = createSignal(1);
    const [itemsPerPage, setItemsPerPage] = createSignal(props.itemsPerPage?.[0] ?? 2);

    const start = createMemo(() => (currentPage() - 1) * itemsPerPage());
    const end = createMemo(() => currentPage() * itemsPerPage());

    const theItems = createMemo(() => props.items().slice(start(), end()));

    const lastPage = createMemo(() => Math.ceil(props.items().length / itemsPerPage()));

    const ItemsPerPage = createMemo(() => props.itemsPerPage ?? [2,4,6,8]);

    const {triggerSlideOut, triggerSlideIn} = useTransition();

    // Reset or clamp current page when data source changes (e.g., version switch)
    let prevSignature = "";
    createEffect(() => {
        const list = local.items();
        const signature = `${list.length}:${(list[0] as any)?.id ?? (list[0] as any)?.name ?? ""}`;

        // If underlying collection identity changed, reset to first page
        if (signature !== prevSignature) {
            prevSignature = signature;
            setCurrentPage(1);
        }
    });

    createEffect(() => {
        // Clamp page if items shrank
        if (currentPage() > lastPage()) {
            setCurrentPage(lastPage());
        }

        local.setItems(theItems());
    })

    const runFunc = (number: number) => {
        triggerSlideOut().then(()=>{
            setCurrentPage(number);
            triggerSlideIn();
        })


    }

    return <div class={`${styles.paginator}`}>
        <button disabled={currentPage() === 1 ? true : false} onClick={()=>runFunc(1)}>←←</button>
        <button disabled={currentPage() === 1} onClick={(()=>runFunc(currentPage() - 1))}>←</button>
        <select onChange={(e)=>setItemsPerPage(+e.currentTarget.value)}>
            <For each={ItemsPerPage()}>
                {(number)=><option value={number}>
                    {number}
                </option>}
            </For>
        </select>
        <div class={styles.pageDisplay}>
            <div>{currentPage()}</div> / <div>{lastPage()}</div>
        </div>
        <button disabled={currentPage() === lastPage()} onClick={()=>runFunc(currentPage() + 1)}>→</button>
        <button disabled={currentPage() === lastPage()} onClick={()=>runFunc(lastPage())}>→→</button>
    </div>
}

export {Paginator};
export default Paginator;