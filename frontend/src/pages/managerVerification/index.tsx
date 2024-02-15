import {Avatar, Box, Flex, Grid, Loader, ScrollArea, Space, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import AdminService from "../../api/AdminService.ts";
import {ManagerVerificationTable} from "../../components/admin/ManagerVerificationTable.tsx";
import {useTranslation} from "react-i18next";

interface ManagerVerification {
    id: string;
    email: string;
    verificationCode: string;
    isVerified: boolean;
    updatedAt: string;
    limitCount: number;
}

export default function ManagerVerificationPage() {
    const [managersVerifications, setManagerVerifications] = useState<ManagerVerification[]>()
    const { t } = useTranslation()

    const fetchManagerVerifications = () => {
        AdminService.getAllManagerVerifications().then(res => {
            console.log(res.data)
            setManagerVerifications(res.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(()=> {
        if (!managersVerifications) {
            fetchManagerVerifications()
        }
    }, [setManagerVerifications])

    return (
        <>
            <Grid gutter={5}>
                <Grid.Col span={12}>
                    <Flex gap={20} align={'center'}>
                        <Title order={3}>{t('managerVerificationsPage.title')}</Title>
                        <Avatar color={'green'}>{managersVerifications?.length ? managersVerifications.length : '0'}</Avatar>
                    </Flex>
                    <Space h={"lg"}/>

                    <ScrollArea h={1000}>
                        {
                            !managersVerifications ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    <Loader size={24}/>
                                </Box>
                            ) : managersVerifications.length === 0 ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    {t('managerVerificationsPage.noManagersFound')}
                                </Box>
                            ) : (
                                <ManagerVerificationTable data={managersVerifications} fetchManagerVerifications={fetchManagerVerifications}/>
                            )
                        }
                    </ScrollArea>
                </Grid.Col>
            </Grid>
        </>
    )
}