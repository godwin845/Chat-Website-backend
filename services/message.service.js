import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createMessage = async ({ senderId, receiverId, messageText }) => {
    if (!messageText || typeof messageText !== "string") {
        throw new Error("Message is required");
    }

    let chats = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!chats) {
        chats = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        message: messageText,
        conversationId: chats._id
    });

    chats.messages.push(newMessage._id);

    await Promise.all([chats.save(), newMessage.save()]);

    return newMessage;
};

export const fetchMessages = async ({ senderId, receiverId }) => {
    const chats = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!chats) return [];

    return chats.messages;
};