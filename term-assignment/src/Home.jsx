import {
  SimpleGrid,
  Box,
  HStack,
  Input,
  Heading,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EventBox } from "./EventBox";

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

  const filteredEvents = events.filter((event) => {
    return event.eventName.toLowerCase().includes(newKeyword.toLowerCase());
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const url = import.meta.env.VITE_API_GATEWAY_URL + "/fetch-details";
      const response = await fetch(
        url
      );
      const data = await response.json();
      setEvents(data.data);
    };
    fetchEvents();
  }, []);

  const totalEvents = filteredEvents.map((event) => (
    <EventBox event={event} key={event.eventId} />
  ));
  return (
    <div>
      <Box
      as="section"
      marginTop={10}>
        <Heading textAlign="center" textColor='blue.500'>Welcome to Eventify</Heading>
      </Box>
      <Box
        as="section"
        marginBottom={5}
        marginLeft={5}
        marginRight={5}
        marginTop={10}
      >
        {/* Reference: https://chakra-ui.com/docs/components/stack */}
        <HStack>
          <Input
            size="lg"
            variant="outline"
            placeholder="Search"
            onChange={(event) => {
              setNewKeyword(event.target.value);
            }}
          />
        </HStack>
      </Box>
      <SimpleGrid
        minChildWidth="350px"
        spacing="10px"
        direction={["column", "row"]}
        ml={5}
        mr={5}
      >
        {totalEvents}
      </SimpleGrid>
    </div>
  );
};
