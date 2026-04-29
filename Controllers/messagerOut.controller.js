import { createMessage, fetchMessages } from "../services/message.service.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, messages } = req.body;
        const messageText = message ?? messages;

        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const newMessage = await createMessage({
            senderId,
            receiverId,
            messageText
        });

        // SOCKET.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).send(newMessage);

    } catch (error) {
        console.log(`error in sendMessage ${error}`);
        res.status(500).send({
            success: false,
            message: error.message || error
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const messages = await fetchMessages({
            senderId,
            receiverId
        });

        res.status(200).send(messages);

    } catch (error) {
        console.log(`error in getMessages ${error}`);
        res.status(500).send({
            success: false,
            message: error.message || error
        });
    }
};