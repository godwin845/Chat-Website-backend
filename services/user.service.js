import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const searchUsers = async ({ search = "", currentUserID }) => {
    const users = await User.find({
        $and: [
            {
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { fullname: { $regex: search, $options: "i" } }
                ]
            },
            {
                _id: { $ne: currentUserID }
            }
        ]
    })
    .select("-password -email");

    return users;
};


export const getChatters = async ({ currentUserID }) => {

    const conversations = await Conversation.find({
        participants: currentUserID
    }).sort({ updatedAt: -1 });

    if (!conversations.length) return [];

    // Extract unique participant IDs (excluding current user)
    const participantSet = new Set();

    conversations.forEach(convo => {
        convo.participants.forEach(id => {
            if (id.toString() !== currentUserID.toString()) {
                participantSet.add(id.toString());
            }
        });
    });

    const participantIds = [...participantSet];

    const users = await User.find({
        _id: { $in: participantIds }
    }).select("-password -email");

    // Preserve order based on conversations
    const orderedUsers = participantIds.map(id =>
        users.find(user => user._id.toString() === id)
    );

    return orderedUsers;
};