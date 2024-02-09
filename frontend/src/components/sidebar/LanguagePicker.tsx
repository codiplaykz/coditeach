import {useState} from 'react';
import {Group, Image, Menu} from '@mantine/core';
import {IconChevronDown} from '@tabler/icons-react';
import kz from './images/kazakh.webp'
import ru from './images/russian.png'
import us from './images/english.png'
import uz from './images/uzbek.webp'
import az from './images/azerbaijan.png'
import classes from './LanguagePicker.module.css';

export const languagesData = [
    { value: 'kz', label: 'Kazakh', image: kz },
    { value: 'ru', label: 'Russian', image: ru },
    { value: 'us', label: 'English', image: us },
    { value: 'uz', label: 'Uzbek', image: uz },
    { value: 'az', label: 'Azerbaijan', image: az },
];

interface LanguagePickerProps {
    selected: any,
    setSelected: Function
}

export function LanguagePicker({ selected, setSelected }: LanguagePickerProps) {
    const [opened, setOpened] = useState(false);
    const items = languagesData.map((item) => (
        <Menu.Item
            leftSection={<Image src={item.image} width={18} height={18} />}
            onClick={() => setSelected(item)}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            width="target"
            withinPortal
        >
            <Menu.Target>
                <div className={classes.control} data-expanded={opened || undefined}>
                    <Group gap="xs">
                        <Image src={selected.image} width={22} height={22} />
                        <span className={classes.label}>{selected.label}</span>
                    </Group>
                    <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                </div>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    );
}