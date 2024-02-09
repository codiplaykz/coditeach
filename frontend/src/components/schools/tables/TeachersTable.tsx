import cx from 'clsx';
import {useState} from 'react';
import {Button, Checkbox, Group, ScrollArea, Table, Text} from '@mantine/core';
import classes from './Table.module.css';
import {useTranslation} from "react-i18next";
import {IconEdit} from "@tabler/icons-react";
import ChangePasswordModal from "../../modals/ChangePasswordModal.tsx";

interface Teacher {
    id: string,
    name: string,
    email: string,
    role: string,
}

interface TeachersTableProps {
    data: Teacher[]
}

export function TeachersTable({ data }: TeachersTableProps) {
    const [selection, setSelection] = useState<string[]>([]);
    const { t } = useTranslation()
    const [modalOpened, setModalOpened] = useState(false)
    const [teacherId, setTeacherId] = useState('')

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const changePassword = (teacherId: string) => {
        setModalOpened(true)
        setTeacherId(teacherId)
    }

    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const rows = data.map((teacher) => {
        const selected = selection.includes(teacher.id);
        return (
            <Table.Tr key={teacher.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selected} onChange={() => toggleRow(teacher.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Text size="sm" fw={500}>
                            {teacher.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{teacher.email}</Table.Td>
                <Table.Td> <Button onClick={()=>{changePassword(teacher.id)}} leftSection={<IconEdit/>}
                                   radius={'50'} color={'green'}
                                   variant={'outline'}>{t('changePasswordModal.changePasswordTitle')}</Button>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <ScrollArea>
            <ChangePasswordModal userId={teacherId} opened={modalOpened} onClose={()=>{setModalOpened(false)}}/>
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
                        <Table.Th>{t('teachersTable.name')}</Table.Th>
                        <Table.Th>{t('teachersTable.email')}</Table.Th>
                        <Table.Th>{t('teachersTable.action')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <tbody>
                {
                    rows.length !== 0 ? rows : (
                        <Table.Td colSpan={3} style={{textAlign: 'center'}}>
                            {t('teachersTable.noData')}
                        </Table.Td>
                    )
                }
                </tbody>
            </Table>
        </ScrollArea>
    );
}
