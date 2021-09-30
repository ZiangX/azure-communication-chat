console.log("dug");
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
// Your unique Azure Communication service endpoint
let endpointUrl = "https://hausvalet-communication.communication.azure.com";
// The user access token generated as part of the pre-requisites
let userAccessToken =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmNkZjY5ZGZhLWM3ODYtNDQ5NC04YTY5LWU4MDU4MzdkMTA0OF8wMDAwMDAwYy1kMmFjLTVjYTctZjZiMC05ZjNhMGQwMDA2YmMiLCJzY3AiOjE3OTIsImNzaSI6IjE2MzI5Mzk3MTgiLCJleHAiOjE2MzMwMjYxMTgsImFjc1Njb3BlIjoiY2hhdCIsInJlc291cmNlSWQiOiJjZGY2OWRmYS1jNzg2LTQ0OTQtOGE2OS1lODA1ODM3ZDEwNDgiLCJpYXQiOjE2MzI5Mzk3MTh9.KRAI0ewZk2XvU9bCr9VNfxF8Tjxh0-iE9FM9xq-RYw0UX25v6levRrgFfy6uUVI7agIhnZ9jzANeBmthzW-cKGaVXbap4W6YbimA2hVpEJXkGdy70ZN6rh4vs8x8UnaeuiafoZgONk3gD_Er-vXjag1ZvFm_kvdSsFCVG6TgyVdU-KIegpfxtl2pAcEspd4TinXrfJujI6foRbo47PjhI8apclQxlQMfjT0YtMtdO3rkdQBFj5ESEQPUbtsGm3udGIctReGleI1qq5AZYbwEBUYeWUBIKTHX1UDmjVIZ6ZdzXG3qfSxvByzEwnw8e9mYjYGKz21czQw4SlYoVuyc7w";

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken));
console.log("Azure Communication Chat client created!");

async function createChatThread() {
  const createChatThreadRequest = {
    topic: "Hello, World!",
  };
  const createChatThreadOptions = {
    participants: [
      {
        id: { communicationUserId: "8:acs:cdf69dfa-c786-4494-8a69-e805837d1048_0000000c-d2ac-5ca7-f6b0-9f3a0d0006bc" },
        displayName: "test",
      },
    ],
  };
  const createChatThreadResult = await chatClient.createChatThread(createChatThreadRequest, createChatThreadOptions);
  const threadId = createChatThreadResult.chatThread.id;
  return threadId;
}

createChatThread().then(async (threadId) => {
  console.log(`Thread created:${threadId}`);

  // Get a chat thread client
  let chatThreadClient = chatClient.getChatThreadClient(threadId);
  console.log(`Chat Thread client for threadId:${threadId}`);
  // List all chat threads
  const threads = chatClient.listChatThreads();
  for await (const thread of threads) {
    console.log(`Chat Thread item:${thread.id}`);
  }

  // <SEND MESSAGE TO A CHAT THREAD>
  const sendMessageRequest = {
    content: "Please take a look at the attachment",
  };
  let sendMessageOptions = {
    senderDisplayName: "Jack",
    type: "text",
    metadata: {
      hasAttachment: "true",
      attachmentUrl: "https://contoso.com/files/attachment.docx",
    },
  };
  const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
  const messageId = sendChatMessageResult.id;
  console.log(`Message sent!, message id:${messageId}`);

  // <RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>
  // open notifications channel
  await chatClient.startRealtimeNotifications();
  // subscribe to new notification
  chatClient.on("chatMessageReceived", (e) => {
    console.log("Notification chatMessageReceived!", e);
  });

  // <LIST MESSAGES IN A CHAT THREAD>
  const messages = chatThreadClient.listMessages();
  for await (const message of messages) {
      console.log(`Chat Thread message id:${message.id}`, message);
  }

  // <ADD NEW PARTICIPANT TO THREAD>
  // <LIST PARTICIPANTS IN A THREAD>
  // <REMOVE PARTICIPANT FROM THREAD>
});
