import { GetServerSideProps } from 'next';
import { api } from '../../services/api';

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
    name: string;
    slug: string;
    initiatives: Initiative[];
  };
}

export default function Room({ room }: RoomProps) {
  console.log(room);
  return <div>Room</div>;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;

  const response = await api.get(`/rooms/${slug}`);

  return {
    props: {
      room: response.data,
    },
  };
};
