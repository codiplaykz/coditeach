import {Group, Text, UnstyledButton, UnstyledButtonProps,} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import {MouseEventHandler} from "react";
import classes from "./Button.module.css";
import {useTranslation} from "react-i18next";

interface ClassroomButtonProps extends UnstyledButtonProps {
    onClick?: MouseEventHandler,
    name: string;
    createdAt: string;
    icon?: React.ReactNode;
}

export function ClassroomButton({ onClick, name, createdAt, icon, ...others }: ClassroomButtonProps) {
    const { t } = useTranslation()
    return (
        <UnstyledButton className={classes.user} px={20} py={10} mb={10} onClick={onClick} {...others}>
            <Group>
                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {t('classroomsPage.createdAt')}: {createdAt}
                    </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}