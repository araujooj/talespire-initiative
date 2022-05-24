import {
 Button, Center, Flex, Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import logo from '../../assets/logo.svg';
import { Input } from '../../components/Form/Input';
import { api } from '../../services/api';

export function Landing() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const router = useRouter();

  const createRoom = async () => {
    if (!name) {
      return setError(true);
    }

    setLoading(true);

    api.post('/rooms', { name }).then((response) => {
      const { slug } = response.data;

      router.push(`/rooms/${slug}`);
    }).catch((err) => console.log(err));
  };

  return (
    <Flex height="100vh" justify="center" align="center" flexDir="column">
      <Image src={logo} />

      <Flex flexDir={['column', 'row']} align="center">
        <Input
          onChangeCapture={(e) => {
            setError(false);
            setName(e.currentTarget.value);
          }}
          placeholder="Room name"
          name="name"
          error={error && 'Room name is required'}
        />
        <Button
          w={['100%', 'auto']}
          borderRadius="8px"
          bg="#EC2127"
          padding="8"
          textColor="white"
          fontWeight="600"
          _hover={{
            bg: 'red.600',
          }}
          ml={['0', '4']}
          mt={['2', '0']}
          onClickCapture={() => createRoom()}
        >
          Create room
        </Button>
      </Flex>
    </Flex>
  );
}
