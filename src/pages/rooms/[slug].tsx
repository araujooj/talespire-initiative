import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Input,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { FiClipboard, FiTrash } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { api } from '../../services/api';
import logo from '../../assets/logo.svg';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

interface Initiative {
  id: number;
  talespire_id: string;
  player: string;
  name: string;
  mini: string;
  formula: string;
  die: string;
  total: string;
  room_id: number;
}

interface RoomData {
  apiURL: string;
  name: string;
  slug: string;
  initiatives: Initiative[];
}

export default function Room() {
  const [room, setRoom] = useState<RoomData>({} as RoomData);
  const [diceValue, setDiceValue] = useState('');
  const [modValue, setModValue] = useState('');

  const {
    query: { slug },
  } = useRouter();

  const { data, error } = useSWR(`/rooms/${slug}`, fetcher);

  const toast = useToast();

  useEffect(() => {
    if (data) {
      setRoom(data);
    }
  }, [data]);

  const cleanList = async () => {
    await api.delete(`/room_initiative/${slug}`).then((res) => {
      setRoom({ ...room, initiatives: [] });
      toast({
        title: 'Deleted all initiatives on the room',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    });
  };

  const deleteInitiative = async (id: number) => {
    const filteredInitiatives = room.initiatives.filter(
      (element) => element.id !== id,
    );
    await api
      .delete(`initiative/${id}`)
      .then((res) => {
        setRoom({ ...room, initiatives: filteredInitiatives });
      })
      .catch((err) => toast({
          title: 'Error on delete!',
          status: 'error',
          duration: 9000,
          isClosable: true,
        }));
  };

  return (
    <Flex height="100vh" justify="center" align="center" flexDir="column">
      <Heading my="2">{room.name}</Heading>
      <Flex flexDir={['column', 'row']} align="center">
        <Box
          width="100%"
          padding="30px 15px"
          border="8px solid"
          borderColor="#f5f5f5"
          as="form"
          bg="white"
          color="gray.800"
          borderRadius="16px"
        >
          <VStack spacing="4">
            {room.initiatives?.length ? (
              room.initiatives.map((initiative) => (
                <Flex
                  p="2"
                  align="center"
                  minW="350px"
                  maxW="500px"
                  bg="#f5f5f5"
                  justify="space-between"
                >
                  <Text fontWeight="medium">{initiative.mini}</Text>
                  <Flex align="center">
                    <Text fontWeight="medium">
                      Rolled
                      {' '}
                      {initiative.total}
                    </Text>
                    <Button
                      onClick={() => deleteInitiative(initiative.id)}
                      _hover={{
                        bg: 'red.600',
                      }}
                      borderRadius="6"
                      ml="3"
                      color="white"
                      bg="#ec2127"
                    >
                      <FiTrash size="18px" />
                    </Button>
                  </Flex>
                </Flex>
              ))
            ) : (
              <Text>Nothing on the list yet!</Text>
            )}
          </VStack>

          {room.initiatives?.length ? (
            <Flex mt="8" align="center" justify="space-between">
              <Image width="110px" height="60px" src={logo} />
              <Button
                color="white"
                bg="#ec2127"
                _hover={{
                  bg: 'red.600',
                }}
                onClick={() => cleanList()}
              >
                Clean list
              </Button>
            </Flex>
          ) : null}
        </Box>
      </Flex>
      <Flex mt="4" maxW="400px" flexDir={['column', 'row']}>
        <Input
          name="dice"
          mr="1"
          placeholder="Ex: 1d20"
          onChangeCapture={(e) => setDiceValue(e.currentTarget.value)}
        />
        <Input
          name="bonus"
          placeholder="+5"
          onChangeCapture={(e) => setModValue(e.currentTarget.value)}
        />
        <Button
          as="a"
          href={`talespire://dice/Initiative:${diceValue + modValue}`}
          ml="1"
          w="200px"
        >
          Roll
        </Button>
      </Flex>
      <Text
        _hover={{
          cursor: 'pointer',
        }}
        onClick={() => {
          toast({
            title: 'Copied to clipboard!',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          navigator.clipboard.writeText(room.apiURL);
        }}
        display="flex"
        align="center"
        mt="4"
        textAlign="center"
      >
        Link for plugin -
        {' '}
        {room.apiURL}
        <FiClipboard
          style={{
            marginTop: '4px',
            marginLeft: '2px',
          }}
        />
      </Text>
    </Flex>
  );
}
