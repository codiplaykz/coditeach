import {Avatar, Box, Flex, Grid, Loader, ScrollArea, Space, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import AdminService from "../../api/AdminService.ts";
import {ManagersTable} from "../../components/admin/ManagersTable.tsx";
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

export default function ManagersPage() {
    const [managers, setManagers] = useState<ManagerResponse[]>()
    const { t } = useTranslation()

    const fetchManagers = () => {
        AdminService.getAllManagers().then(res => {
            setManagers(res.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(()=> {
        if (!managers) {
            fetchManagers()
        }
    }, [setManagers])

    return (
        <>
            <Grid gutter={5}>
                <Grid.Col span={12}>
                    <Flex gap={20} align={'center'}>
                        <Title order={3}>{t('managersPage.managersListTitle')}</Title>
                        <Avatar color={'green'}>{managers?.length ? managers.length : 'O'}</Avatar>
                    </Flex>
                    <Space h={"lg"}/>

                    <ScrollArea h={1000}>
                        {
                            !managers ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    <Loader size={24}/>
                                </Box>
                            ) : managers.length === 0 ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    {t('managersPage.noManagersFound')}
                                </Box>
                            ) : (
                                <>
                                    <ManagersTable fetchManagers={fetchManagers} data={managers}/>
                                </>
                            )
                        }
                    </ScrollArea>
                </Grid.Col>
            </Grid>

        </>
    )
}