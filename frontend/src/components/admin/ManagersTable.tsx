import cx from 'clsx';
import {useState} from 'react';
import {
    Alert,
    Badge,
    Button,
    Checkbox,
    Code,
    Flex,
    Group,
    Modal,
    Paper,
    rem,
    ScrollArea,
    Space,
    Table,
    Text,
    TextInput
} from '@mantine/core';
import classes from './Table.module.css';
import {IconCheck, IconInfoCircle, IconSearch, IconTrash, IconX} from "@tabler/icons-react";
import AdminService from "../../api/AdminService.ts";
import {notifications} from "@mantine/notifications";
import {useUserStore} from "../../store/user";
import {useTranslation} from "react-i18next";

interface ManagerResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    schoolId: string;
    isVerified: boolean;
    profile_image: string;
}

interface ManagersTableProps {
    data: ManagerResponse[],
    fetchManagers: Function
}

export function ManagersTable({ data, fetchManagers }: ManagersTableProps) {
    const [search, setSearch] = useState('');
    const [selection, setSelection] = useState<string[]>([]);
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false)
    let sortedData = data
    const [loading, setLoading] = useState(false)
    const { user } = useUserStore()
    const { t } = useTranslation()

    if (search !== '') {
        sortedData = data.filter((item) =>
            {
                if (item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search)) {
                    return item
                }
                if (selection.includes(item.id)) {
                    return item
                }
            }
        );
    } else {
        sortedData = data
    }

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === data.length ? [] : sortedData.map((item) => item.id)
        );

    const rows = sortedData.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    {
                        item.role !== 'ADMIN' && (
                            <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
                        )
                    }
                </Table.Td>
                <Table.Td><Code c={"blue"}>{item.id}</Code></Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        {/*<Avatar size={26} src={item.profile_image} radius={26} />*/}
                        <Text size="sm" fw={500}>
                            {item.name}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{item.email}</Table.Td>
                <Table.Td>{item.role}</Table.Td>
                <Table.Td><Code c={"green"}>{item.schoolId}</Code></Table.Td>
                <Table.Td>{item.isVerified ? (
                    <Badge color={'green'}>Verified</Badge>
                ) : (
                    <Badge color={'red'}>Not Verified</Badge>
                )}</Table.Td>
            </Table.Tr>
        );
    });

    const deleteSelectedRows = () => {
        try {
            if (selection.indexOf(user?.id!) !== -1) {
                setOpenDeleteConfirmationModal(false)
                setSelection([])
                notifications.show({
                    id: 'error-delete',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "You can't delete yourself!",
                    message: '',
                    color: 'red',
                    icon: <IconX />,
                    className: 'my-notification-class',
                    loading: false,
                });
            } else {
                setLoading(true)
                AdminService.deleteManagers(selection).then(res => {
                    notifications.show({
                        id: 'success-delete',
                        withCloseButton: true,
                        autoClose: 2000,
                        title: "Successfully deleted accounts!",
                        message: '',
                        color: 'green',
                        icon: <IconCheck />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                    console.log(res)
                    setOpenDeleteConfirmationModal(false)
                    setSelection([])
                    fetchManagers()
                    setLoading(false)
                }).catch(error => {
                    console.log(error)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal centered opened={openDeleteConfirmationModal} onClose={()=>{setOpenDeleteConfirmationModal(false)}} title={t('managersPage.table.confirmAction')}>
                <Alert variant="light" color="red" radius="md" title={t('managersPage.table.warningTitle')} icon={<IconInfoCircle/>}>
                    {t('managersPage.table.deleteAccountWarning')}
                </Alert>
                <Space h={20}/>
                <Text fw={700}>{t('managersPage.table.selectedAccounts')}</Text>
                <Space h={10}/>
                {
                    selection.map(id => {
                        let account = data.find((item)=>{ return item.id == id });
                        return (
                            <>
                                <Paper style={{padding: '10px 15px', border: '#e0e0e0 solid 1px'}}>
                                    {account?.email}
                                </Paper>
                                <Space h={10}/>
                            </>
                        );
                    })
                }
                <Flex gap={10}>
                    <Button style={{width: '100%'}} color={'gray'} onClick={()=>{setOpenDeleteConfirmationModal(false)}}>{t('managersPage.table.cancel')}</Button>
                    <Button style={{width: '100%'}} color={'red'} onClick={deleteSelectedRows} loading={loading} disabled={loading}>{t('managersPage.table.delete')}</Button>
                </Flex>
            </Modal>
            <ScrollArea h={800}>
                <TextInput
                    placeholder={t('managersPage.table.searchPlaceholder')}
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
                                {t('managersPage.table.deleteSelected', { count: selection.length })}
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
                        <Table.Th>{t('managersPage.table.id')}</Table.Th>
                        <Table.Th>{t('managersPage.table.name')}</Table.Th>
                        <Table.Th>{t('managersPage.table.email')}</Table.Th>
                        <Table.Th>{t('managersPage.table.role')}</Table.Th>
                        <Table.Th>{t('managersPage.table.schoolId')}</Table.Th>
                        <Table.Th>{t('managersPage.table.verificationStatus')}</Table.Th>
                    </Table.Tr>
                    </Table.Thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </>
    );
}
