import {
  Box,
  Heading,
  Image,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function EventPage() {
  const { state } = useLocation();
  const eventId = state.event.eventId;
  const eventName = state.event.eventName;
  const eventDate = state.event.eventDate;
  const eventTime = state.event.eventTime;
  const eventDescription = state.event.eventDescription;
  const eventImage = state.event.eventImage;

  const [banner, setBanner] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = import.meta.env.VITE_API_GATEWAY_URL + "/register";
    await fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          bannerId: banner,
          name: name,
          email: email,
          eventId: eventId,
          checkBox: isChecked,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          // console.log(res);
          alert(res.message);
        } else {
          alert("Error in Registration.");
        }
      });
  };

  return (
    <Box maxW="800px" mx="auto" py={8}>
      <Image src={eventImage} alt={eventName} maxH="400px" mx="auto" />

      <VStack mt={8} spacing={4}>
        <Heading size="xl">{eventName}</Heading>
        <Heading size="xl">{}</Heading>
        <Box textAlign="center">
          <Text fontSize="xl">Date: {eventDate}</Text>
          <Text fontSize="xl">Time: {eventTime}</Text>
        </Box>
        <Box textAlign="start">
          <Text>{eventDescription}</Text>
        </Box>

        <Heading size="xl">Register for this event</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="student-id">Banner Number</FormLabel>
              <Input
                id="student-id"
                type="text"
                placeholder="Enter your student ID"
                required
                onChange={(event) => {
                  setBanner(event.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                required
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email address</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </FormControl>

            <Checkbox
              isChecked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            >
              Subscribe for email when new event arrives
            </Checkbox>

            <Button type="submit" colorScheme="blue">
              Register
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default EventPage;
