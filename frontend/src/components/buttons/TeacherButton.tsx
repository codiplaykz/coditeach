import {Group, Text, UnstyledButton, UnstyledButtonProps,} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import {MouseEventHandler} from "react";
import classes from "./Button.module.css";

interface TeacherButtonProps extends UnstyledButtonProps {
    onClick?: MouseEventHandler,
    name: string;
    email: string;
    icon?: React.ReactNode;
}

export function TeacherButton({ onClick, name, email, icon, ...others }: TeacherButtonProps) {
    return (
        <UnstyledButton className={classes.user} px={20} py={20} onClick={onClick} {...others}>
            <Group>
                <div style={{ flex: 1 }}>
                    <Text size="sm">
                        {name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {email}
                    </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}