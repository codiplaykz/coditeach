import {Flex, Group, Paper, Text} from "@mantine/core";
import classes from "./Styles.module.css";
import {BasicCardButtonProps} from "./BasicCardButton.tsx";
import {IconLock} from "@tabler/icons-react";
import {openModal} from "@mantine/modals";
import {useTranslation} from "react-i18next";

export default function LockedCardButton({primaryText, secondaryText, categoryText}: BasicCardButtonProps) {
    const {t} = useTranslation()

    const openDescriptionModal = () => {
        openModal({
            title: <Text fw={600} size={'xl'}>{t('curriculumsPage.locked_title')}</Text> ,
            children: (
                <>
                    {t('curriculumsPage.locked_description')}
                </>
            )
        })
    }

    return (
        <Paper onClick={openDescriptionModal} style={{cursor: "pointer"}} className={classes.locked_card} withBorder p="md" radius="md" key={''}>
            <Group justify="space-between">
                <Text c={'dimmed'} size={'xs'} className={classes.title}>
                    {categoryText}
                </Text>
            </Group>

            <Group align="flex-end" gap="xs" mt={25}>
                <Flex gap={'10'} align={'center'}>
                    <IconLock className={classes.icon}/>
                    <Text size={'lg'} className={classes.value} fw={600}>{primaryText}</Text>
                </Flex>
            </Group>

            <Text fz="xs" c="dimmed" mt={7} className={classes.secondary}>
                {secondaryText}
            </Text>
        </Paper>
    )
}