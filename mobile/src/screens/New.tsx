import { Heading, Text, useToast, VStack } from "native-base";
import { useState } from "react";
import { Api } from "../Api/axios";
import Logo from '../assets/logo.svg';
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function New() {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    async function handlePoolCreate() {
        if (!title.trim()) {
            return toast.show({
                title: "Opa! Informe um título para o bolão.",
                placement: "top",
                bgColor: "red.500"
            })
        }

        try {
            setIsLoading(true);
            let poolTitle = title.trim();

            await Api.post("/pools", { title: poolTitle });
            toast.show({
                title: "Bolão criado com sucesso!",
                placement: "top",
                bgColor: "green.500"
            });

            setTitle("");

        } catch(error) {
            toast.show({
                title: "Opa! Não foi possivel criar o bolão.",
                placement: "top",
                bgColor: "red.500"
            });

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" />
            <VStack mt={8} mx={5} alignItems="center">
                <Logo />
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </Heading>
                <Input mb={2} 
                    value={title}
                    onChangeText={value => setTitle(value)}
                    placeholder="Qual o nome do seu bolão?"
                />
                <Button 
                    title="CRIAR MEU BOLÃO" 
                    onPress={handlePoolCreate}
                    isLoading={isLoading} />
                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}