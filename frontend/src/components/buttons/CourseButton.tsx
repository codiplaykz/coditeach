import {Group, Text, UnstyledButton, UnstyledButtonProps,} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import {MouseEventHandler} from "react";

interface CourseButtonProps extends UnstyledButtonProps {
    onClick?: MouseEventHandler,
    name: string;
    hours: number;
    icon?: React.ReactNode;
}

export function CourseButton({ onClick, name, hours, icon, ...others }: CourseButtonProps) {
    return (
        <UnstyledButton onClick={onClick} {...others}>
            <Group>
                <div style={{ flex: 1 }}>
                    <Text size="sm">
                        {name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {hours} hours
                    </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}