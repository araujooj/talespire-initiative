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
import { FiTrash } from 'react-icons/fi';
import { useState } from 'react';
import { api } from '../../services/api';
import logo from '../../assets/logo.svg';

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

interface RoomProps {
  room: {
    apiURL: string;
    name: string;
    slug: string;
    initiatives: Initiative[];
  };
}

export default function Room({ room }: RoomProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>(
    room.initiatives,
  );
  const [diceValue, setDiceValue] = useState('');
  const [modValue, setModValue] = useState('');

  const toast = useToast();

  const cleanList = async () => {
    await api.delete(`/room_initiative/${room.slug}`).then((res) => {
      setInitiatives([]);
      toast({
        title: 'Deleted all initiatives on the room',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    });
  };

  const deleteInitiative = async () => {};

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
            {initiatives.length ? (
              initiatives.map((initiative) => (
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

          {initiatives.length ? (
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
        <Input name="dice" mr="1" placeholder="Ex: 1d20" onChangeCapture={(e) => setDiceValue(e.currentTarget.value)} />
        <Input name="bonus" placeholder="+5" onChangeCapture={(e) => setModValue(e.currentTarget.value)} />
        <Button
          as="a"
          href={`talespire://dice/Initiative:${diceValue + modValue}`}
          ml="1"
          w="200px"
        >
          Roll
        </Button>
      </Flex>
      <Text mt="4" textAlign="center">
        Link for plugin -
        {' '}
        {room.apiURL}
      </Text>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params;

  const response = await api.get(`/rooms/${slug}`);

  return {
    props: {
      room: response.data,
    },
  };
};
