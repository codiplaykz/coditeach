import {Group, Text, UnstyledButton, UnstyledButtonProps,} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import {MouseEventHandler} from "react";
import classes from './Button.module.css'

interface StudentButtonProps extends UnstyledButtonProps {
    onClick?: MouseEventHandler,
    id: string,
    name: string,
    icon?: React.ReactNode,
}

export function StudentButton({ id, onClick, name, icon, ...others }: StudentButtonProps) {

    return (
        <UnstyledButton className={classes.user} px={20} py={20} key={id} onClick={onClick} {...others}>
            <Group>
                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {id}
                    </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}