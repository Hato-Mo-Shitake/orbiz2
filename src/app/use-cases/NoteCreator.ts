import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { createLogNotePath, createMyNotePath } from "src/assistance/utils/path";
import { DailyFmBuilder, LogFmBuilder, MyFmBuilder, StdFmBuilder } from "src/builders/FmBuilder";
import { DailyNoteOrb, LogNoteOrb, MyNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { DuplicateStdNoteNameExistError } from "src/errors/DuplicateStdNoteNameExistError";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { IndividualNames, PromptMyNoteNameForDuplicateModal } from "src/looks/modals/prompt/PromptMyNoteNameForDuplicateModal";
import { LinkedNoteConf, NewLogNoteConf, NewMyNoteConf } from "src/orbits/contracts/create-note";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { isMyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { StdNoteSource } from "src/orbits/schema/NoteSource";
import { NoteRepository } from "src/repository/NoteRepository";

export class NoteCreator {
    private get noteR(): NoteRepository {
        return AM.repository.noteR;
    }

    async createMyNote(conf: NewMyNoteConf, options?: { tFile?: TFile }): Promise<MyNoteOrb> {
        let tFile: TFile;

        if (conf.roleNodeConf) {
            if (conf.roleNodeConf.hub.baseName.includes("@")) {
                throw new Error("RoleHubノートにRoleNodeノートは指定できません。");
            }
            conf.baseName = `${conf.roleNodeConf.kind}@${conf.roleNodeConf.hub.baseName}`;

            const subType = conf.roleNodeConf.hub.fmCache?.["subType"];
            if (!isMyNoteType(subType)) throw new UnexpectedError();
            conf.subType = subType;
        }

        if (options?.tFile) {
            tFile = options.tFile;


            const newPath = createMyNotePath(conf.baseName, conf.subType);

            await AM.repository.noteR.changeTFilePath(tFile, newPath)
        } else {
            try {
                tFile = await this.noteR.createStdTFile(conf.baseName, conf.subType);
            } catch (error) {
                if (error instanceof DuplicateStdNoteNameExistError) {
                    const { newNoteName, alreadyNoteName } = await this.resolveMyNoteNameDuplicate(conf, error);

                    // TODO: 本当はトランザクションとかも考えたいけど。。。。
                    await error.duplicateStdNoteOrb.editor.rename(alreadyNoteName);

                    const newConf = { ...conf };
                    newConf.baseName = newNoteName;
                    return await this.createMyNote(newConf);
                } else {
                    throw new UnexpectedError();
                }
            }
        }

        const fmB = new MyFmBuilder(conf.subType, conf?.roleNodeConf || undefined);
        const fm = await this.buildStdNote(conf.baseName, fmB, tFile);

        // NOTE: この時点ではまだ、fmCacheがないからTFileを入れると落ちる。
        const note = AM.factory.noteF.forMy(fm);
        if (!note) throw new Error("to create note failed.");

        // Note: fmCacheの準備がないので、fmの注入が必要。
        const newNoteOrb = AM.factory.noteOrbF.forMy(note, { fm });
        if (!newNoteOrb) throw new Error("to create note orb failed.");

        if (conf.linkedConf) {
            await this.addLinkedNote(newNoteOrb, conf.linkedConf);
        }

        // if (conf.roleNodeConf) {
        //     const roleNodeConf = conf.roleNodeConf;
        //     // const hubNote = AM.note.getMyNote({ noteId: roleNodeConf.h });
        //     // if (!hubNote) throw new UnexpectedError();
        //     await newNoteOrb.editor.addRole(roleNodeConf.hub, roleNodeConf.kind);
        // }

        if (conf.aspect) {
            await newNoteOrb.fmOrb.aspect.setNewValue(conf.aspect).commitNewValue();
        }

        if (conf.categories) {
            await newNoteOrb.fmOrb.categories.setNewValue(conf.categories).commitNewValue();
        }

        await newNoteOrb.editor.commitNewFm();
        AM.cache.setStdNoteOrbCache(newNoteOrb.note.id, newNoteOrb);
        return newNoteOrb;
    }

    async createLogNote(conf: NewLogNoteConf, options?: { tFile?: TFile }): Promise<LogNoteOrb> {
        // TODO: ここの処理の仕方はもうちょっと検討したいが、一旦これで、、、
        conf.baseName = conf.baseName + `〈-${conf.subType}-〉`;

        let tFile: TFile;
        if (options?.tFile) {
            tFile = options.tFile;
            const newPath = createLogNotePath(conf.baseName, conf.subType);
            await AM.repository.noteR.changeTFilePath(tFile, newPath)
        } else {
            tFile = await this.noteR.createStdTFile(conf.baseName, conf.subType);
        }
        const fmB = new LogFmBuilder(conf.subType);
        const fm = await this.buildStdNote(conf.baseName, fmB, tFile);

        // NOTE: この時点ではまだ、fmCacheがないからTFileを入れると落ちる。
        const note = AM.factory.noteF.forLog(fm);
        if (!note) throw new Error("to create note failed.");

        // Note: fmCacheの準備がないので、fmの注入が必要。
        const newNoteOrb = AM.factory.noteOrbF.forLog(note, { fm });
        if (!newNoteOrb) throw new Error("to create note orb failed.");

        if (conf.linkedConf) {
            await this.addLinkedNote(newNoteOrb, conf.linkedConf);
        }

        if (conf.status) {
            await newNoteOrb.fmOrb.status.setNewValue(conf.status).commitNewValue();
        }

        if (conf.due) {
            await newNoteOrb.fmOrb.due.setNewValue(conf.due).commitNewValue();
        }

        if (conf.context) {
            await newNoteOrb.fmOrb.context.setNewValue(conf.context).commitNewValue();
        }

        await newNoteOrb.editor.commitNewFm();

        AM.cache.setStdNoteOrbCache(newNoteOrb.note.id, newNoteOrb);
        return newNoteOrb;
    }

    async createDailyNote(date?: Date): Promise<DailyNoteOrb> {
        // TODO: これ、すでに同名のものがあるときは弾くようにしたい
        const tFile = await this.noteR.createDailyTFile(date);

        const fmB = new DailyFmBuilder();
        const fm = fmB.build();
        await this.noteR.updateFmAttrs(tFile, fm);

        // NOTE: この時点ではまだ、fmCacheがないからTFileを入れると落ちる。
        const note = AM.factory.noteF.forDaily({ fmAndPath: { fm: fm, path: tFile.path } });
        if (!note) throw new Error("to create note failed.");

        // Note: fmCacheの準備がないので、fmの注入が必要。
        const newNoteOrb = AM.factory.noteOrbF.forDaily(note, { fm });
        if (!newNoteOrb) throw new Error("to create note orb failed.");

        return newNoteOrb;
    }

    private async resolveMyNoteNameDuplicate(newConf: NewMyNoteConf, error: DuplicateStdNoteNameExistError): Promise<IndividualNames> {
        const individualNames = await PromptMyNoteNameForDuplicateModal.get(
            newConf,
            error.duplicateStdNoteOrb.note
        );
        if (!individualNames) throw new Error("resolving duplicate failed");

        return individualNames;
    }

    private async buildStdNote<TFm extends StdFm>(baseName: string, fmB: StdFmBuilder<TFm>, tFile: TFile): Promise<TFm> {
        const fm = fmB.build();
        await this.noteR.updateFmAttrs(tFile, fm);
        const id = fm.id;
        const source: StdNoteSource = {
            id: id,
            path: tFile.path,
            outLinkIds: new Set<string>(),
            inLinkIds: new Set<string>(),
            unCacheInitialized: true
        };
        AM.cache.setStdNoteSource(id, source);
        AM.cache.setStdNoteIdByName(baseName, id);

        return fm;
    }

    private async addLinkedNote(newNoteOrb: StdNoteOrb, conf: LinkedNoteConf): Promise<void> {
        const rootNoteOrb = AM.orb.getStdNoteOrb({ noteId: conf.rootNote.id });
        if (!rootNoteOrb) throw new Error("not found note.");

        const direction = conf.direction;
        if (direction === "out") {
            newNoteOrb.editor.addLinkedNote(rootNoteOrb.note, conf.key);
        } else if (direction === "in") {
            rootNoteOrb.editor.addLinkedNote(newNoteOrb.note, conf.key);
            await rootNoteOrb.editor.commitNewFm();
        } else {
            throw new UnexpectedError();
        }
    }
}