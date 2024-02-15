import {Flex, Group, Paper, SimpleGrid, Text} from '@mantine/core';
import {Icon,} from '@tabler/icons-react';
import classes from './StatsGrid.module.css';
import {useTranslation} from "react-i18next";

interface Stats {
    title: string,
    value: number,
    icon: Icon
}

interface StatsGridProps {
    statistics: Stats[]
}

export function Stats({ statistics }: StatsGridProps) {
    const { t } = useTranslation()
    const renderedStats = statistics.map((stat) => {
        const Icon = stat.icon

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Flex justify={"space-between"}>
                    <Text size="xs" c="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
                </Flex>

                <Group align="flex-end" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    {t('stats.totalCount')}
                </Text>
            </Paper>
        );
    });

    return (
        <div>
            <SimpleGrid cols={statistics.length}>{renderedStats}</SimpleGrid>
        </div>
    );
}