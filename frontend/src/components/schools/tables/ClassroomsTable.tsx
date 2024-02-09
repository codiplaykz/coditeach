import cx from 'clsx';
import {useState} from 'react';
import {Checkbox, Group, ScrollArea, Table, Text} from '@mantine/core';
import classes from './Table.module.css';
import {ButtonCopy} from "../../buttons/ButtonCopy.tsx";
import {useTranslation} from "react-i18next";

interface Classroom {
    id: string,
    title: string,
    code: string,
}

interface ClassroomsTableProps {
    data: Classroom[]
}

export function ClassroomsTable({ data }: ClassroomsTableProps) {
    const [selection, setSelection] = useState<string[]>([]);
    const { t } = useTranslation()

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const rows = data.map((classroom) => {
        const selected = selection.includes(classroom.id);
        return (
            <Table.Tr key={classroom.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selected} onChange={() => toggleRow(classroom.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Text size="sm" fw={500}>
                            {classroom.title}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <ButtonCopy copyText={classroom.code} buttonTitle={classroom.code} tooltipText={'Classroom code copied!'}/>
                </Table.Td>
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
                        <Table.Th>{t('classroomsTable.title')}</Table.Th>
                        <Table.Th>{t('classroomsTable.code')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <tbody>
                {
                    rows.length !== 0 ? rows : (
                        <Table.Td colSpan={3} style={{textAlign: 'center'}}>
                            {t('classroomsTable.noData')}
                        </Table.Td>
                    )
                }
                </tbody>
            </Table>
        </ScrollArea>
    );
}
