import { useContext } from "solid-js";
import { SharedHookContext } from "../../components/rootApp";
import { HookContext } from "../../models/HookContext";

export function useInjectServices(): HookContext {
    return useContext(SharedHookContext);
}