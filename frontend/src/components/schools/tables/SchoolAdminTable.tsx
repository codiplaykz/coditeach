import cx from 'clsx';
import { useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Text } from '@mantine/core';
import classes from './Table.module.css';
import {useTranslation} from "react-i18next";

interface SchoolAdmin {
    id: string,
    name: string,
    email: string,
    role: string,
}

interface SchoolAdminsTableProps {
    data: SchoolAdmin[]
}

export function SchoolAdminsTable({ data }: SchoolAdminsTableProps) {
    const [selection, setSelection] = useState<string[]>([]);
    const { t } = useTranslation()

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const rows = data.map((admin) => {
        const selected = selection.includes(admin.id);
        return (
            <Table.Tr key={admin.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selected} onChange={() => toggleRow(admin.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Text size="sm" fw={500}>
                            {admin.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{admin.email}</Table.Td>
                <Table.Td>{admin.role}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders miw={800} verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ width: '40px' }}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === data.length}
                                indeterminate={selection.length > 0 && selection.length !== data.length}
                            />
                        </Table.Th>
                        <Table.Th>{t('schoolAdminsTable.name')}</Table.Th>
                        <Table.Th>{t('schoolAdminsTable.email')}</Table.Th>
                        <Table.Th>{t('schoolAdminsTable.role')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <tbody>
                {
                    rows.length !== 0 ? rows : (
                        <Table.Td colSpan={4} style={{textAlign: 'center'}}>
                            {t('schoolAdminsTable.noData')}
                        </Table.Td>
                    )
                }
                </tbody>
            </Table>
        </ScrollArea>
    );
}
