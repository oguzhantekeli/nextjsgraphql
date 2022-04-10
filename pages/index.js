import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useState } from "react";
import {
  Heading,
  Box,
  Flex,
  Input,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import Characters from "../components/characters";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters] = useState(initialState.characters);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const onSubmit = async (e) => {
    e.preventDefault();
    const results = await fetch("/api/SearchCharacters", {
      method: "post",
      body: search,
    });
    const { characters, error } = await results.json();
    if (error) {
      toast({
        position: "top",
        title: "An Error Occured.",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setCharacters(characters);
    }
  };
  return (
    <>
      <Head>
        <title>Rick and morty - nextjs app</title>
        <meta name="description" content="next with graphql app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column" justify="center" align="center">
        <Box
          mb={4}
          flexDirection="column"
          align="center"
          justifyContent="center"
          py={8}
        >
          <Heading as="h1" size="2xl" mb={8}>
            Ricko Und Morto
          </Heading>
          <form onSubmit={(e) => onSubmit(e)}>
            <Stack maxWidth="360px" width="100%" isInline mb={8}>
              <Input
                placeholder="Search"
                value={search}
                border="none"
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton
                colorScheme="blue"
                arial-label="Search"
                icon={<SearchIcon />}
                disabled={search === ""}
                type="submit"
              />
              <IconButton
                colorScheme="red"
                arial-label="Reset"
                icon={<CloseIcon />}
                disabled={search === ""}
                type="reset"
                onClick={async () => {
                  setSearch("");
                  setCharacters(initialState.characters);
                }}
              />
            </Stack>
          </form>
          <Characters characters={characters} />
        </Box>
      </Flex>
    </>
  );
}

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: "http://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              id
              name
            }
            origin {
              id
              name
            }
            episode {
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `,
  });
  return {
    props: {
      characters: data.characters.results,
      //buradaki characters gql querydeki characters. results ise onun içindeki results verisi
    },
  };
};
