import { VStack, Icon, useToast } from "native-base";
import { useCallback, useState } from "react";
import { FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Api } from "../Api/axios";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCard, PoolPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
    const navigation = useNavigation();
    const [poolsData, setPoolsData] = useState<PoolPros[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast()

    async function getPools() {
        try {
            await Api.get("/pools").then(res => setPoolsData(res.data.pools));

        } catch (error) {
            console.log(error);      
            toast.show({
                title: "Não foi possivel carragar os bolões",
                placement: "top",
                bgColor: "rose.500",
            })
        } finally {
            setIsLoading(false);

        }
    }

    useFocusEffect(
        useCallback(() => {
            getPools();
        }, [])
    );

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO" 
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />} 
                    onPress={ () => navigation.navigate('Find') }
                />
            </VStack>

            { isLoading ? <Loading /> : '' }

            <FlatList
                data={poolsData}
                keyExtractor={item => item.id}
                renderItem={ ({ item }) => <PoolCard data={item} onPress={() => navigation.navigate("Details", { id: item.id})} />}
                px={5}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb:10 }}
                ListEmptyComponent={() => <EmptyPoolList />}
            />
        </VStack>
    )
}