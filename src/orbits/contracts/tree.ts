export type RecursiveTree<T> = {
    id?: string,
    hub: T;
    nodes: RecursiveTree<T>[];
}