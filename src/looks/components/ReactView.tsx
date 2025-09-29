import { useApp } from "../hooks/useApp";

export const ReactView = (props: {
    count: number
}) => {
    const { vault } = useApp()!;

    return (
        <div>
            <h4>Hello React!!!!!</h4>
            <p>this vault is {vault.getName()}</p>
            <p>count is {props.count}</p>
        </div>
    );
};