import { ReactNode } from "react";

export function SimpleViewBox({
    children,
    header,
    headerWidth
}: {
    children: ReactNode,
    header?: string,
    headerWidth?: number,
}) {
    return (<>
        <div className="orbiz__item--flex-align-start-small" >
            {header &&
                <div
                    className="orbiz__font--bold"
                    style={{ width: headerWidth ? `${headerWidth}rem` : "" }}
                >
                    {header}
                </div>
            }
            <div>
                {children}
            </div>
        </div>
    </>)
}