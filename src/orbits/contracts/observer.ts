export type Listener<T> = (value: T) => void;
export interface Observer<T> {
    addListener(listener: Listener<T>): void;
    removeListener(listener: Listener<T>): void;
    notify(): void;
}