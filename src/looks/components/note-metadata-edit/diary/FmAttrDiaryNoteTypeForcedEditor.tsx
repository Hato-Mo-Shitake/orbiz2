// import { FmAttrDiaryNoteType } from "src/core/orb-system/services/fm-attrs/FmAttrString";
// import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
// import { diaryNoteTypeList, isDiaryNoteType } from "src/orbits/schema/frontmatters/NoteType";
// import { DiaryNoteState } from "src/orbits/schema/NoteState";
// import { StoreApi, useStore } from "zustand";
// import { SelectBox } from "../../common/SelectBox";

// export function FmAttrDiaryNoteTypeForcedEditor({
//     store,
//     fmAttr,
// }: {
//     store: StoreApi<DiaryNoteState>,
//     fmAttr: FmAttrDiaryNoteType,
// }) {
//     const subType = useStore(store, (s) => s.fmAttrDiaryNoteType);
//     const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

//     const handleChange = (subType: string) => {
//         if (!isDiaryNoteType(subType)) {
//             alert("invalid value.");
//             return;
//         }
//         setNewValue(subType);
//     }

//     return (<>
//         <div>
//             <h5 style={{ display: "flex", gap: "0.5em" }}>
//                 {fmAttr.fmKey}
//                 <button onClick={handleCommit}>更新</button>
//             </h5>
//             <div>current value: {subType}</div>
//             <SelectBox
//                 value={newValue || ""}
//                 onChange={handleChange}
//                 options={[...diaryNoteTypeList]}
//             />
//         </div>
//     </>)
// }