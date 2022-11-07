import { useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { FlatList } from 'native-base';
import { Api } from '../Api/axios';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [firstTeamPoints, setFirstTeamPoints] = useState(" ")
  const [secondTeamPoints, setSecondTeamPoints] = useState(" ")
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const toast = useToast();

  async function handleGuessesConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do palpite.",
          placement: "top",
          bgColor: "red.500"
        })
      }

      await Api.post(`/guesses/${poolId}/${gameId}`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: "Palpite realizado com sucesso.",
        placement: "top",
        bgColor: "green.500"
      })

      getGames();

    } catch (error) {
      if (error?.response?.data?.error == "You cannot send guesses after the game.") {
        console.log(error.response.data.error);
        toast.show({
          title: "Não é possivel fazer um palpite após o jogo.",
          placement: "top",
          bgColor: "red.500"
        })

      } else if (error?.response?.data?.error == "You already sent a guess to game on this pool.") {
        console.log(error.response.data.error);
        toast.show({
          title: "Você não faz parte desse bolão.",
          placement: "top",
          bgColor: "red.500"
        })

      } else {
        console.log(error);
        toast.show({
          title: "Não foi possivel enviar o palpite.",
          placement: "top",
          bgColor: "red.500"
        })
        
      }
    
    } finally {
      setIsLoading(false);

    }

  }

  async function getGames() {
    try {
      await Api.get(`/pools/${poolId}/games`)
        .then(res => setGames(res.data.games));

    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possivel carregar os jogos",
        placement: "top",
        bgColor: "red.500"
      })
    
    } finally {
      setIsLoading(false);

    }

  }

  useEffect(() => {
    getGames();

  }, [poolId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={ item => item.id }
      ListEmptyComponent={() => <></>}
      renderItem={ ({ item }) => (
        <Game 
          data={item} 
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessesConfirm(item.id)}
        />
      )}
    />
  );
}
