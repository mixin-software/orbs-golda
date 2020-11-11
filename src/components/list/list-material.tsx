import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './list.scss';

interface StateProps {
    titles: string[];
    titleClassName: string;
    children: any;
    listClassName?: string;
    listHeaderBg?: string;
}

export const ListMaterial = (props: StateProps) => {
    const { titles, titleClassName, listClassName, listHeaderBg } = props;
    const className = listClassName ? `list ${listClassName}` : 'list';
    return (
        <TableContainer
            component={Paper}
            className={className}
            style={{
                boxShadow: 'none'
            }}>
            <Table  stickyHeader>
                <TableHead>
                    <TableRow>
                        {titles.map((title: string, index: number) => {
                            return (
                                <TableCell
                                    key={index}
                                    style={{
                                        background: listHeaderBg || 'transparent'
                                    }}>
                                    <p className={`${titleClassName} one-line capitalize`}>{title}</p>
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>{props.children}</TableBody>
            </Table>
        </TableContainer>
    );
};
