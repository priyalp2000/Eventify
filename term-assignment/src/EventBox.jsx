import { GridItem, Image, Box, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function EventBox({ event }) {
  const navigate = useNavigate();
  const id = event.eventId;
  const link = `/event/${id}`;
  const onRegister = (event) => {
    navigate(`/event/${id}`, { state: { event: event } });
  };
  return (
    <GridItem w="100%" h="100%" direction={["column", "row"]}>
      {/* Reference: https://chakra-ui.com/docs/components/box */}
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Image boxSize="sm" src={event.eventImage} alt={"Event"} />
        <Box p="6">
          <Flex justifyContent="center" alignItems="center" h="100%">
            <Box
              mt="1"
              fontSize={17}
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              noOfLines={1}
            >
              {event.eventName}
            </Box>
          </Flex>
          <Flex justifyContent="center" alignItems="center" h="100%">
            {/* https://stackoverflow.com/questions/66021357/how-to-pass-id-to-react-js-path-link */}
            <Button
              mt="3"
              colorScheme="blue"
              variant="solid"
              px={20}
              h={8}
              onClick={() => onRegister(event)}
            >
              Register
            </Button>
          </Flex>
        </Box>
      </Box>
    </GridItem>
  );
}
