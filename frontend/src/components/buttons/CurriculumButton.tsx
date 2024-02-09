import {Group, Text, UnstyledButton, UnstyledButtonProps,} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import {MouseEventHandler} from "react";
import classes from "./Button.module.css";
import {useTranslation} from "react-i18next";

interface CourseButtonProps extends UnstyledButtonProps {
    onClick?: MouseEventHandler,
    name: string;
    chapters: number;
    icon?: React.ReactNode;
}

export function CurriculumButton({ onClick, name, chapters, icon, ...others }: CourseButtonProps) {
    const { t } = useTranslation()
    return (
        <UnstyledButton className={classes.user} px={20} py={20} onClick={onClick} {...others}>
            <Group>
                <div style={{ flex: 1 }}>
                    <Text size="sm">
                        {name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {chapters} {t('curriculumsPage.chapter')}
                    </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}