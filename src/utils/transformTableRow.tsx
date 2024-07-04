import { TableRow } from "@/components/TableExt";

export default function transformObj(transformedObject:TableRow){
    const originalObject:any = {};
    transformedObject.cells.forEach(cell => {
        originalObject[cell.colName] = cell.colName === 'ID' ? parseInt(cell.value) : cell.value;
    });
    return originalObject
}