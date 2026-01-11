export function Header({
    children,
    level = 2,
}: {
    children: string,
    level?: number
}) {
    const tags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
    const Tag = tags[level - 1];
    return <Tag>{children}</Tag>
}