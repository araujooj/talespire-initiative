/* eslint-disable react/require-default-props */
import { FieldError } from 'react-hook-form';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react';
import { IconType } from 'react-icons/lib';
import {
 useRef, useState, useCallback, useEffect,
} from 'react';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: null | string;
  icon?: IconType;
}

type inputVariationOptions = {
  [key: string]: string;
};

const inputVariation: inputVariationOptions = {
  error: 'red.500',
  default: 'gray.100',
  filled: 'green.500',
};

export function Input({
 name, label, icon: Icon, error = null, ...rest
}: InputProps) {
  const [variation, setVariation] = useState('default');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      return setVariation('error');
    }
  }, [error]);

  const handleInputFocus = useCallback(() => {
    if (!error) {
      setVariation('focus');
    }
  }, [error]);

  const handleInputBlur = useCallback(() => {
    if (inputRef.current?.value && !error) {
      return setVariation('filled');
    }
  }, [error]);

  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <InputGroup flexDirection="column">
        {Icon && (
          <InputLeftElement color={inputVariation[variation]} mt="2.5">
            <Icon />
          </InputLeftElement>
        )}

        <ChakraInput
          id={name}
          name={name}
          onBlurCapture={handleInputBlur}
          onFocus={handleInputFocus}
          borderColor={inputVariation[variation]}
          color={inputVariation[variation]}
          bg="gray.50"
          variant="outline"
          _hover={{ bgColor: 'gray.100' }}
          _placeholder={{ color: 'gray.600' }}
          size="lg"
          h="60px"
          ref={inputRef}
          {...rest}
        />

        {!!error && <FormErrorMessage color="red.500">{error}</FormErrorMessage>}
      </InputGroup>
    </FormControl>
  );
}
