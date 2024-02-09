import cx from 'clsx';
import { useState } from 'react';
import {Table, Checkbox, ScrollArea, Group, Text, Button} from '@mantine/core';
import classes from './Table.module.css';
import {StudentResponse} from "../../../api/models/studentResponse.ts";
import {useTranslation} from "react-i18next";
import {IconEdit} from "@tabler/icons-react";
import ChangePasswordModal from "../../modals/ChangePasswordModal.tsx";

interface StudentsTableProps {
    data: StudentResponse[]
}

export function StudentsTable({ data }: StudentsTableProps) {
    const [selection, setSelection] = useState<string[]>([]);
    const { t } = useTranslation()
    const [modalOpened, setModalOpened] = useState(false)
    const [studentId, setStudentId] = useState('')

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const changePassword = (id: string) => {
        setModalOpened(true)
        setStudentId(id)
    }

    const rows = data.map((student) => {
        const selected = selection.includes(student.id);
        return (
            <Table.Tr key={student.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(student.id)} onChange={() => toggleRow(student.id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Text size="sm" fw={500}>
                            {student.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{student.accountId}</Table.Td>
                <Table.Td> <Button onClick={()=>{changePassword(student.id)}} leftSection={<IconEdit/>}
                                   radius={'50'} color={'green'}
                                   variant={'outline'}>{t('changePasswordModal.changePasswordTitle')}</Button>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <ScrollArea>
            <ChangePasswordModal isStudent={true} userId={studentId} opened={modalOpened} onClose={()=>{setModalOpened(false)}}/>
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
                        <Table.Th>{t('studentsTable.name')}</Table.Th>
                        <Table.Th>{t('studentsTable.accountId')}</Table.Th>
                        <Table.Th>{t('teachersTable.action')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <tbody>
                {
                    rows.length !== 0 ? rows : (
                        <Table.Td colSpan={3} style={{textAlign: 'center'}}>
                            {t('studentsTable.noData')}
                        </Table.Td>
                    )
                }
                </tbody>
            </Table>
        </ScrollArea>
    );
}
