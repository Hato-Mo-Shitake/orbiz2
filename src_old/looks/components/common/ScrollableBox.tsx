import { ReactNode } from "react";

type ScrollableProps = {
    children: ReactNode;
    width?: string | number;
    height?: string | number;
    horizontal?: boolean; // 横スクロールにしたい場合
};

export const ScrollableBox: React.FC<ScrollableProps> = ({
    children,
    width = "100%",
    height = "200px",
    horizontal = false,
}) => {
    return (
        <div
            style={{
                width,
                height,
                overflowY: horizontal ? "hidden" : "auto",
                overflowX: horizontal ? "auto" : "hidden",
                border: "0.3px solid #ccc",
            }}
        >
            {children}
        </div>
    );
};