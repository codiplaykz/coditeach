import {Avatar, Group, Text} from '@mantine/core';
import {Icon123, IconHash} from '@tabler/icons-react';
import classes from './Styles.module.css';

interface StudentCardProps {
    id: string,
    accountId: string,
    name: string,
    profileImg: string
}

export function StudentCard({id, profileImg, accountId, name}: StudentCardProps) {
    return (
        <div>
            <Group wrap="nowrap">
                <Avatar
                    src={profileImg}
                    size={94}
                    radius="md"
                />
                <div>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        Student
                    </Text>

                    <Text fz="lg" fw={500} className={classes.name}>
                        {name}
                    </Text>

                    <Group wrap="nowrap" gap={10} mt={3}>
                        <IconHash stroke={1.5} size="1rem" className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            {accountId}
                        </Text>
                    </Group>

                    <Group wrap="nowrap" gap={10} mt={5}>
                        <Icon123 stroke={1.5} size="1rem" className={classes.icon} />
                        <Text fz="xs" c="dimmed">
                            {id}
                        </Text>
                    </Group>
                </div>
            </Group>
        </div>
    );
}