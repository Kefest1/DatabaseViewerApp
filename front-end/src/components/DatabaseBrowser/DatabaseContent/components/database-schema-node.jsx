import { Position } from "@xyflow/react";

import { TableBody, TableCell, TableRow } from "./ui/table";

import { BaseNode } from "./base-node";
import { LabeledHandle } from "./labeled-handle";

export function DatabaseSchemaNode({
                                       data,
                                       selected
                                   }) {
    return (
        <BaseNode className="p-0" selected={selected}>
            <h2
                className="rounded-tl-md rounded-tr-md p-1 text-center text-black"
                style={{
                    fontSize: '12px',
                    backgroundColor: '#cacaca'
                }}
            >
                {data.label}
            </h2>
            <table className="border-spacing-0 overflow-visible">
                <TableBody>
                    {data.schema.map((entry) => (
                        <TableRow key={entry.title} className="text-xs">
                            <TableCell className="pl-0 pr-1 py-0 font-light" style={{ fontSize: '8px' }}>
                                <LabeledHandle
                                    id={entry.title}
                                    title={entry.title}
                                    type="target"
                                    position={Position.Left}
                                />
                            </TableCell>
                            <TableCell className="pr-0 py-0 text-right font-thin" style={{ fontSize: '8px' }}>
                                <LabeledHandle
                                    id={entry.title}
                                    title={entry.title}
                                    type="source"
                                    position={Position.Right}
                                    className="p-0"
                                    // handleClassName="p-0"
                                    labelClassName="p-0"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </table>
        </BaseNode>
    );
}
