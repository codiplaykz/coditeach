import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
}

export function UserButton({ image, name, email, icon, ...others }: UserButtonProps) {

    return (
        <UnstyledButton {...others}>
            <Group>
                <Avatar src={image} radius="xl" />

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