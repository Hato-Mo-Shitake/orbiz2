export class Tag {
    private _id: TagId;
    private _name: TagName;
    private _parentTagIds: TagId[];
    private _childTagIds: TagId[];

    constructor(id: string) {
        const elements = ITagQuery({
            id: id,
            name: name,
            parentIds
        }) {
            throw new Tag
        }

    }
}