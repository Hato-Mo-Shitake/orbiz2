import { Tag } from "./Tag.entity";
import { TagId } from "./TagId.vo";
import { TagName } from "./TagName.vo";

export interface ITagRepository {
    save(tag: Tag): void;

    findById(id: TagId): Tag | null;
    getById(id: TagId): Tag;

    findByName(name: TagName): Tag | null;
    getByName(name: TagName): Tag;
}
