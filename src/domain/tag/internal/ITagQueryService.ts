export interface ITagQueryService {
    getElementsByName(tag: string): Tag {
    id: TagId,
        name: TagName,
            parentIds: TagId[],
                childIds: TagId[],
    } 
}
