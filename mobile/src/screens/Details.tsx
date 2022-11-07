import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Share } from "react-native";

import { Api } from "../Api/axios";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
    id: string
}   

export function Details() {
    const [optionSelected, setOptionSelected] = useState<"Seus palpites" | "Raking do grupo">("Seus palpites");
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setPoolDetais] = useState<PoolPros>();

    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as RouteParams;

    const toast = useToast();

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        });
    }
    
    async function getPoolDetails() {
        try {
            await Api.get(`/pools/${id}`)
                .then(res => setPoolDetais(res.data.pool));
        } catch (error) {
            console.log(error);
            toast.show({
                title: "Não foi possivel carregar os detalhes do bolão",
                placement: "top",
                bgColor: "red.500",
            });

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getPoolDetails();
    }, [id]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare} />
            {
                poolDetails?._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />

                    <HStack bgColor="gray.800" px={1} rounded="sm" mb={5}>
                        <Option 
                            title="Seus palpites" 
                            isSelected={optionSelected == "Seus palpites"} 
                            onPress={() => setOptionSelected("Seus palpites")}
                            />
                        <Option 
                            title="Raking do grupo" 
                            isSelected={optionSelected == "Raking do grupo"} 
                            onPress={() => setOptionSelected("Raking do grupo")}
                            />
                    </HStack>

                    <Guesses poolId={poolDetails.id} />

                </VStack>
                : <EmptyMyPoolList code={poolDetails.code} />
            }
        </VStack>
    )
}