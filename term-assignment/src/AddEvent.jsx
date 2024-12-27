import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

function AddEvent() {
  const [eventName, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventDescription, setEventDescription] = useState();
  const [eventTime, setEventTime] = useState();
  const [eventImage, setEventImage] = useState();
  let randomInt = Math.floor(Math.random() * 90000) + 10000;
  const eventId = randomInt.toString();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = import.meta.env.VITE_API_GATEWAY_URL + "/create-topic";
    await fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          eventName: eventName,
          eventDate: eventDate,
          eventDescription: eventDescription,
          eventTime: eventTime,
          eventImage: eventImage,
          eventId: eventId,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          alert(res.message);
        } else {
          alert("Error in Adding event.");
        }
      });
  };

  return (
    <Box maxW="800px" mx="auto" py={8}>
      <VStack mt={8} spacing={4}>
        <Heading size="xl">Add Event</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="title">Event Title</FormLabel>
              <Input
                id="title"
                type="text"
                placeholder="Enter Event Title"
                required
                onChange={(event) => {
                  setEventName(event.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="description"
                type="text"
                placeholder="Enter event description"
                required
                onChange={(event) => {
                  setEventDescription(event.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="data">Event Date</FormLabel>
              <Input
                id="date"
                type="text"
                placeholder="Enter date in dd/mm/yyyy form"
                required
                onChange={(event) => {
                  setEventDate(event.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="time">Event Time</FormLabel>
              <Input
                id="time"
                type="text"
                placeholder="Enter time in 1:30-3:30 form"
                required
                onChange={(event) => {
                  setEventTime(event.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="image">Event Image URL</FormLabel>
              <Input
                id="image"
                type="text"
                placeholder="Enter image url"
                required
                onChange={(event) => {
                  setEventImage(event.target.value);
                }}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue">
              Add Event
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default AddEvent;
