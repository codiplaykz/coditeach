import {
    Alert,
    Button,
    Checkbox,
    Code,
    Flex,
    Group, LoadingOverlay,
    Modal,
    Paper,
    rem,
    ScrollArea,
    Space,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import classes from './Table.module.css';
import {IconCheck, IconInfoCircle, IconSearch, IconTrash} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {useState} from 'react';
import cx from 'clsx';
import AdminService from "../../api/AdminService.ts";
import {useTranslation} from "react-i18next";

interface Student {
    id: string;
    name: string;
    accountId: string;
    classroomId: string;
    schoolId: string;
    schoolName: string;
    profile_image: string;
}

interface StudentsTableProps {
    data: Student[],
    fetchStudents: Function
}

export function StudentsTable({ data, fetchStudents }: StudentsTableProps) {
    const [search, setSearch] = useState('');
    const [selection, setSelection] = useState<string[]>([]);
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false);
    let sortedData = data;
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation()

    if (search !== '') {
        sortedData = data.filter((item) => {
            if (item.name.toLowerCase().includes(search) || item.schoolName.toLowerCase().includes(search)) {
                return item;
            }
            if (selection.includes(item.id)) {
                return item;
            }
        });
    } else {
        sortedData = data;
    }

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === data.length ? [] : sortedData.map((item) => item.id)
        );


    const rows = sortedData.map((student) => {
        const selected = selection.includes(student.id);
        return (
            <Table.Tr key={student.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(student.id)} onChange={() => toggleRow(student.id)} />
                </Table.Td>
                <Table.Td><Code c={"blue"}>{student.id}</Code></Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        {/*<Avatar size={26} src={student.profile_image} radius={26} />*/}
                        <Text size="sm" fw={500}>
                            {student.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>
                    {student.accountId}
                </Table.Td>
                <Table.Td>{student.schoolName}</Table.Td>
                <Table.Td>
                    <Code>
                        {student.classroomId}
                    </Code>
                </Table.Td>
                <Table.Td>
                    <Code>
                        {student.schoolId}
                    </Code>
                </Table.Td>
            </Table.Tr>
        );
    });

    const deleteSelectedRows = () => {
        try {
            setLoading(true)
            AdminService.deleteStudents(selection).then(res => {
                notifications.show({
                    id: 'success-delete',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Successfully deleted student accounts!",
                    message: '',
                    color: 'green',
                    icon: <IconCheck />,
                    className: 'my-notification-class',
                    loading: false,
                });
                console.log(res)
                setOpenDeleteConfirmationModal(false)
                setSelection([])
                fetchStudents()
                setLoading(false)
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal centered opened={openDeleteConfirmationModal} onClose={()=>{setOpenDeleteConfirmationModal(false)}} title={<b>{t('adminStudentsTable.confirmAction')}</b>}>
                <LoadingOverlay visible={loading}/>
                <Alert variant="light" color="red" radius="md" title={t('adminStudentsTable.warningTitle')} icon={<IconInfoCircle/>}>
                    {t('adminStudentsTable.deleteWarning')}
                </Alert>
                <Space h={20}/>
                <Text fw={700}>{t('adminStudentsTable.selectedAccountsToDelete')}</Text>
                <Space h={10}/>
                {
                    selection.map(id => {
                        let account = data.find((item)=>{ return item.id == id });

                        return (
                            <>
                                <Paper style={{padding: '10px 15px', border: '#e0e0e0 solid 1px'}}>
                                    {account?.name}
                                </Paper>
                                <Space h={10}/>
                            </>
                        );
                    })
                }
                <Flex gap={10}>
                    <Button style={{width: '100%'}} color={'gray'} onClick={()=>{setOpenDeleteConfirmationModal(false)}}>{t('adminStudentsTable.cancelButton')}</Button>
                    <Button style={{width: '100%'}} color={'red'} onClick={deleteSelectedRows} loading={loading} disabled={loading}>{t('adminStudentsTable.deleteButton')}</Button>
                </Flex>
            </Modal>
            <ScrollArea h={800}>
                <TextInput
                    placeholder={t('adminStudentsTable.searchPlaceholder')}
                    mb="md"
                    size={'lg'}
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    value={search}
                    onChange={(e)=>{setSearch(e.target.value)}}
                />
                {
                    selection.length ? (
                        <>
                            <Button onClick={()=>{setOpenDeleteConfirmationModal(true)}} leftSection={<IconTrash />} color={'red'}>
                                {t('adminStudentsTable.deleteSelectedRowsButton', { count: selection.length })}
                            </Button>
                            <Space h={10}/>
                        </>
                    ) : ''
                }
                <Table horizontalSpacing="md" verticalSpacing="xs" striped highlightOnHover withTableBorder withColumnBorders miw={800}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: rem(40) }}>
                                <Checkbox
                                    onChange={toggleAll}
                                    checked={selection.length === data.length}
                                    indeterminate={selection.length > 0 && selection.length !== data.length}
                                />
                            </Table.Th>
                            <Table.Th>{t('adminStudentsTable.thID')}</Table.Th>
                            <Table.Th>{t('adminStudentsTable.thName')}</Table.Th>
                            <Table.Th>{t('adminStudentsTable.thSchoolName')}</Table.Th>
                            <Table.Th>{t('adminStudentsTable.thClassroomID')}</Table.Th>
                            <Table.Th>{t('adminStudentsTable.thSchoolID')}</Table.Th>
                            <Table.Th>{t('adminStudentsTable.thAccountID')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>

        </>
    );
}
