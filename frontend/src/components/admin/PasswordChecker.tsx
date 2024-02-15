import {useEffect, useState} from 'react';
import {Flex, Text} from '@mantine/core';
import {IconCheck, IconX} from "@tabler/icons-react";
import {useTranslation} from "react-i18next";

interface PasswordStrengthCheckerProps {
    password: string
}

const PasswordStrengthChecker = ({ password }: PasswordStrengthCheckerProps) => {
    const {t} = useTranslation()
    const [strength, setStrength] = useState({
        digit: false,
        lowerCase: false,
        upperCase: false,
        specialChar: false,
        length: false
    });

    useEffect(() => {
        setStrength({
            digit: /\d/.test(password),
            lowerCase: /[a-z]/.test(password),
            upperCase: /[A-Z]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            length: password.length >= 8
        });
    }, [password]);

    const renderBadge = (check: boolean, text: string) => (
        <Flex gap={10} align={'center'} my={10}>
            {check ? ( <IconCheck color={'green'}/> ) : ( <IconX color={'red'}/> )}
            <Text size={'md'}> {t(`passwordChecker.${text}`)} </Text>
        </Flex>
    );

    return (
        <div>
            {renderBadge(strength.digit, 'IncludesADigit')}
            {renderBadge(strength.lowerCase, 'HasALowercaseLetter')}
            {renderBadge(strength.upperCase, 'HasAnUppercaseLetter')}
            {renderBadge(strength.specialChar, 'ContainsASpecialCharacter')}
            {renderBadge(strength.length, 'AtLeast8CharactersLong')}
        </div>
    );
};

export default PasswordStrengthChecker;
